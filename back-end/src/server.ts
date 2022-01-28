/* eslint-disable @typescript-eslint/no-unused-vars */
import "dotenv/config";
import "express-async-errors";

import cors from "cors";

import { errors } from "celebrate";
import express, { Request, Response, NextFunction } from "express";

import AppError from "./shared/AppError";
import { port } from "./utils/config";
import { router } from "./routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);
app.use(errors());
app.use(
  (err: Error, request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message} `,
    });
  }
);

app.listen(port, () => console.log(`Server started on port ${port}!🚀`));
