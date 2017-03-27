require('@google-cloud/debug-agent').start();
const firebaseAdmin = require("firebase-admin");
const functions = require('firebase-functions');
const Tracekit = require('tracekit');
const sourceMap = require('source-map');
const cors = require('cors');
const gcs = require('@google-cloud/storage');
const serviceAccount = require('./firebase-service-account-key.json');

const PROJECT_ID = 'js-exception-logger';

let storage = gcs({
  projectId: PROJECT_ID,
  credentials: serviceAccount
});

let bucket = storage.bucket(`${PROJECT_ID}.appspot.com`);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: `https://${PROJECT_ID}.firebaseio.com`
});

exports.exlog = functions.https.onRequest((req, res) => {
  cors()(req, res, () => {
    const { ex: originalTrace, loggedDate } = req.body;
    const externalUserId = req.headers['x-user-id'];

    let sourceMapConsumers = {};
    let userId;
    let originalStack;

    getUserId(externalUserId)
      .then((id) => {
        userId = id;
        let promises = [];
        let urls = {};
        originalStack = Tracekit.computeStackTrace(originalTrace);
        (originalStack.stack || []).forEach((item) => {
          if (!urls[item.url]) {
            promises.push(getSourceMap(item.url, userId));
          }

          urls[item.url] = true;
        });

        return Promise.all(promises);
      })
      .then((items) => {
        items.forEach((item) => {
          sourceMapConsumers[item.url] = new sourceMap.SourceMapConsumer(item.sourceMap);
        });

        let result = (originalStack.stack || []).map((stackItem) => {
          return getOriginalPosition(sourceMapConsumers, stackItem);
        });

        let traces = result.map((item) => {
          let label = `at ${item.label}`;
          if (item.line) {
            label += ` | line:${item.line}`;
          }
          if (item.line) {
            label += ` | column:${item.column}`;
          }

          return label;
        });

        traces.unshift(originalStack.message);

        return firebaseAdmin.database().ref().child(`traceData/${userId}`).push().set({
          loggedDate,
          originalTrace,
          traces
        });
      })
      .then(() => {
        res.send(200);
      });
  });
});

exports.uploadSourceMap = functions.https.onRequest((req, res) => {
  const corsFn = cors();
  corsFn(req, res, () => {
    const externalUserId = req.headers['x-user-id'];
    const fileName = req.headers['x-file-name'];

    getUserId(externalUserId)
      .then((userId) => {
        return bucket
          .file(`sourcemap/${userId}/${fileName}`)
          .save(req.body);
      }).then(() => {
        res.send(200);
      });
  });
});

function getOriginalPosition(sourceMapConsumers, stackItem) {
  if (stackItem.url) {
    const consumer = sourceMapConsumers[stackItem.url];

    let position = consumer.originalPositionFor({
      line: Number(stackItem.line || 1),
      column: Number(stackItem.column || 1)
    });

    return {
      label: `${stackItem.func} (${position.source.replace('webpack:///', '')})`,
      line: position.line,
      column: position.column
    };
  } else {
    let label = stackItem.func;
    label += ` [${(stackItem.args).join(', ')}]`;
    return {
      label: label,
      line: null,
      column: null
    };
  }
}

function getUserId(externalUserId) {
  return firebaseAdmin.database().ref()
    .child(`userIdPair/external/${externalUserId}`)
    .once('value')
    .then((snapshot) => {
      return snapshot.val();
    });
}


function getSourceMap(url, userId) {
  let fileName = url.split('/').pop();
  let sourceMapName = `${fileName}.map`;

  return bucket
    .file(`sourcemap/${userId}/${sourceMapName}`)
    .download()
    .then((data) => {
      const sourceMap = data[0].toString('utf8');
      return { url, sourceMap };
    });
}
