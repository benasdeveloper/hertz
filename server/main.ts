import express from "express";
import { prisma } from "../prisma/client";
import { appRouter } from "./router";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { renderTrpcPanel } from "trpc-panel";

const app = express();
const port = 4000;

app.use("/panel", (_, res) =>
  res.send(renderTrpcPanel(appRouter, { url: "/trpc" })),
);

app.use(
  "/",
  createExpressMiddleware({
    router: appRouter,
  }),
);

const server = app.listen(port, () => {
  console.log(`API listening on ${port}`);
});

process.on("SIGTERM", async () => {
  try {
    await new Promise((resolve) => server.close(resolve));
    await prisma.$disconnect();
  } catch (e) {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }
});
