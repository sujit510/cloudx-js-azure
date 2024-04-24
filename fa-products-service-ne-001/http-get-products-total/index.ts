import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { dbContainer } from "../db";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('Incoming request for get products total');
    const response = await dbContainer.items.query({ query: `select * from c` }).fetchAll();
    context.res = {
        body: response?.resources?.length ?? 0
    };

};

export default httpTrigger;