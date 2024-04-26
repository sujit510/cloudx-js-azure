import { CosmosClient } from "@azure/cosmos";
import { config } from 'dotenv';
config();

const key = process.env.COSMOS_KEY;
const endpoint = process.env.COSMOS_ENDPOINT;

const databaseName = `products-db`;
const productsContainerName = `products`;
const stocksContainerName = `stocks`;

const cosmosClient = new CosmosClient({ endpoint, key });

const database = cosmosClient.database(databaseName);
export const productsContainer = database.container(productsContainerName);
export const stocksContainer = database.container(stocksContainerName);