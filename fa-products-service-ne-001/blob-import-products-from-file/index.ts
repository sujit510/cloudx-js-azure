import { AzureFunction, Context } from "@azure/functions"
import { ServiceBusClient, ServiceBusSender } from "@azure/service-bus";

import csvParser = require( "csv-parser" );
import { Stream } from "stream";
const connectionString = process.env['MyServiceBusConnection'];
const queueName = "sujit_new_servicebus_queue";

const blobTrigger: AzureFunction = async function (context: Context, myBlob: any): Promise<void> {
    context.log("Blob trigger function processed blob... \n Name:", context.bindingData.name, "\n Blob Size:", myBlob.length, "Bytes");
    return new Promise((resolve, reject) => {
        try {
            const sbClient = new ServiceBusClient(connectionString);
            context.log('ServiceBusClient created!!');

            const sender = sbClient.createSender(queueName);
            context.log('ServiceBusClient sender created!!');

            let bufferStream = new Stream.PassThrough();
            let messages = [];
            context.log('bufferStream created!!');
            bufferStream.end(Buffer.from(myBlob));
            bufferStream.pipe(csvParser())
                .on('data', async (row, index) => {
                    context.log(`Found Row ${index}::`, JSON.stringify(row));

                    console.log(`Current message: ${row}`);
                    messages.push({
                        body: row
                    });
                })
                .on('error', async (err) => {
                    context.log('Error occurred while processing Blob::', err);
                    reject(err)
                })
                .on('end', async () => {
                    context.log('Finished reading CSV file.. now publishing to service bus::');
                    try {
                        await sender.sendMessages(messages);
                        console.log(`Sent ${messages.length} messages successfully`);
                    } catch (err) {
                        context.log('Error while sending messages to Q:', err);
                        reject(err);
                    } finally {
                        await sender?.close();
                        await sbClient?.close();
                        resolve();
                    }
                });
        } catch (err) {
            context.log('Error in handler while processing Blobs::', err);
            reject(err)
        }
    })
};

export default blobTrigger;
