import { MongoClient } from "mongodb";
import { mongoUri } from "../utils/config";

export async function connect(): Promise<MongoClient> {
  const client = new MongoClient(mongoUri);
  await client.connect();
  return client;
}
