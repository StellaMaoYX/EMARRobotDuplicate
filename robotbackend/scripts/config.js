// Default Firebase project (override by defining window.EMAR_FIREBASE_CONFIG before this file loads)
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
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


function Config() {
  var selectedConfig = Config.getFirebaseConfig();
  this.config = selectedConfig;
  Config.apply(selectedConfig);
}

Config.apply = function(cfg) {
  Config.apiKey = cfg.apiKey;
  Config.authDomain = cfg.authDomain;
  Config.databaseURL = cfg.databaseURL;
  Config.projectId = cfg.projectId;
  Config.storageBucket = cfg.storageBucket;
  Config.messagingSenderId = cfg.messagingSenderId;
  Config.appId = cfg.appId;
};

Config.getFirebaseConfig = function() {
  return window.EMAR_FIREBASE_CONFIG || DEFAULT_FIREBASE_CONFIG;
};

Config.getURLParameter = function(paramName) {
  var url = window.location.toString();
  var urlParamIndex = url.indexOf(paramName + "=");
  var paramValue = null;
  if (urlParamIndex != -1) {
    var valueIndex = urlParamIndex + paramName.length + 1;
    paramValue = url.substring(valueIndex);
    console.log(paramName + ":" + paramValue);
  }
  return paramValue;
};

// Populate static properties immediately so pages that reference Config.* without instantiation still work.
Config.apply(Config.getFirebaseConfig());
