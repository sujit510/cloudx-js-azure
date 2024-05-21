import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import {
    BlobSASPermissions,
    BlobServiceClient,
    SASProtocol,
    generateBlobSASQueryParameters
} from "@azure/storage-blob";
import { config } from 'dotenv';
config();

const httpTrigger: AzureFunction = async function ( context: Context, req: HttpRequest ): Promise<void> {
    context.log('Received request for /import endpoint>>>');
    // const name = (req.query.name || (req.body && req.body.name));
    // const responseMessage = name
    //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
    //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    // context.res = {
    //     // status: 200, /* Defaults to 200 */
    //     body: responseMessage
    // };

    const containerName = "container-for-import";
    // If you don't have your connection string, navigate to the azure portal, locate your storage account.
    const connectionString = process.env.STORAGE_ACC_CONNECTION_STRING;
    const blobName = 'myfile.csv';

    // Create a service client
    const blobServiceClient = BlobServiceClient.fromConnectionString( connectionString );
    const containerClient = blobServiceClient.getContainerClient( containerName );

    const getBlobSasUrl = ( containerClient, blobName ) => {
        const blobClient = containerClient.getBlobClient( blobName );

        const startDate = new Date();
        const expiryDate = new Date( startDate );
        expiryDate.setMinutes( startDate.getMinutes() + 100 );
        startDate.setMinutes( startDate.getMinutes() - 100 );

        const sasKey = generateBlobSASQueryParameters( {
            blobName,
            permissions: BlobSASPermissions.parse( "rwd" ),
            protocol: SASProtocol.Https,
            version: "2019-12-12",
            containerName,
            expiresOn: expiryDate,
            startsOn: startDate
        }, containerClient.credential ).toString();

        return `${ blobClient.url }?${ sasKey }`;
    }

    try {
        context.log('Attempting to invoke getBlobSasUrl with params as ',
            containerClient, 'blobName>>>', blobName)
        const sasToken = getBlobSasUrl( containerClient, blobName );

        context.log('Received sasToken as::', sasToken)
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: sasToken
        };
    } catch (err) {
        context.log('Exception occured inside /import handler', err)
        context.res = {
            status: 500, /* Defaults to 200 */
            body: err
        };
    }
};

// const httpTriggerTest: AzureFunction = async function ( context: Context, req: HttpRequest ): Promise<void> {
//     context.res = {
//         // status: 200, /* Defaults to 200 */
//         body: "Success123"
//     };
// }

export default httpTrigger;