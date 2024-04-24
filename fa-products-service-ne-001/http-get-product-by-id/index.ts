import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { dbContainer } from "../db";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('Incoming request for get product by id for productId::', JSON.stringify(req.params.productId));
    const response = await dbContainer.items.query({ query: `select * from c WHERE c.id="${req.params.productId}"` }).fetchAll();
    context.res = {
        status: response.resources.length ? 200 : 404,
        body: response.resources[0]
    };

};

export default httpTrigger;