'use strict'

const amqp = require('amqplib')

const STREAM_NAME = 'kinesisConnectorTestStream'
const PARTITION_KEY = 'shardId-000000000000'
const REGION = 'us-west-2'
const API_VERSION = '2013-12-02'
const ACCESS_KEY_ID = 'AKIAJCDH5ZSQYJHPXOZQ'
const SECRET_ACCESS_KEY= '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'

let _channel = null
let _conn = null
let app = null

describe('Kinesis Connector Test', () => {
  before('init', () => {
    process.env.ACCOUNT = 'adinglasan'
    process.env.CONFIG = JSON.stringify({
    accessKeyId: ACCESS_KEY_ID,
      secretAccessKey : SECRET_ACCESS_KEY,
      region : REGION,
      apiVersion : API_VERSION,
      streamName: STREAM_NAME,
      partitionKey: PARTITION_KEY
    })
    process.env.INPUT_PIPE = 'ip.kinesis'
    process.env.LOGGERS = 'logger1, logger2'
    process.env.EXCEPTION_LOGGERS = 'ex.logger1, ex.logger2'
    process.env.BROKER = 'amqp://guest:guest@127.0.0.1/'

    amqp.connect(process.env.BROKER)
      .then((conn) => {
        _conn = conn
        return conn.createChannel()
      }).then((channel) => {
      _channel = channel
    }).catch((err) => {
      console.log(err)
    })
  })

  after('close connection', function (done) {
    _conn.close()
    done()
  })

  describe('#start', function () {
    it('should start the app', function (done) {
      this.timeout(10000)
      app = require('../app')
      app.once('init', done)
    })
  })

  describe('#data', () => {
    it('should send data to third party client', function (done) {
      this.timeout(15000)

      let data = {
          title: 'Test Message',
          message: 'This is a test message from AWS Kinesis connector plugin.'
        }

      _channel.sendToQueue('ip.kinesis', new Buffer(JSON.stringify(data)))
      setTimeout(done, 10000)
    })
  })
})
