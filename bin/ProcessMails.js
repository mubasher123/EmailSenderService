#!/usr/bin/env node
require("dotenv").config();
require('./ProcessMailsCron.js');
const program = require('commander');
const mongoose = require('../lib/Infrastructure/DB/db');
const Consumer = require("../lib/Services/Consumer");
const log = require("../lib/Infrastructure/Logging/Log");

const Sentry = require('@sentry/node');
Sentry.init({
    dsn: 'https://9cd6cb53abd44405906d0ce1a88ab5cb@sentry.codecactus.com/8',
    environment: process.env.ENV || 'local'
});

program
    .version('1.0.0', '-v, --version')
    .description('Mail Processor');

program
    .command('processMails')
    .description('Send mails From From The Mail Stack')
    .action(async (cmd) => {
        try {
            await Consumer.initializeConsumer();
        } catch (e) {
            log.error(e);
            await mongoose.disconnect();
        }
    });


program.parse(process.argv);