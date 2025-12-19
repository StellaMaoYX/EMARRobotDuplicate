var config = {
    apiKey: "AIzaSyB10dHhQqD1TMXTJfQNLmFkrJtVyQ4JTuA",
    authDomain: "flexi-f7d77.firebaseapp.com",
    databaseURL: "https://flexi-f7d77-default-rtdb.firebaseio.com",
    projectId: "flexi-f7d77",
    storageBucket: "flexi-f7d77.appspot.com",
    messagingSenderId: "441373455093"
};

var db = new Database(config, databaseReadyCallback);

function databaseReadyCallback() {
  console.log("Database ready.");
  var dbRef = firebase.database().ref('/');
  dbRef.on("value", valueChangeCallback);
}

function valueChangeCallback(snapshot) {
  var database = snapshot.val();
  console.log(database);
}

function writeToDatabase() {
  var dir = "/";
  var dbRef = firebase.database().ref(dir);
	dbRef.set({test:"dummy data"});
}
