import requests
import time
import json

# ===================================================
# Robot current state (can be replaced with real sensor/servo interfaces)
# ===================================================
current_neck_pan = 0
current_neck_tilt = 0
tactile_data = {'sensor0': 1, 'sensor1': 1, 'sensor2': 1}
current_led_rgb = [255, 255, 255]

# ===================================================
# Firebase project information
# ===================================================
this_robot_id = 0   # Robot ID 

api_key = "👉 Copy the apiKey from Firebase Console Web App 👈"
# Example: api_key = "AIzaSyA123abc..."
URL = "https://flexi-f7d77-default-rtdb.firebaseio.com/"
AUTH_URL = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={api_key}"

headers = {'Content-Type': 'application/json'}
auth_req_params = {"returnSecureToken": "true"}

# ===================================================
# Establish anonymous login and get ID token (authentication)
# ===================================================
print("Connecting to Firebase and logging in...")
connection = requests.Session()
connection.headers.update(headers)
auth_request = connection.post(url=AUTH_URL, params=auth_req_params)
auth_info = auth_request.json()

if "idToken" not in auth_info:
    print("Login failed, please check if API Key is correct:", auth_info)
    exit(1)

id_token = auth_info["idToken"]
auth_params = {'auth': id_token}
print("Firebase login successful, token obtained")

# ===================================================
# Main loop: continuously sync data
# ===================================================
print("Starting robot data loop, syncing with Firebase in real-time...\n")

while True:
    try:
        # ① Read all robot data from database
        get_request = connection.get(url=URL + "robots.json", params=auth_params)
        robots = get_request.json()

        if not robots:
            print("No robots node in database yet, waiting for creation...")
            time.sleep(2)
            continue

        # ② Extract current robot action commands
        neck_action = robots[this_robot_id]["actions"]["neck"]
        robot_state = robots[this_robot_id]["state"]

        # --- Neck control ---
        if current_neck_pan != neck_action["panAngle"]:
            print("🦾 New neck horizontal angle:", neck_action["panAngle"])
            current_neck_pan = neck_action["panAngle"]

        if current_neck_tilt != neck_action["tiltAngle"]:
            print("🦾 New neck tilt angle:", neck_action["tiltAngle"])
            current_neck_tilt = neck_action["tiltAngle"]

        # --- Tactile sensor upload ---
        tactile_data_json = json.dumps(tactile_data)
        tactile_url = f"{URL}robots/{this_robot_id}/inputs/tactile.json"
        post_request = connection.put(url=tactile_url, data=tactile_data_json, params=auth_params)
        if post_request.ok:
            print("📡 Tactile data uploaded successfully:", tactile_data)
        else:
            print("⚠️ Upload failed:", post_request.text)

        # --- Check LED commands ---
        led_rgb = [
            robot_state["currentLEDR"],
            robot_state["currentLEDG"],
            robot_state["currentLEDB"]
        ]

        if current_led_rgb != led_rgb:
            print("New LED color:", led_rgb)
            current_led_rgb = led_rgb

        # --- Delay ---
        time.sleep(1)

    except KeyboardInterrupt:
        print("\n Program stopped (Ctrl+C)")
        break
    except Exception as e:
        print("Error:", e)
        time.sleep(2)


# import requests
# import time
# import json

# # Dummy data to represent the status of the neck application
# current_neck_pan = 0
# current_neck_tilt = 0
# tactile_data = {'sensor0':1, 'sensor1':1, 'sensor2':1};

# # Dummy data for LED
# current_led_rgb = [255,255,255]

# # Robot and database info
# this_robot_id = 0
# api_key = ""
# URL = "https://emar-database.firebaseio.com/"
# AUTH_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + api_key;
# headers = {'Content-type': 'application/json'}
# auth_req_params = {"returnSecureToken":"true"}

# # Start connection to Firebase and get anonymous authentication
# connection = requests.Session()
# connection.headers.update(headers)
# auth_request = connection.post(url=AUTH_URL, params=auth_req_params)
# auth_info = auth_request.json()
# auth_params = {'auth': auth_info["idToken"]}

# #print(auth_info)

# while(True):

# 	# Sending get request and obtaining the response
# 	get_request = connection.get(url = URL + "robots.json")
# 	# Extracting data in json format 
# 	robots = get_request.json()
	
# 	##############
# 	# Check if there is a new neck value requested through database
# 	# and if yes, move the neck there
# 	##############
# 	neck_action = robots[this_robot_id]["actions"]["neck"]

# 	if (current_neck_pan != neck_action["panAngle"]):
# 		print("New neck pan value: " + str(neck_action["panAngle"]))
# 		# TODO: Set actual neck value
# 		current_neck_pan = neck_action["panAngle"]

# 	if (current_neck_tilt != neck_action["tiltAngle"]):
# 		print("New neck tilt value: " + str(neck_action["tiltAngle"]))
# 		# TODO: Set actual neck value
# 		current_neck_tilt = neck_action["tiltAngle"]

# 	##############
# 	# Send the most recent values of tactile sensors
# 	##############

# 	# TODO: Update tactile_data based on the real tactile sensors
# 	tactile_data_json =  json.dumps(tactile_data)
# 	tactile_url = URL + "robots/" + str(this_robot_id) + "/inputs/tactile.json"
# 	post_request = connection.put(url=tactile_url,
# 		data=tactile_data_json, params=auth_params)
# 	print("Tactile sensor data sent: " + str(post_request.ok))

# 	##############
# 	# Check if there is a new LED value in the database
# 	##############
# 	robot_state = robots[this_robot_id]["state"]
# 	led_rgb = [robot_state["currentLEDR"], robot_state["currentLEDG"], robot_state["currentLEDB"]]
# 	if (current_led_rgb != led_rgb):
# 		print("New LED color: " str(led_rgb))
# 		# TODO: Set actual LED color
# 		current_led_rgb = led_rgb
	
# 	time.sleep(0.1)


# #########========

