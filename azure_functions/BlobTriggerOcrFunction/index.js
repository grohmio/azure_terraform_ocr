'use strict';

const async = require('async');
const fs = require('fs');
const https = require('https');
const path = require("path");
const createReadStream = require('fs').createReadStream
const sleep = require('util').promisify(setTimeout);
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

/**
 * AUTHENTICATE
 * This single client is used for all examples.
 */
const key = 'YOUR-COGNITIVE-SERVICE-KEY';
const endpoint = 'YOUR-COGNITIVE-SERVICE-ENDPOINT-URL';

const computerVisionClient = new ComputerVisionClient(
    new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);

function computerVision(context, myBlob) {

    async.series([
        async function () {
            const printedTextSampleURL = context.bindingData.uri;

            // Status strings returned from Read API. NOTE: CASING IS SIGNIFICANT.
            // Before Read 3.0, these are "Succeeded" and "Failed"
            const STATUS_SUCCEEDED = "succeeded";
            const STATUS_FAILED = "failed"

            /**
             * OCR: READ PRINTED & HANDWRITTEN TEXT WITH THE READ API
             * Extracts text from images using OCR (optical character recognition).
             */
            context.log();
            context.log('-------------------------------------------------');
            context.log('READ PRINTED, HANDWRITTEN TEXT AND PDF');
            context.log();
            context.log('-----', printedTextSampleURL, '---------');
            context.log('-------------------------------------------------');

            // Recognize text in printed image from a URL
            context.log('Read printed text from URL...', printedTextSampleURL.split('/').pop());
            const printedResult = await readTextFromURL(computerVisionClient, printedTextSampleURL);
            printRecText(context, printedResult);

            // Perform read and await the result from URL
            async function readTextFromURL(client, url) {
                // To recognize text in a local image, replace client.read() with readTextInStream() as shown:
                let result = await client.read(url);
                // Operation ID is last path segment of operationLocation (a URL)
                let operation = result.operationLocation.split('/').slice(-1)[0];

                // Wait for read recognition to complete
                // result.status is initially undefined, since it's the result of read
                while (result.status !== STATUS_SUCCEEDED) { await sleep(1000); result = await client.getReadResult(operation); }
                return result.analyzeResult.readResults; // Return the first page of result. Replace [0] with the desired page if this is a multi-page file such as .pdf or .tiff.
            }

            // Prints all text from Read result
            function printRecText(context,readResults) {
                context.log('Recognized text:');
                for (const page in readResults) {
                    if (readResults.length > 1) {
                        context.log(`==== Page: ${page}`);
                    }
                    const result = readResults[page];
                    if (result.lines.length) {
                        for (const line of result.lines) {
                            context.log(line.words.map(w => w.text).join(' '));
                        }
                    }
                    else { context.log('No recognized text.'); }
                }
            }
        },
        function () {
            return new Promise((resolve) => {
                resolve();
            })
        }
    ], (err) => {
        throw (err);
    });
}

module.exports = function (context, myBlob) {
    computerVision(context, myBlob);
};