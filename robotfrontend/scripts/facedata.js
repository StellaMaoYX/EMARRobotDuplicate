var newParameters;
var allUserData = null;
var currentUserData = null;
var selectedUser = null;
var selectedFace = null;
var hasNewParams = true;
var isSetup = false;
var robotFaces = null;

// 默认脸参数（在数据库为空时使用），避免出现 undefined 写入错误
function getDefaultFaceTemplate() {
  return {
    name: "Default face",
    thumb: "",
    backgroundColor: { name: "Background color", type: "color", current: "#dce6ff" },
    eyeCenterDistPercent: { name: "Distance between eyes", type: "number", current: 28, min: 0, max: 40, nIncrements: 200 },
    eyeInnerRadiusPercent: { name: "Inner eye size", type: "number", current: 128.8, min: 0, max: 140, nIncrements: 200 },
    eyeLineStrokeWidth: { name: "Thickness of eye lines", type: "number", current: 0, min: 0, max: 20, nIncrements: 200 },
    eyeOuterRadiusPercent: { name: "Outer eye size", type: "number", current: 5, min: 5, max: 25, nIncrements: 200 },
    eyeOutlineThickness: { name: "Eye outline thickness", type: "number", current: 8.6, min: 1, max: 20, nIncrements: 190 },
    eyeOutlineColor: { name: "Eye outline color", type: "color", current: "#cbd7ff" },
    eyePupilRadiusPercent: { name: "Pupil size", type: "number", current: 90, min: 0, max: 100, nIncrements: 200 },
    eyeShapeRatio: { name: "Eye shape ratio", type: "number", current: 1.2165, min: 0.87, max: 1.5, nIncrements: 200 },
    eyeYPercent: { name: "Vertical eye position", type: "number", current: 44, min: 20, max: 80, nIncrements: 200 },
    eyelidOffset: { name: "Eyelid offset", type: "number", current: -13, min: -40, max: 20, nIncrements: 200 },
    mouthH: { name: "Mouth height", type: "number", current: 14.5, min: -5, max: 60, nIncrements: 200 },
    mouthSlope: { name: "Mouth slope", type: "number", current: 11.5, min: -5, max: 50, nIncrements: 200 },
    mouthStrokeWidth: { name: "Mouth thickness", type: "number", current: 5.75, min: 1, max: 20, nIncrements: 190 },
    mouthWPercent: { name: "Mouth width", type: "number", current: 8, min: 0, max: 10, nIncrements: 200 },
    mouthYPercent: { name: "Vertical mouth position", type: "number", current: 75, min: 60, max: 90, nIncrements: 200 },
    voicePitch: { name: "Voice pitch", type: "number", current: 0.65, min: 0, max: 1, nIncrements: 100 },
    voiceRate: { name: "Voice rate", type: "number", current: 5.05, min: 0.1, max: 10, nIncrements: 200 },
    voiceVolume: { name: "Voice volume", type: "number", current: 1, min: 0, max: 1, nIncrements: 100 },
    eyeOuterColor: { name: "Outer eye color", type: "color", current: "#cbd7ff" },
    eyeInnerColor: { name: "Inner eye color", type: "color", current: "#000000" },
    eyePupilColor: { name: "Pupil color", type: "color", current: "#000000" },
    pupilXOffset: { name: "Pupil X offset", type: "number", current: 1, min: -20, max: 20 },
    pupilYOffset: { name: "Pupil Y offset", type: "number", current: 1, min: -20, max: 20 },
    mouthColor: { name: "Mouth color", type: "color", current: "#000000" },
    hasBlinking: { name: "Has blinking?", type: "boolean", current: 1 },
    hasEyelid: { name: "Has eyelid?", type: "boolean", current: 1 },
    hasPupil: { name: "Pupil?", type: "boolean", current: 1 },
    hasText: { name: "Has text?", type: "boolean", current: 0 },
    hasEyeLines: { name: "Eye lines?", type: "boolean", current: 0 },
    hasMouth: { name: "Mouth?", type: "boolean", current: 1 },
    hasReflection: { name: "Reflection?", type: "boolean", current: 1 },
    hasNose: { name: "Has nose?", type: "boolean", current: 0 },
    isHorizontal: { name: "Horizontal?", type: "boolean", current: 1 },
    isLEDEyes: { name: "LED eyes", type: "boolean", current: 0 },
    hasInnerPupil: { name: "Inner pupil", type: "boolean", current: 0 },
    eyeWPercent: { name: "LED width (%)", type: "number", current: 30, min: 0, max: 100 },
    eyeHPercent: { name: "LED height (%)", type: "number", current: 50, min: 0, max: 100 },
    betweenCircleDistancePercent: { name: "LED gap (%)", type: "number", current: 15, min: 0, max: 100 },
    eyeBackgroundColor: { name: "LED background", type: "color", current: "#222222" },
    eyeLEDOffColor: { name: "LED off color", type: "color", current: "#444444" },
    eyeLEDOnColor: { name: "LED on color", type: "color", current: "#86CCEE" },
    nCircles: { name: "LED circles", type: "number", current: 9, min: 1, max: 20 },
    text: { name: "Bubble text", type: "text", current: "Hello, my name is EMAR" },
    bubbleHeight: { name: "Bubble height", type: "number", current: 50, min: 0, max: 200 },
    bubbleColor: { name: "Bubble color", type: "color", current: "#666666" },
    fontSize: { name: "Font size", type: "number", current: 25, min: 8, max: 72 },
    fontColor: { name: "Font color", type: "color", current: "#222222" },
    avgBlinkTime: { name: "Avg blink (ms)", type: "number", current: 9000, min: 1000, max: 20000 },
    avgLookaroundTime: { name: "Avg lookaround (ms)", type: "number", current: 4000, min: 500, max: 15000 },
    minLookaroundTime: { name: "Min lookaround (ms)", type: "number", current: 2000, min: 0, max: 15000 },
    mouthR: { name: "Mouth radius", type: "number", current: 5, min: 0, max: 50 },
    noseRPercent: { name: "Nose radius (%)", type: "number", current: 2, min: 0, max: 20 },
    noseYPercent: { name: "Nose Y (%)", type: "number", current: 65, min: 0, max: 100 },
    noseColor: { name: "Nose color", type: "color", current: "#222222" },
  };
}

