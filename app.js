'use strict'

let reekoh = require('reekoh')
let _plugin = new reekoh.plugins.Connector()
let isArray = require('lodash.isarray')
let isPlainObject = require('lodash.isplainobject')
let kinesis = null

/**
 * Emitted when device data is received.
 * This is the event to listen to in order to get real-time data feed from the connected devices.
 * @param {object} data The data coming from the device represented as JSON Object.
 */
_plugin.on('data', (data) => {
  if (isPlainObject(data) || isArray(data)) {
    let params = {
      Data: JSON.stringify(data),
      PartitionKey: _plugin.config.PartitionKey,
      StreamName: _plugin.config.StreamName
    }

    kinesis.putRecord(params, function (error) {
      if (error) {
        _plugin.logException(error)
      } else {
        _plugin.log(JSON.stringify({
          title: 'Kinesis record saved.',
          data: {
            Data: data,
            PartitionKey: _plugin.config.PartitionKey,
            StreamName: _plugin.config.StreamName
          }
        }))
      }
    })
  } else {
    _plugin.logException(new Error('Invalid data received.'))
  }
})

/**
 * Emitted when the platform bootstraps the plugin. The plugin should listen once and execute its init process.
 */
_plugin.once('ready', () => {
  let AWS = require('aws-sdk')

  kinesis = new AWS.Kinesis({
    accessKeyId: _plugin.config.accessKeyId,
    secretAccessKey: _plugin.config.secretAccessKey,
    region: _plugin.config.region,
    version: _plugin.config.apiVersion,
    sslEnabled: true
  })

  _plugin.log('Kinesis Connector has been initialized.')
  _plugin.emit('init')
})

module.exports = _plugin
