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
    // context.log('HTTP trigger function processed a request.');
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
    const blobName = 'my-awesome-content.zip';

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
            startsOn: startDate,
        }, containerClient.credential ).toString();

        return `${ blobClient.url }?${ sasKey }`;
    }

    try {
        const sasToken = getBlobSasUrl( containerClient, blobName );
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: sasToken
        };
    } catch (err) {
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