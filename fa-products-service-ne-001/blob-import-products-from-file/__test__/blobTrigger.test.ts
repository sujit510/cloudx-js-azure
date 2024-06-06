import { Context } from "@azure/functions";
import { ServiceBusSender } from "@azure/service-bus";
import { PassThrough, Stream } from "stream";
import blobTrigger from "../index";

import { ServiceBusClient } from "@azure/service-bus";

let context: Context;
let myBlob: Buffer;
let sbClientMock: jest.Mocked<ServiceBusClient>;
let senderMock: jest.Mocked<ServiceBusSender>;

jest.mock("@azure/service-bus", () => {
    return {
        ServiceBusClient: jest.fn().mockImplementation(() => ({
            createSender: jest.fn().mockImplementation(() => ({
                sendMessages: jest.fn().mockResolvedValue(undefined),
                close: jest.fn().mockResolvedValue(undefined)
            })),
            close: jest.fn().mockResolvedValue(undefined)
        }))
    };
});

jest.mock('csv-parser');
const csvBlobContent = "id,title,description,price,count\n10,\"Learn HTML\",\"\",1500,78\n99,\"Learn CSS\",\"Learn Delicious Styling\",450,36";

describe("BlobTrigger Function", () => {

    beforeEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
        context = <Context><unknown> {
            log: jest.fn(),
            bindingData: {
                name: "testBlob"
            }
        };
        myBlob = Buffer.from(csvBlobContent);
        
        process.env['MyServiceBusConnection'] = 'fake_connection_string';

        sbClientMock = new (ServiceBusClient as jest.Mock<ServiceBusClient>)() as jest.Mocked<ServiceBusClient>;
        senderMock = {
            sendMessages: jest.fn().mockResolvedValueOnce( undefined ),
            close: jest.fn().mockResolvedValueOnce( undefined )
        } as unknown as jest.Mocked<ServiceBusSender>;

        sbClientMock.createSender.mockReturnValue(senderMock);
        (ServiceBusClient as jest.Mock).mockImplementation(() => sbClientMock);
    });

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    it("should send messages to Service Bus and close sender and client", async () => {
        const passThroughMock = new PassThrough();
        jest.spyOn(passThroughMock, "pipe").mockImplementationOnce(() => passThroughMock);
        jest.spyOn(Stream, 'PassThrough').mockImplementation(() => passThroughMock);

        await blobTrigger(context, myBlob);

        // Check if pipe method was called
        expect(passThroughMock.pipe).toHaveBeenCalled();

        // Verify that ServiceBusClient and its methods were called as expected
        expect(sbClientMock.createSender).toHaveBeenCalledWith("sujit_new_servicebus_queue");
        expect(senderMock.sendMessages).toHaveBeenCalled(); // Check if sendMessages was called
        expect(senderMock.close).toHaveBeenCalled(); // Check if sender.close was called
        expect(sbClientMock.close).toHaveBeenCalled(); // Check if client.close was called
    });
});
