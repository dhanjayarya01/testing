import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173 ",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
}));
console.log("CORS_ORIGIN",process.env.MONGODB_URI)

app.use(express.json({limit: "20kb"}));
app.use(express.urlencoded({extended: true, limit: "20kb"}));
app.use(express.static("public"));
app.use(cookieParser());


// import routers
import userRouter from "./routes/user.routes.js";
import walletRouter from "./routes/wallet.routes.js";
import startupRouter from "./routes/startup.routes.js";
import researchRouter from "./routes/research.routes.js";

// routes
app.use("/api/users", userRouter);
app.use("/api/wallet", walletRouter);
app.use("/api/v1/startups", startupRouter);
app.use("/api/v1/research", researchRouter);
export default app;