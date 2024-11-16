/* - - MediaPipe Body tracking - - */

/*

Which tracking points can I use?
https://developers.google.com/static/mediapipe/images/solutions/pose_landmarks_index.png

We have a total of 33 points on the body:
(our points are mirrored, so left and right are switched)

0 = nose
12 = right shoulder
11 = left shoulder
26 = right knee
25 = left knee
32 = right foot
31 = left foot
20 = right hand
19 = left hand

Full documentation
https://developers.google.com/mediapipe/solutions/vision/pose_landmarker/index

What we do in this example:
- lerp the landmarks to make them smoother
- baased on https://github.com/amcc/easydetect by Alistair McClymont

*/

/* - - Variables - - */

// webcam variables
let capture; // our webcam
let captureEvent; // callback when webcam is ready

// lerping (i.e. smoothing the landmarks)
let lerpRate = 0.2; // smaller = smoother, but slower to react
let madeClone = false;
let lerpLandmarks;
let lastKnownLandmarks = null; // fallback points

// styling
let ellipseSize = 20; // size of the ellipses
let letterSize = 20; // size of the letter

/* - - Setup - - */
function setup() {
  createCanvas(windowWidth, windowHeight);
  captureWebcam(); // launch webcam

  // styling
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(20);
  fill("white");
}

/* - - Draw - - */
function draw() {
  background(0);

  /* WEBCAM */
  push();
  centerOurStuff(); // center the webcam
  scale(-1, 1); // mirror webcam
  image(
    capture,
    -capture.scaledWidth,
    0,
    capture.scaledWidth,
    capture.scaledHeight
  ); // draw webcam
  scale(-1, 1); // unset mirror
  pop();

  /* TRACKING */
  if (mediaPipe.landmarks[0]) {
    // is tracking ready?

    // clone the landmarks array for lerping
    if (!madeClone) {
      lerpLandmarks = JSON.parse(JSON.stringify(mediaPipe.landmarks));
      madeClone = true;
    }

    // lerp the landmarks
    for (let i = 0; i < mediaPipe.landmarks[0].length; i++) {
      lerpLandmarks[0][i].x = lerp(
        lerpLandmarks[0][i].x,
        mediaPipe.landmarks[0][i].x,
        lerpRate
      );
      lerpLandmarks[0][i].y = lerp(
        lerpLandmarks[0][i].y,
        mediaPipe.landmarks[0][i].y,
        lerpRate
      );
    }

    // Update last known positions
    lastKnownLandmarks = JSON.parse(JSON.stringify(lerpLandmarks));
  } else if (lastKnownLandmarks) {
    // Use last known landmarks if tracking is lost
    lerpLandmarks = JSON.parse(JSON.stringify(lastKnownLandmarks));
  }

  if (lerpLandmarks && lerpLandmarks[0]) {
    // Use the landmarks, either current or last known

    // nose
    let noseX = map(lerpLandmarks[0][0].x, 1, 0, 0, capture.scaledWidth);
    let noseY = map(lerpLandmarks[0][0].y, 0, 1, 0, capture.scaledHeight);

    // left shoulder
    let leftShoulderX = map(
      lerpLandmarks[0][12].x,
      1,
      0,
      0,
      capture.scaledWidth
    );
    let leftShoulderY = map(
      lerpLandmarks[0][12].y,
      0,
      1,
      0,
      capture.scaledHeight
    );

    // right shoulder
    let rightShoulderX = map(
      lerpLandmarks[0][11].x,
      1,
      0,
      0,
      capture.scaledWidth
    );
    let rightShoulderY = map(
      lerpLandmarks[0][11].y,
      0,
      1,
      0,
      capture.scaledHeight
    );

    // left hand
    let leftHandX = map(lerpLandmarks[0][19].x, 1, 0, 0, capture.scaledWidth);
    let leftHandY = map(lerpLandmarks[0][19].y, 0, 1, 0, capture.scaledHeight);

    // right hand
    let rightHandX = map(lerpLandmarks[0][20].x, 1, 0, 0, capture.scaledWidth);
    let rightHandY = map(lerpLandmarks[0][20].y, 0, 1, 0, capture.scaledHeight);

    push();
    centerOurStuff();

    // draw points
    fill("white");
    ellipse(noseX, noseY, ellipseSize, ellipseSize); // nose
    ellipse(leftShoulderX, leftShoulderY, ellipseSize, ellipseSize); // left shoulder
    ellipse(rightShoulderX, rightShoulderY, ellipseSize, ellipseSize); // right shoulder
    ellipse(leftHandX, leftHandY, ellipseSize, ellipseSize); // left hand
    ellipse(rightHandX, rightHandY, ellipseSize, ellipseSize); // right hand

    // draw labels
    fill("blue");
    textSize(letterSize);
    text("nose", noseX + 20, noseY); // nose
    text("left shoulder", leftShoulderX + 20, leftShoulderY); // left shoulder
    text("right shoulder", rightShoulderX + 20, rightShoulderY); // right shoulder
    text("left hand", leftHandX + 20, leftHandY); // left hand
    text("right hand", rightHandX + 20, rightHandY); // right hand

    pop();
  }
}

/* - - Helper functions - - */

// function: launch webcam
function captureWebcam() {
  capture = createCapture(
    {
      audio: false,
      video: {
        facingMode: "user",
      },
    },
    function (e) {
      captureEvent = e;
      console.log(captureEvent.getTracks()[0].getSettings());
      // do things when video ready
      // until then, the video element will have no dimensions, or default 640x480
      capture.srcObject = e;

      setCameraDimensions(capture);
      mediaPipe.predictWebcam(capture);
      //mediaPipe.predictWebcam(parentDiv);
    }
  );
  capture.elt.setAttribute("playsinline", "");
  capture.hide();
}

// function: resize webcam depending on orientation
function setCameraDimensions(video) {
  const vidAspectRatio = video.width / video.height; // aspect ratio of the video
  const canvasAspectRatio = width / height; // aspect ratio of the canvas

  if (vidAspectRatio > canvasAspectRatio) {
    // Image is wider than canvas aspect ratio
    video.scaledHeight = height;
    video.scaledWidth = video.scaledHeight * vidAspectRatio;
  } else {
    // Image is taller than canvas aspect ratio
    video.scaledWidth = width;
    video.scaledHeight = video.scaledWidth / vidAspectRatio;
  }
}

// function: center our stuff
function centerOurStuff() {
  translate(
    width / 2 - capture.scaledWidth / 2,
    height / 2 - capture.scaledHeight / 2
  ); // center the webcam
}

// function: window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setCameraDimensions(capture);
}
