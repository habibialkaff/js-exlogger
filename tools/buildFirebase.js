const fs = require('fs-extra');

fs.copySync('./dist', './firebase-deploy/public');
fs.copySync('./firebase-functions', './firebase-deploy/functions');