/* Function that needs to be called whenever the face preview needs to be renewed */
function updateFace() {
  if (allUserData != null && selectedUser != null && selectedFace != null) {
    if (selectedUser == Database.uid && !isSetup){
      newParameters = currentUserData.faces[selectedFace];
    }
    else {
      var selectedUserData = allUserData[selectedUser];
      newParameters = selectedUserData.faces[selectedFace];
    }

    if (!isSetup)
      Face.updateParameters(newParameters);
    
    if (hasNewParams) {
      updateFaceThumb(selectedUser, selectedFace);
      hasNewParams = false;
    }
  }
}

/* Callback function for when a current users' face parameter is changed */
function updateUserFaceList() {
  var myFaceList = document.getElementById("myFaceList");
  myFaceList.innerHTML = "";

  if (currentUserData.faces != undefined) {
    for (var i = 0; i < currentUserData.faces.length; i++) {

      var name = currentUserData.faces[i].name;
      if (name == undefined || name == "")
        name = "..."
      var thumbHTML = "<div class='deletable-thumb'> <div class='thumb-and-name'>";
      var imgSrc = getThumbImage(currentUserData.faces[i]);
      thumbHTML += "<img  class='face-thumb' ";
      thumbHTML += "src='" + imgSrc + "' ";
      thumbHTML += "onclick='selectedFaceChanged(this, \"" + Database.uid + "\","+ i + ")'";
      thumbHTML += "><p>" + name + " </p></div>";
      thumbHTML += "<div class='delete-x-button'><button type='button' ";
      thumbHTML += "onclick='removeUserFace(" + i + ")' class='btn btn-secondary btn-circle-sm'>X</button></div>"
      thumbHTML += "</div>";
      
      myFaceList.innerHTML += thumbHTML;
    }
  }
}
  
/* Callback function to remove current user's face when the X button is clicked */
function removeUserFace(index) {
  var newRobotFaces = currentUserData.faces;
  newRobotFaces.splice(index, 1);
  var dir = '/users/' + Database.uid + "/";
  var dbRef = firebase.database().ref(dir);
  var updates = {faces: newRobotFaces};
  dbRef.update(updates);
}

