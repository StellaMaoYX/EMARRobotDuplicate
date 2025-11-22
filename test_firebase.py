import firebase_admin
from firebase_admin import credentials, db

# load service account key
cred = credentials.Certificate("config/flexi-f7d77-firebase-adminsdk-fbsvc-bb78d97704.json")

# initialize Firebase app
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://flexi-f7d77-default-rtdb.firebaseio.com'
})

# ]write test data to the database
ref = db.reference('/')
ref.child('connection_test').set({
    'status': 'connected',
    'message': 'Firebase is working!'
})

print("✅ Firebase successfully connected and test data written.")
