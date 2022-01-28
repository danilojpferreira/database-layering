export const mongoUri: string =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/";
export const port: number = parseInt(process.env.PORT, 10) || 3000;
export const database: string = process.env.DATABASE || "main";
