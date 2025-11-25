
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB10dHhQqD1TMXTJfQNLmFkrJtVyQ4JTuA",
  authDomain: "flexi-f7d77.firebaseapp.com",
  databaseURL: "https://flexi-f7d77-default-rtdb.firebaseio.com",
  projectId: "flexi-f7d77",
  storageBucket: "flexi-f7d77.firebasestorage.app",
  messagingSenderId: "441373455093",
  appId: "1:441373455093:web:038d10e9960e0e08b14bbc",
  measurementId: "G-NNWWSD5BCH"
};

firebase.initializeApp(firebaseConfig);

// ======= EMAR ORIGINAL CONFIG (control.js expects this!) =======
var Config = {
  databaseURL: firebaseConfig.databaseURL,
  robots: {
      "0": { name: "Robot 0" }
  }
};
