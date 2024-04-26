import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { productsContainer } from "../db";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('Incoming request for get products total');
    const response = await productsContainer.items.query({ query: `select * from c` }).fetchAll();
    context.res = {
        body: response?.resources?.length ?? 0
    };

};

export default httpTrigger;