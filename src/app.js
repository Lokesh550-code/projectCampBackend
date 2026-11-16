import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

// Basic configurations
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// cors configuration
app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN?.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean) || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Import routes
import healthcheckRouter from "./routes/healthcheck.route.js";
import authRouter from "./routes/auth.route.js";

app.get("/", (req, res) => {
  res.send("Welcome to base camppy!");
});

app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/auth", authRouter);

export default app;
