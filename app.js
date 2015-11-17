'use strict';

var _        = require('lodash'),
	AWS      = require('aws-sdk'),
	platform = require('./platform'),
	config, kinesis;

/*
 * Listen for the data event.
 */
platform.on('data', function (data) {
	if (_.isPlainObject(data)) {
		var params = {
			Data: JSON.stringify(data),
			PartitionKey: config.PartitionKey,
			StreamName: config.StreamName
		};

		kinesis.putRecord(params, function (error) {
			if (error)
				platform.handleException(error);
			else {
				platform.log(JSON.stringify({
					title: 'Kinesis record saved.',
					data: {
						Data: data,
						PartitionKey: config.PartitionKey,
						StreamName: config.StreamName
					}
				}));
			}
		});
	}
	else
		platform.handleException(new Error('Invalid data received.'));
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
		PartitionKey: options.partition_key,
		StreamName: options.stream_name
	};

	kinesis = new AWS.Kinesis({
		accessKeyId: options.access_key_id,
		secretAccessKey: options.secret_access_key,
		region: options.region,
		version: options.api_version,
		sslEnabled: true
	});

	platform.log('Kinesis Connector Initialized.');
	platform.notifyReady();
});