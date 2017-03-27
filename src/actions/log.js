import firebase from 'firebase';
import { firebaseDbRef, firebaseStorageRef } from '../utils/firebase';
import * as Log from '../action-types/log';

function getLogs() {
  let user = firebase.auth().currentUser;
  let userId = user.uid;

  return (dispatch) => {
    dispatch({
      type: Log.GetLog_Request
    });

    firebaseDbRef.child(`/traceData/${userId}`).once('value').then((snapshot) => {
      let data = snapshot.val();

      dispatch({
        type: Log.GetLog_Success,
        logs: data || {}
      });
    });
  };
}

function uploadSourceMap(file) {
  let user = firebase.auth().currentUser;
  let userId = user.uid;

  return (dispatch) => {

    dispatch({
      type: Log.UploadSourceMap_Request
    });

    const fileName = file.name;

    firebaseStorageRef.child(`sourcemap/${userId}/${fileName}`).put(file).then(() => {
      dispatch({
        type: Log.UploadSourceMap_Success
      });
    });
  };
}

export { getLogs, uploadSourceMap };
