import { prisma } from "../prisma/client.ts";
import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { TRPCPanelMeta } from "trpc-panel";

const t = initTRPC.meta<TRPCPanelMeta>().create();

export const router = t.router;
export const procedure = t.procedure;

const parseAndValidateTimeRange = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (
    start.toString() === "Invalid Date" ||
    end.toString() === "Invalid Date"
  ) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid date format. Please use ISO 8601 format.",
    });
  }

  if (end <= start) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "end_time must be after start_time",
    });
  }
  return { start, end };
};

const calculateTotalPrice = (
  start: Date,
  end: Date,
  hourlyRateCents: number,
) => {
  const durationInHours =
    (end.getTime() - start.getTime()) / (1000 * 60 * 60) || 0;
  return {
    totalPriceCents: hourlyRateCents * durationInHours,
    hourlyRateCents,
    durationInHours,
  };
};

const validateReservationAndGetVehicle = async (input: {
  vehicleId: string;
  startTime: string;
  endTime: string;
}) => {
  const { vehicleId, startTime, endTime } = input;
  const { start, end } = parseAndValidateTimeRange(startTime, endTime);

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  });

  if (!vehicle) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Vehicle not found",
    });
  }

  return { vehicle, start, end };
};

const vehicleRouter = router({
  search: procedure
    .input(
      z.object({
        page: z.number().default(1).describe("The page number for pagination."),
        limit: z
          .number()
          .default(10)
          .describe("The number of results per page."),
        startTime: z.string().describe("The start time for the reservation."),
        endTime: z.string().describe("The end time for the reservation."),
        passengerCount: z
          .number()
          .default(1)
          .describe("The minimum passenger count."),
        make: z
          .array(z.string())
          .optional()
          .describe("Optional array of vehicle makes."),
        classification: z
          .array(z.string())
          .optional()
          .describe("Optional array of classifications."),
        priceMin: z.number().default(0).describe("The minimum hourly price."),
        priceMax: z
          .number()
          .default(100)
          .describe(
            "The maximum hourly price. When set to 100 or more, there is no maximum.",
          ),
      }),
    )
    .meta({ description: "Searches for available vehicles based on criteria." })
    .query(async ({ input }) => {
      try {
        const {
          startTime,
          endTime,
          page,
          limit,
          passengerCount,
          classification,
          make,
          priceMin,
          priceMax,
        } = input;

        const parsedPage = page;
        const parsedLimit = limit;
        const parsedPriceMin = priceMin;
        const parsedPriceMax =
          priceMax === 100 ? Number.MAX_SAFE_INTEGER : priceMax;
        const parsedPassengerCount = passengerCount;

        const classifications = classification || [];
        const makes = make || [];

        const { start, end } = parseAndValidateTimeRange(startTime, endTime);

        const baseWhereClause = {
          reservations: {
            none: {
              OR: [
                { start_time: { lte: end }, end_time: { gt: start } },
                { start_time: { lt: end }, end_time: { gte: start } },
              ],
            },
          },
          max_passengers: {
            gte: parsedPassengerCount,
          },
          ...(classifications.length > 0 && {
            classification: { in: classifications },
          }),
          ...(makes.length > 0 && { make: { in: makes } }),
          hourly_rate_cents: {
            gte: parsedPriceMin * 100,
            lte: parsedPriceMax * 100,
          },
        };

        const availableVehicles = await prisma.vehicle.findMany({
          where: baseWhereClause,
          skip: (parsedPage - 1) * parsedLimit,
          take: parsedLimit,
        });

        const totalCount = await prisma.vehicle.count({
          where: baseWhereClause,
        });

        const totalPages = Math.ceil(totalCount / parsedLimit);

        return {
          vehicles: availableVehicles,
          pagination: {
            currentPage: parsedPage,
            totalPages: totalPages,
            totalItems: totalCount,
            itemsPerPage: parsedLimit,
          },
        };
      } catch (error) {
        console.error("Error searching for vehicles:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while searching for vehicles",
        });
      }
    }),

  options: procedure
    .meta({ description: "Fetches available vehicle options." })
    .query(async () => {
      try {
        const vehicles = await prisma.vehicle.findMany({
          select: {
            make: true,
            classification: true,
            max_passengers: true,
          },
          distinct: ["make", "classification", "max_passengers"],
        });

        const uniqueMakes = [...new Set(vehicles.map((v) => v.make))].sort();
        const uniqueClassifications = [
          ...new Set(vehicles.map((v) => v.classification)),
        ].sort();
        const uniquePassengerCounts = [
          ...new Set(vehicles.map((v) => v.max_passengers)),
        ].sort((a, b) => a - b);

        return {
          makes: uniqueMakes,
          classifications: uniqueClassifications,
          passengerCounts: uniquePassengerCounts,
        };
      } catch (error) {
        console.error("Error fetching vehicle options:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching vehicle options",
        });
      }
    }),

  get: procedure
    .input(z.object({ id: z.string().describe("The ID of the vehicle.") }))
    .meta({ description: "Retrieves details of a specific vehicle by ID." })
    .query(async ({ input }) => {
      try {
        const vehicle = await prisma.vehicle.findFirst({
          where: {
            id: { equals: input.id },
          },
        });

        if (!vehicle) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Vehicle not found",
          });
        }

        return vehicle;
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching vehicle details",
        });
      }
    }),
});

const reservationRouter = router({
  get: procedure
    .input(z.object({ id: z.string().describe("The ID of the reservation.") }))
    .meta({ description: "Retrieves details of a specific reservation by ID." })
    .query(async ({ input }) => {
      try {
        const reservation = await prisma.reservation.findFirst({
          where: {
            id: { equals: input.id },
          },
          include: {
            vehicle: true,
          },
        });

        if (!reservation) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Reservation not found",
          });
        }

        return reservation;
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching reservation details",
        });
      }
    }),

  quote: procedure
    .input(
      z.object({
        vehicleId: z.string().describe("The ID of the vehicle."),
        startTime: z.string().describe("The start time of the reservation."),
        endTime: z.string().describe("The end time of the reservation."),
      }),
    )
    .meta({
      description:
        "Quotes the total price for a reservation based on vehicle and time.",
    })
    .query(async ({ input }) => {
      try {
        const { vehicle, start, end } =
          await validateReservationAndGetVehicle(input);

        return calculateTotalPrice(start, end, vehicle.hourly_rate_cents);
      } catch (error) {
        console.error("Error quoting vehicle:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while quoting the vehicle",
        });
      }
    }),

  create: procedure
    .input(
      z.object({
        vehicleId: z.string().describe("The ID of the vehicle."),
        startTime: z.string().describe("The start time of the reservation."),
        endTime: z.string().describe("The end time of the reservation."),
      }),
    )
    .meta({ description: "Creates a new reservation for a vehicle." })
    .mutation(async ({ input }) => {
      try {
        const { vehicle, start, end } =
          await validateReservationAndGetVehicle(input);

        const { totalPriceCents } = calculateTotalPrice(
          start,
          end,
          vehicle.hourly_rate_cents,
        );

        return prisma.reservation.create({
          data: {
            vehicle_id: vehicle.id,
            start_time: start,
            end_time: end,
            total_price_cents: totalPriceCents,
          },
        });
      } catch (error) {
        console.error("Error reserving vehicle:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while reserving the vehicle",
        });
      }
    }),
});

export const appRouter = router({
  vehicles: vehicleRouter,
  reservations: reservationRouter,
});

export type AppRouter = typeof appRouter;
