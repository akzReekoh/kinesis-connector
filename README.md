# AWS Kinesis Connector
[![Build Status](https://travis-ci.org/Reekoh/kinesis-connector.svg)](https://travis-ci.org/Reekoh/kinesis-connector)
![Dependencies](https://img.shields.io/david/Reekoh/kinesis-connector.svg)
![Dependencies](https://img.shields.io/david/dev/Reekoh/kinesis-connector.svg)
![Built With](https://img.shields.io/badge/built%20with-gulp-red.svg)

AWS Kinesis Connector Plugin for the Reekoh IoT Platform. Integrates a Reekoh instance with AWS Kinesis Streams to push and synchronise device data to the AWS Pipeline.

## Description
This plugin saves all data from connected devices to the Reekoh Instance to an AWS Kinesis Stream.

## Configuration
To configure this plugin, an Amazon AWS Kinesis account and Kinesis stream is needed to provide the following:

1. Access Key ID - AWS Access Key ID to use.
2. Secret Access Key - AWS Secret Access Key to use.
3. Region - AWS Region to use.
4. API Version - AWS API Version to use.
5. Stream Name - AWS Kinesis Stream Name to use.
6. Partition Key - Corresponding AWS Kinesis Stream Partition Key to use (this is the shard ID).

These parameters are then injected to the plugin from the platform.