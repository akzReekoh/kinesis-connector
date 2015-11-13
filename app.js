'use strict';

var platform = require('./platform'),
	config;

/*
 * Listen for the data event.
 */
platform.on('data', function (data) {
    var AWS = require('aws-sdk'),
        kinesis = new AWS.Kinesis({
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            region: config.region,
            version: config.apiVersion,
            sslEnabled: true
        }),
        params = {
            Data: JSON.stringify(data),
            PartitionKey: config.PartitionKey,
            StreamName: config.StreamName
        };

    kinesis.putRecord(params, function(error, response){
        if(error) platform.handleException(error);
        else{
            platform.log(JSON.stringify({
                title: 'Kinesis record saved.',
                data: params
            }));
        }
    });
});

/*
 * Event to listen to in order to gracefully release all resources bound to this service.
 */
platform.on('close', function () {
    platform.notifyClose();
});

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {
    //set config params
    config = {
        accessKeyId : options.access_key_id,
        secretAccessKey : options.secret_access_key,
        region : options.region,
        version : options.api_version,
        PartitionKey: options.partition_key,
        StreamName: options.stream_name
    };

    platform.log('Kinesis Connector Initialized.');
	platform.notifyReady();
});