

import { Server } from "node:http";
import mongoose from "mongoose";

import app from "./app";
import { envVars } from "./app/config/env";

let server: Server;
const startServer = async () => {
  try {
  
    await mongoose.connect(envVars.DB_URL);
    console.log("connected to DB!!");
    server = app.listen(envVars.PORT, () => {
      console.log(`server is listing to the port ${envVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();

// unhandled rejection

process.on("unhandledRejection", (error) => {
  console.log(
    "unhandled Rejection detected... server shutting down....",
    error,
  );

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// uncaught rejection
process.on("uncaughtException", (error) => {
  console.log(
    "uncaughtException Rejection detected... server shutting down....",
    error,
  );

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// sigterm
process.on("SIGTERM", (error) => {
  console.log("SIGTERM Rejection detected... server shutting down....", error);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT Rejection receive... server shutting down....");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Promise.reject(new Error("i forget to catch this Promise"))

//throw new Error("I Forget To handle the local error")



