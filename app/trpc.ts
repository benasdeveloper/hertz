import {
  createTRPCReact,
  type inferReactQueryProcedureOptions,
} from "@trpc/react-query";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "../server/router.ts";

export const trpc = createTRPCReact<AppRouter>();

export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;

export type SearchResponse = RouterOutputs["vehicles"]["search"];
export type Pagination = SearchResponse["pagination"];
export type Vehicle = SearchResponse["vehicles"][0];

export type VehicleOptions = RouterOutputs["vehicles"]["options"];
