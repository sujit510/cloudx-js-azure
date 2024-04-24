import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { dbContainer } from "../db";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('Incoming request for product creation::', JSON.stringify(req.body));
    if (!req.body.id || !req.body.title || !req.body.price || isNaN(req.body.price) || parseFloat(req.body.price) <= 0) {
        context.res = {
            status: 400,
            message: 'Invalid product data for creation',
        };
        return;
    }
    const response = await dbContainer.items.upsert(req.body);
    context.res = {
        status: response.statusCode,
        body: response.resource,
    };

};

export default httpTrigger;