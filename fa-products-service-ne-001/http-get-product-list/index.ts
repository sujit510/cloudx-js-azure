import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { productsContainer, stocksContainer } from "../db";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('Incoming request for get product list');
    const productsResponse = await productsContainer.items.query({ query: `select * from c` }).fetchAll();
    const stocksResponse = await stocksContainer.items.query({ query: `select * from c` }).fetchAll();
    context.res = {
        body: productsResponse.resources.map(product => ({
            ...product,
            count: stocksResponse.resources.find(stock => stock.product_id === product.id)?.count
        }))
    };

};

export default httpTrigger;