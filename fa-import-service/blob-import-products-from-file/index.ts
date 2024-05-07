import { AzureFunction, Context } from "@azure/functions"
import csvParser = require( "csv-parser" );
import { Stream } from "stream";

const blobTrigger: AzureFunction = async function (context: Context, myBlob: any): Promise<void> {
    context.log("Blob trigger function processed blob \n Name:", context.bindingData.name, "\n Blob Size:", myBlob.length, "Bytes");

    let bufferStream = new Stream.PassThrough();
    bufferStream.end(Buffer.from(myBlob));
    bufferStream.pipe(csvParser())
    .on('data', (row, index) => {
        context.log(`Row ${index}::`, JSON.stringify(row));
    })
    .on('end', () => {
        context.log('Finished reading and processing CSV file');
    });
};

export default blobTrigger;
