import { prisma } from "./client";

interface FleetVehicle {
  make: string;
  model: string;
  doors: number;
  max_passengers: number;
  classification: string;
  thumbnail_url: string;
}

const NUM_VEHICLES = 100;
const MODEL_YEARS = [2020, 2021, 2022, 2023, 2024, 2025];

const FLEET_VEHICLES: FleetVehicle[] = [
  {
    make: "Toyota",
    model: "Corolla",
    doors: 4,
    max_passengers: 5,
    classification: "Compact",
    thumbnail_url: "/cars/corolla.png",
  },
  {
    make: "Honda",
    model: "Civic",
    doors: 4,
    max_passengers: 5,
    classification: "Compact",
    thumbnail_url: "/cars/civic.png",
  },
  {
    make: "Ford",
    model: "Mustang",
    doors: 2,
    max_passengers: 4,
    classification: "Sports",
    thumbnail_url: "/cars/mustang.png",
  },
  {
    make: "Chevrolet",
    model: "Spark",
    doors: 4,
    max_passengers: 4,
    classification: "Subcompact",
    thumbnail_url: "/cars/spark.png",
  },
  {
    make: "Nissan",
    model: "Rogue",
    doors: 5,
    max_passengers: 5,
    classification: "SUV",
    thumbnail_url: "/cars/rogue.png",
  },
  {
    make: "Hyundai",
    model: "Santa Fe",
    doors: 5,
    max_passengers: 7,
    classification: "SUV",
    thumbnail_url: "/cars/santafe.png",
  },
  {
    make: "Volkswagen",
    model: "Golf",
    doors: 5,
    max_passengers: 5,
    classification: "Compact",
    thumbnail_url: "/cars/golf.png",
  },
  {
    make: "Mazda",
    model: "CX-9",
    doors: 5,
    max_passengers: 7,
    classification: "SUV",
    thumbnail_url: "/cars/cx9.png",
  },
  {
    make: "Chrysler",
    model: "Pacifica",
    doors: 5,
    max_passengers: 8,
    classification: "Minivan",
    thumbnail_url: "/cars/pacifica.png",
  },
  {
    make: "BMW",
    model: "X5",
    doors: 5,
    max_passengers: 7,
    classification: "Luxury SUV",
    thumbnail_url: "/cars/x5.png",
  },
  {
    make: "Mercedes-Benz",
    model: "C-Class",
    doors: 4,
    max_passengers: 5,
    classification: "Luxury",
    thumbnail_url: "/cars/cclass.png",
  },
  {
    make: "Jeep",
    model: "Wrangler",
    doors: 2,
    max_passengers: 4,
    classification: "Off-Road SUV",
    thumbnail_url: "/cars/wrangler.png",
  },
];

function priceFleetVehicle(fleetVehicle: FleetVehicle) {
  return (fleetVehicle.doors * fleetVehicle.max_passengers + 12) * 100;
}

interface DurationRange {
  min: number;
  max: number;
}

interface ScheduleParams {
  numDays?: number;
  dailyStartHour?: number;
  dailyEndHour?: number;
  reservationDuration?: DurationRange;
  gapDuration?: DurationRange;
  reservationProbability?: number;
}

function createReservationSchedule({
  numDays = 30,
  dailyStartHour = 5,
  dailyEndHour = 24,
  reservationDuration = { min: 0.5, max: 6 },
  gapDuration = { min: 1, max: 8 },
  reservationProbability = 0.3,
}: ScheduleParams = {}) {
  const schedule = [];
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0); // Start at midnight

  for (let day = 0; day < numDays; day++) {
    let currentTime = new Date(startDate);
    currentTime.setDate(currentTime.getDate() + day);
    currentTime.setHours(dailyStartHour, 0, 0, 0);

    const endTime = new Date(currentTime);
    endTime.setHours(dailyEndHour, 0, 0, 0);

    while (currentTime < endTime) {
      if (Math.random() < reservationProbability) {
        // Round current time to nearest 30 minutes
        currentTime.setMinutes(Math.round(currentTime.getMinutes() / 30) * 30);

        // Generate a random duration within the specified range
        const durationHours =
          reservationDuration.min +
          Math.random() * (reservationDuration.max - reservationDuration.min);
        const roundedDurationHours = Math.round(durationHours * 2) / 2; // Round to nearest 0.5

        // Calculate reservation end time
        const reservationEnd = new Date(
          currentTime.getTime() + roundedDurationHours * 60 * 60 * 1000,
        );

        // Check if the reservation would extend past the daily end time
        if (reservationEnd <= endTime) {
          schedule.push({
            startTime: new Date(currentTime),
            endTime: new Date(reservationEnd),
            durationHours: roundedDurationHours,
          });

          currentTime = new Date(reservationEnd);
        } else {
          // If it would extend past the daily end time, end the day
          break;
        }
      } else {
        // Add a gap within the specified range
        const gapHours =
          gapDuration.min + Math.random() * (gapDuration.max - gapDuration.min);
        const gapDurationMs = Math.round(gapHours * 60 * 60 * 1000);
        currentTime = new Date(currentTime.getTime() + gapDurationMs);
      }
    }
  }

  // Sort the schedule by start time
  schedule.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  return schedule;
}

async function resetTables() {
  await prisma.vehicle.deleteMany();
  await prisma.reservation.deleteMany();
}

function pickRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function createVehiclesAndReservations() {
  for (let i = 0; i < NUM_VEHICLES; i++) {
    const fleetVehicle = pickRandomItem(FLEET_VEHICLES);
    const hourlyRateCents = priceFleetVehicle(fleetVehicle);
    await prisma.vehicle.create({
      data: {
        make: fleetVehicle.make,
        model: fleetVehicle.model,
        doors: fleetVehicle.doors,
        max_passengers: fleetVehicle.max_passengers,
        thumbnail_url: fleetVehicle.thumbnail_url,
        classification: fleetVehicle.classification,
        year: pickRandomItem(MODEL_YEARS),
        hourly_rate_cents: hourlyRateCents,
        reservations: {
          createMany: {
            data: createReservationSchedule().map(
              ({ startTime, endTime, durationHours }) => ({
                start_time: startTime,
                end_time: endTime,
                total_price_cents: hourlyRateCents * durationHours,
              }),
            ),
          },
        },
      },
    });
  }
}

async function checkDatabase() {
  try {
    await prisma.vehicle.findMany();
    await prisma.reservation.findMany();
  } catch (e) {
    throw new Error(
      "Error connecting to database. Have you run `npm run db:init`?",
    );
  }
}

async function main() {
  await checkDatabase();
  await resetTables();
  await createVehiclesAndReservations();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
