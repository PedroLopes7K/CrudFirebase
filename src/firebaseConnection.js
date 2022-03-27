import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDrfLsYZd9i7ifc02xT1YUDVgdio164x28',
  authDomain: 'curso-818e8.firebaseapp.com',
  projectId: 'curso-818e8',
  storageBucket: 'curso-818e8.appspot.com',
  messagingSenderId: '605738774299',
  appId: '1:605738774299:web:6340d653596a93115eedbe',
  measurementId: 'G-SKGSPHQW02'
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}
// Initialize Firebase
// const app = initializeApp(firebaseConfig)
export default firebase
