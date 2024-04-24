import { CosmosClient } from "@azure/cosmos";
import { config } from 'dotenv';
config();

const key = process.env.COSMOS_KEY;
const endpoint = process.env.COSMOS_ENDPOINT;

const databaseName = `products`;
const containerName = `products`;

const cosmosClient = new CosmosClient({ endpoint, key });

const database = cosmosClient.database(databaseName);
export const dbContainer = database.container(containerName);