/* Function to load all face data from the database */
function updateAllUsersFaceList(snapshot) {
  // Load data only once in the beginning of each session
  if (allUserData == null) {

    allUserData = snapshot.val() || {};

    // 清理掉数组中可能存在的 null/undefined，避免写入错误
    Object.keys(allUserData).forEach(function(uid) {
      var faces = (allUserData[uid] || {}).faces;
      if (Array.isArray(faces)) {
        var cleaned = faces.filter(Boolean);
        if (cleaned.length !== faces.length) {
          allUserData[uid].faces = cleaned;
          firebase.database().ref('/users/' + uid + '/faces').set(cleaned);
        }
      }
    });

    // 如果当前用户还没有任何脸，写入一个默认脸，避免 undefined 写入错误
    if (Database.uid) {
      var current = allUserData[Database.uid] || {};
      var faces = Array.isArray(current.faces) ? current.faces : [];
      if (faces.length === 0) {
        faces = [getDefaultFaceTemplate()];
        firebase.database().ref('/users/' + Database.uid).update({ faces: faces });
        current.faces = faces;
        allUserData[Database.uid] = current;
      }
    }

    var otherFaceList = document.getElementById("otherFaceList");
    if (otherFaceList != undefined) {
      otherFaceList.innerHTML = "";
    }
    
    var allUserKeys = Object.keys(allUserData);
    var currentUserIndex = allUserKeys.indexOf(Database.uid);
    allUserKeys.splice(currentUserIndex,1);
    allUserKeys.unshift(Database.uid);

    for (var j = 0; j < allUserKeys.length; j++) {
      var id = allUserKeys[j];
           
      // If setup, include the current user's faces at the beginning
      if (id != Database.uid || isSetup) {

        var userData = allUserData[id];

        var nUserConfigs = 0;
        if (userData.faces != null && userData.faces != undefined)
          nUserConfigs = userData.faces.length;
        
        if (selectedUser==null && nUserConfigs>0)
          selectedUser = id;

        for (i = 0; i < nUserConfigs; i++) {
          var name = userData.faces[i].name;
          if (name == undefined || name == "")
            name = "..."
          var thumbHTML = "<div class='thumb-and-name'>";
          imgSrc = getThumbImage(userData.faces[i]);
          thumbHTML += "<img  class='face-thumb' ";
          thumbHTML += "src='" + imgSrc + "' ";
          thumbHTML += "onclick='selectedFaceChanged(this, \"" + id + "\"," + i + ")'>";
          thumbHTML += "<p>" + name + " </p></div>";

          if (otherFaceList != undefined)
            otherFaceList.innerHTML += thumbHTML;
          else
            myFaceList.innerHTML += thumbHTML;
        }
      }
    }

    // 如果没有其它用户的脸，且自己有脸，直接选中自己的第一张脸
    var selfFaces = (allUserData[Database.uid] || {}).faces;
    if (selectedUser == null && Array.isArray(selfFaces) && selfFaces.length > 0) {
      selectedUser = Database.uid;
      selectedFace = 0;
      newParameters = selfFaces[0];
      updateFace();
      updateFaceEditor();
    }

    var allFaceImgs = document.getElementsByClassName("face-thumb");
    selectedFaceChanged(allFaceImgs[0], selectedUser, 0);
  }
}

// TODO: Update for Woz
function updateRobotFaceList(snapshot) {
  var robotFaceList = document.getElementById("robotFaceList");
  if (robotFaceList != undefined)
    robotFaceList.innerHTML = "";

  robotFaces = snapshot?.val ? snapshot.val() : snapshot;

  if (robotFaces != undefined) {
    
    for (var i = 0; i < robotFaces.length; i++) {

      var name = robotFaces[i].name;
      if (name == undefined || name == "")
        name = "..."
      var thumbHTML = "";
      if (isSetup)
        thumbHTML += "<div class='deletable-thumb'>";
      thumbHTML += "<div class='thumb-and-name'>";
      thumbHTML += "<img  class='face-thumb' ";
      thumbHTML += "src='" + robotFaces[i].thumb + "' ";
      if (!isSetup)
        thumbHTML += "onclick='selectedRobotFaceChanged(this, "+ i + ")'";
      thumbHTML += "><p>" + name + " </p></div>";
      if (isSetup) {
        thumbHTML += "<div class='delete-x-button'><button type='button' ";
        thumbHTML += "onclick='removeRobotFace(" + i + ")' class='btn btn-secondary btn-circle-sm'>X</button></div>"
        thumbHTML += "</div>";
      }
      
      robotFaceList.innerHTML += thumbHTML;
    }
  }

//   for (var i=0; i<robotFaces.length; i++) {
//     var thumbImg = ""; 
//     var thumbHTML = "";
//     var faceParameters = robotFaces[i];
//     if (faceParameters !== null)
//       thumbImg = faceParameters.thumb;

//     if (isSetup)
//       thumbHTML += "<div class='deletable-thumb'>";
//     else
//       thumbHTML += "<a>";

//     if (!isSetup && i == robotData.state.currentFace)
//       thumbHTML += "<div class='thumb-and-name'><img  class='face-thumb-selected' ";
//     else
//       thumbHTML += "<div class='thumb-and-name'><img  class='face-thumb' ";

//     thumbHTML += "src='" + thumbImg;

//     if (!isSetup)
//       thumbHTML += "' onclick='currentFaceChanged(" + i + ")";
//     thumbHTML += "' > <p>" + faceParameters.name + "</p> </div>";

//     if (isSetup)
//       thumbHTML += "<div class='delete-x-button'><button type='button' onclick='removeRobotFace(" + i + ")' class='btn btn-secondary btn-circle-sm'>X</button></div>";

//     if (isSetup)
//       thumbHTML += "</div>";
//     else
//       thumbHTML += "</a>";

//     robotFaceList.innerHTML += thumbHTML;
  // }
}

