import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { productsContainer, stocksContainer } from "../db";
import { omit, pick } from "../const";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('Incoming request for product creation::', JSON.stringify(req.body));
    if (!req.body.id || !req.body.title || !req.body.price || !req.body.count
        || isNaN(req.body.price) || parseFloat(req.body.price) <= 0
        || isNaN(req.body.count) || parseFloat(req.body.count) <= 0
    ) {
        context.res = {
            status: 400,
            message: 'Invalid product data for creation',
        };
        return;
    }
    const productResponse = await productsContainer.items.upsert({
        id: req.body.id,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
    });
    const stockResponse = await stocksContainer.items.upsert({
        product_id: req.body.id,
        count: req.body.count,
    });
    context.res = {
        status: productResponse.statusCode,
        body: {
            product: productResponse.resource,
            stock: stockResponse.resource
        },
    };
};

export default httpTrigger;