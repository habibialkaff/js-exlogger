import firebase from 'firebase';

let config = process.env.NODE_ENV !== 'production' ?
  require('./firebase.dev.json') :
  require('./firebase.prod.json');

firebase.initializeApp(config);

export const firebaseDbRef = firebase.database().ref();
export const firebaseStorageRef = firebase.storage().ref();