function selectedRobotFaceChanged(target, index) {
  if (!target) return; // 保险：没有元素时直接退出

  var allFaceImgs = document.getElementsByClassName("face-thumb");
  for (var i=0; i<allFaceImgs.length; i++) {
    allFaceImgs[i].style.border = "5px transparent solid";
  }
  target.style.border = "5px #007bff solid";
  
  var dir = "robots/" + currentRobot + "/state/";
  var dbRef = firebase.database().ref(dir);
  dbRef.update({ currentFace: index });
}


/* Callback function for when a different face is selected by the user through clicking a thumb*/
function selectedFaceChanged(target, user, index) {
  var allFaceImgs = document.getElementsByClassName("face-thumb");
  if (!target) {
    // 如果没有传入元素，尽量取第一个缩略图；否则放弃更新以避免报错
    target = allFaceImgs.length > 0 ? allFaceImgs[0] : null;
  }
  if (!target) return;

  hasNewParams = true;
  for (var i=0; i<allFaceImgs.length; i++) {
    allFaceImgs[i].style.border = "5px transparent solid";
  }
  target.style.border = "5px #007bff solid";
  
  selectedUser = user;
  selectedFace = index;
  if (!isSetup){
    updateFace();
    updateFaceEditor();
  }
}

/* Callback function for when the current face is renamed, to update the database accordingly*/
function faceRenamed() {
  if (selectedUser == Database.uid) {
    var dir = "users/" + selectedUser;
    var dbRef = firebase.database().ref(dir + "/faces/" + selectedFace + "/");
    var newParamObj = {};
    var faceName = document.getElementById("faceName");
    newParamObj.name = faceName.value;
    dbRef.update(newParamObj);
  }
  else {
    console.log("You cannot rename other users' faces.")
  }
}

/* Function to update the thumb corresponding to face parameters in the database */
function updateFaceThumb(user, id) {
  var svg = document.getElementById("faceSVG");
  var imgsrc = svg2img(svg);
  var dbRef = firebase.database().ref('users/' + user + '/faces/' + id + '/');
  var newThumb = {thumb:imgsrc};
  dbRef.update(newThumb);
}

/* Utility function */
function getThumbImage(faceParameters) {
  var thumbImg = ""; 
  if (faceParameters !== null && faceParameters !== undefined)
    thumbImg = faceParameters.thumb;
  return thumbImg;
}

/* Utility function to convert current SVG into a URL image*/
function svg2img(svg){
  var xml = new XMLSerializer().serializeToString(svg);
  var svg64 = btoa(xml); //for utf8: btoa(unescape(encodeURIComponent(xml)))
  var b64start = 'data:image/svg+xml;base64,';
  var image64 = b64start + svg64;
  return image64;
}

// TODO
function addPresetFace() {
  var dir = 'robots/' + (currentRobot) + "/customAPI/state/";
  var user = allFaceIndexes[currentConfig].user;
  var index = allFaceIndexes[currentConfig].index;
  faces.push({user:user, index:index});
  var dbRef = firebase.database().ref(dir);
  dbRef.update({presetFaces:faces});
}

/* 
 * Function to add a copy of the currently displayed face to the current user's face list on the database
 */
function createNewFace() {
  var newFaceIndex = 0;
  if (!currentUserData || !Array.isArray(currentUserData.faces)) {
    currentUserData = currentUserData || {};
    currentUserData.faces = [];
  } else {
    newFaceIndex = currentUserData.faces.length;
  }
  var dir = 'users/' + (Database.uid);
  var dbRef = firebase.database().ref(dir + '/faces/' + newFaceIndex + '/');
  var faceToSave = newParameters || getDefaultFaceTemplate();
  dbRef.set(faceToSave);
}
