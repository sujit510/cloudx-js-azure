import { AzureFunction, Context } from "@azure/functions"
import { productsContainer, stocksContainer } from "../db";

const serviceBusQueueTrigger: AzureFunction = async function(context: Context, mySbMsg: any): Promise<void> {
    context.log('ServiceBus queue trigger function processed message::', mySbMsg);

    const productResponse = await productsContainer.items.upsert({
        id: mySbMsg.id,
        title: mySbMsg.title,
        description: mySbMsg.description,
        price: mySbMsg.price,
    });
    const stockResponse = await stocksContainer.items.upsert({
        product_id: mySbMsg.id,
        count: mySbMsg.count,
    });
    if (productResponse.statusCode === 200) {
        context.log(`Product ${mySbMsg.id} inserted successfully`);
    } else {
        context.log(`Error while inserting product ${mySbMsg.id}`);
    }
    if (stockResponse.statusCode === 200) {
        context.log(`Product count for ${mySbMsg.id} inserted successfully`);
    } else {
        context.log(`Error while inserting product count for ${mySbMsg.id}`)
    }
};

export default serviceBusQueueTrigger;
