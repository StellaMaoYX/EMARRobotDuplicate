// Firebase initialization（用你的 key）
var firebaseConfig = {
  apiKey: "AIzaSyB10dhQqD1TMXTJfQNLMmFkrJtVyQ4JtUA",
  authDomain: "flexi-f7d77.firebaseapp.com",
  databaseURL: "https://flexi-f7d77-default-rtdb.firebaseio.com",
  projectId: "flexi-f7d77",
  storageBucket: "flexi-f7d77.appspot.com",
  messagingSenderId: "441373455093",
  appId: "1:441373455093:web:038d10e9960e0e08b14bbc"
};

firebase.initializeApp(firebaseConfig);

// ======= EMAR ORIGINAL CONFIG (control.js expects this!) =======
var Config = {
  databaseURL: firebaseConfig.databaseURL,
  robots: {
      "0": { name: "Robot 0" }
  }
};
