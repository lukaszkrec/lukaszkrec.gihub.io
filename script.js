const btr = document.getElementById("level");

if (navigator.getBattery) {
  navigator
    .getBattery()
    .then(function (battery) {
      var batteryLevel = battery.level * 100;
      btr.innerHTML = `${batteryLevel}%`;
      btr.style.width = `${batteryLevel}%`;
      if (batteryLevel >= 50) {
        btr.style.background = "#25ee25";
      } else if (batteryLevel > 20 && batteryLevel < 50) {
        btr.style.background = "rgb(255, 217, 0)";
      } else if (batteryLevel <= 20) {
        btr.style.background = "rgb(240, 7, 7)";
      }
    })
    .catch(function (e) {
      console.error(e);
    });
} else {
  console.log("brak informacji");
}

function getUserMedia(constraints) {
  // if Promise-based API is available, use it
  if (navigator.mediaDevices) {
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  // otherwise try falling back to old, possibly prefixed API...
  var legacyApi =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  if (legacyApi) {
    // ...and promisify it
    return new Promise(function (resolve, reject) {
      legacyApi.bind(navigator)(constraints, resolve, reject);
    });
  }
}

function getStream(type) {
  if (
    !navigator.mediaDevices &&
    !navigator.getUserMedia &&
    !navigator.webkitGetUserMedia &&
    !navigator.mozGetUserMedia &&
    !navigator.msGetUserMedia
  ) {
    alert("User Media API not supported.");
    return;
  }

  var constraints = {};
  constraints[type] = true;

  getUserMedia(constraints)
    .then(function (stream) {
      var mediaControl = document.querySelector(type);

      if ("srcObject" in mediaControl) {
        mediaControl.srcObject = stream;
      } else if (navigator.mozGetUserMedia) {
        mediaControl.mozSrcObject = stream;
      } else {
        mediaControl.src = (window.URL || window.webkitURL).createObjectURL(
          stream
        );
      }

      mediaControl.play();
    })
    .catch(function (err) {
      alert("Error: " + err);
    });
}

window.SpeechRecognition = window.SpeechRecognition       ||
                                 window.webkitSpeechRecognition ||
                                 null;

      if (window.SpeechRecognition === null) {
        document.getElementById('ws-unsupported').classList.remove('hidden');
        document.getElementById('button-play-ws').setAttribute('disabled', 'disabled');
        document.getElementById('button-stop-ws').setAttribute('disabled', 'disabled');
      } else {
        var recognizer = new window.SpeechRecognition();
        var transcription = document.getElementById('transcription');
        var log = document.getElementById('log');

        // Recogniser doesn't stop listening even if the user pauses
        recognizer.continuous = true;

        // Start recognising
        recognizer.onresult = function(event) {
          transcription.textContent = '';

          for (var i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              transcription.textContent = event.results[i][0].transcript + ' (Confidence: ' + event.results[i][0].confidence + ')';
              document.body.style.background = event.results[i][0].transcript;
            } else {
              transcription.textContent += event.results[i][0].transcript;
              document.body.style.background = event.results[i][0].transcript;
            }
          }
        };

        // Listen for errors
        recognizer.onerror = function(event) {
          log.innerHTML = 'Recognition error: ' + event.message + '<br />' + log.innerHTML;
        };

        document.getElementById('button-play-ws').addEventListener('click', function() {
          // Set if we need interim results
          recognizer.interimResults = document.querySelector('input[name="recognition-type"][value="interim"]').checked;

          try {
            recognizer.start();
            log.innerHTML = 'Recognition started' + '<br />' + log.innerHTML;
          } catch(ex) {
            log.innerHTML = 'Recognition error: ' + ex.message + '<br />' + log.innerHTML;
          }
        });

        document.getElementById('button-stop-ws').addEventListener('click', function() {
          recognizer.stop();
          log.innerHTML = 'Recognition stopped' + '<br />' + log.innerHTML;
        });

        document.getElementById('clear-all').addEventListener('click', function() {
          transcription.textContent = '';
          log.textContent = '';
        });
      }
