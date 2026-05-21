"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
let server;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect("mongodb+srv://imranhasanbd212_db_user:ECcSRxOoN7LXYgJx@cluster0.cjsxoye.mongodb.net/tour-management-backend");
        console.log("connected to DB!!");
        server = app_1.default.listen(5000, () => {
            console.log("25-10 server is listing to the port 5000 ");
        });
    }
    catch (error) {
        console.log(error);
    }
});
startServer();
// unhandled rejection
process.on("unhandledRejection", (error) => {
    console.log("unhandled Rejection detected... server shutting down....", error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// uncaught rejection
process.on("uncaughtException", (error) => {
    console.log("uncaughtException Rejection detected... server shutting down....", error);
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
