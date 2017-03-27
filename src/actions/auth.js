import firebase from 'firebase';
import uuid from 'uuid';
import { firebaseDbRef } from '../utils/firebase';
import * as Auth from '../action-types/auth';

function validateUser() {
  return firebaseDbRef.child('testAuth').once('value');
}

function loginSuccess(user, dispatch) {
  firebaseDbRef.child(`userIdPair/internal/${user.uid}`).once('value')
    .then((snapshot) => {
      const promises = [];

      let externalId = snapshot.val();

      if (!externalId) {
        externalId = uuid.v4();
        promises.push(firebaseDbRef.child(`userIdPair/internal/${user.uid}`).set(externalId));
        promises.push(firebaseDbRef.child(`userIdPair/external/${externalId}`).set(user.uid));
      }

      Promise.all(promises).then(() => {
        dispatch({
          type: Auth.Auth_Success,
          xUserId: externalId
        });
      });
    });
}

function checkAuth() {
  return (dispatch) => {
    const authChecked = (isLoggedIn, error) => {
      if (!error) {
        if (isLoggedIn) {
          let user = firebase.auth().currentUser;
          firebaseDbRef.child(`userIdPair/internal/${user.uid}`).once('value')
            .then((snapshot) => {
              let externalId = snapshot.val();

              dispatch({
                type: Auth.Auth_Checked,
                isLoggedIn,
                xUserId: externalId
              });
            });
        }
        else {
          dispatch({
            type: Auth.Auth_Checked,
            isLoggedIn
          });
        }
      }
    };

    let unsubscribe = null;

    const callback = (authData) => {
      if (authData) {
        authChecked(true, null);
      } else {
        authChecked(false, null);
      }

      unsubscribe();
    };

    unsubscribe = firebase.auth().onAuthStateChanged(callback);
  };
}

function login() {
  return (dispatch) => {
    dispatch({
      type: Auth.Auth_Request,
    });

    const auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    let authUser;
    auth.signInWithPopup(provider)
      .then(({ user }) => {
        authUser = user;
        dispatch({
          type: Auth.Auth_Validate,
        });

        return validateUser();
      })
      .then(() => {
        loginSuccess(authUser, dispatch);
      })
      .catch(() => {
        firebase.auth().signOut();
      });
  };
}

export { login, checkAuth };
