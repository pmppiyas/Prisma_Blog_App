import compression from "compression";
import cors from "cors";
import express from "express";
import router from "./routes";
import { globalErrorHandler } from "./middleware/globalErrorhandler";

const app = express();

app.use(cors());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (_req, res) => {
  res.send("API is running");
});

app.use("/api/v1", router);
app.use(globalErrorHandler);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
