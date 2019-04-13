#!/usr/bin/env node

'use strict';

const capture = require('../capture');

capture('REMOVED', process.argv.splice(2));
