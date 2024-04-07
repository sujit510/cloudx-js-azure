import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { products } from "../const";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: products
    };

};

export default httpTrigger;