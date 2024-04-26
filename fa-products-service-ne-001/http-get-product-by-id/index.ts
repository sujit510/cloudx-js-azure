import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { productsContainer, stocksContainer } from "../db";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('Incoming request for get product by id for productId::', JSON.stringify(req.params.productId));
    const productsResponse = await productsContainer.items.query({ query: `select * from c WHERE c.id="${req.params.productId}"` }).fetchAll();
    const stocksResponse = await stocksContainer.items.query({ query: `select * from c WHERE c.product_id="${req.params.productId}"` }).fetchAll();
    context.res = {
        status: productsResponse.resources.length ? 200 : 404,
        body: productsResponse.resources[0] ? {
            ...productsResponse.resources[0],
            count: stocksResponse?.resources?.[0]?.count ?? 0
        } : {},
    };

};

export default httpTrigger;