#!/usr/bin/env node
require("dotenv").config();
require('../lib/Infrastructure/DB/db');
const log = require("../lib/Infrastructure/Logging/Log");
const SendMailProcessingService = require('../lib/Services/SendMail/SendMailProcessingService');
const SendMailServiceDefinitions = require('../lib/Services/SendMail/SendMailServiceDefinitions');
const cron = require('node-cron');

const Sentry = require('@sentry/node');
Sentry.init({
    dsn: 'https://9cd6cb53abd44405906d0ce1a88ab5cb@sentry.codecactus.com/8',
    environment: process.env.ENV || 'local'
});

cron.schedule('*/5 * * * *', () => {
    SendMailProcessingService.startProcess(SendMailServiceDefinitions.GMAIL, true);
    SendMailProcessingService.startProcess(SendMailServiceDefinitions.CUSTOM, true);
    SendMailProcessingService.startProcess(SendMailServiceDefinitions.AMAZONSES, true);
    SendMailProcessingService.startProcess(SendMailServiceDefinitions.OFFICE365, true);
});