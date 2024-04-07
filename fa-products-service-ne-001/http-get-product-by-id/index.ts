import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { products } from "../const";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const name = (req.query.name || (req.body && req.body.name));
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: products.find((product) => product.id === req.params.productId)
    };

};

export default httpTrigger;