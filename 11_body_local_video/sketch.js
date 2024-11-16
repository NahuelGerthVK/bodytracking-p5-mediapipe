// video starts on click

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

*/

/* - - Variables - - */

// video variables
let sourceVideo; // mediapipe source video
let bgVideo; // draw our video on the canvas
let sourceVideoLoaded = false; // is source video loaded?

// lerping (i.e. smoothing the landmarks)
let lerpRate = 0.7; // smaller = smoother, but slower to react
let madeClone = false;
let lerpLandmarks;

// styling
let ellipseSize = 20; // size of the ellipses
let letterSize = 20; // size of the letter

/* - - Preload - - */
function preload() {
  // Load the video
  bgVideo = createVideo(["video/source.mp4"]);
}

/* - - Setup - - */
function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize bg video
  bgVideo = createVideo(["video/source.mp4"], videoLoaded); // load video and send source to mediapipe
  setCameraDimensions(bgVideo); // sizing

  // styling
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(20);
  fill("white");
}

/* - - Draw - - */
function draw() {
  background(0);

  /* BG VIDEO */
  setCameraDimensions(bgVideo); // sizing
  push();
  centerOurStuff(); // center the video
  image(bgVideo, 0, 0, bgVideo.scaledWidth, bgVideo.scaledHeight); // Adjust size as needed
  pop();

  /* TRACKING */
  if (mediaPipe.landmarks[0]) {
    // is hand tracking ready?

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

    // nose
    let noseX = map(lerpLandmarks[0][0].x, 0, 1, 0, bgVideo.scaledWidth);
    let noseY = map(lerpLandmarks[0][0].y, 0, 1, 0, bgVideo.scaledHeight);

    // left shoulder
    let leftShoulderX = map(
      lerpLandmarks[0][12].x,
      0,
      1,
      0,
      bgVideo.scaledWidth
    );
    let leftShoulderY = map(
      lerpLandmarks[0][12].y,
      0,
      1,
      0,
      bgVideo.scaledHeight
    );

    // right shoulder
    let rightShoulderX = map(
      lerpLandmarks[0][11].x,
      0,
      1,
      0,
      bgVideo.scaledWidth
    );
    let rightShoulderY = map(
      lerpLandmarks[0][11].y,
      0,
      1,
      0,
      bgVideo.scaledHeight
    );

    // left hand
    let leftHandX = map(lerpLandmarks[0][19].x, 0, 1, 0, bgVideo.scaledWidth);
    let leftHandY = map(lerpLandmarks[0][19].y, 0, 1, 0, bgVideo.scaledHeight);

    // right hand
    let rightHandX = map(lerpLandmarks[0][20].x, 0, 1, 0, bgVideo.scaledWidth);
    let rightHandY = map(lerpLandmarks[0][20].y, 0, 1, 0, bgVideo.scaledHeight);

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

// function: resize webcam depending on orientation
function setCameraDimensions(video) {
  const vidAspectRatio = video.width / video.height; // aspect ratio of the video
  const canvasAspectRatio = width / height; // aspect ratio of the canvas

  if (vidAspectRatio > canvasAspectRatio) {
    // Image is wider than canvas aspect ratio
    video.scaledHeight = height;
    video.scaledWidth = int(video.scaledHeight * vidAspectRatio);
  } else {
    // Image is taller than canvas aspect ratio
    video.scaledWidth = width;
    video.scaledHeight = int(video.scaledWidth / vidAspectRatio);
  }
}

// function: center our stuff
function centerOurStuff() {
  translate(
    width / 2 - bgVideo.scaledWidth / 2,
    height / 2 - bgVideo.scaledHeight / 2
  ); // center the webcam
}

// function: video loaded
function videoLoaded() {
  bgVideo.volume(0); // mute the video
  bgVideo.hide(); // hide the default video element

  bgVideoLoaded = true;
  console.log("Our background video has loaded");
}

// start video and mediapie tracking
function videoGo() {
  // bg video: canvas
  bgVideo.loop();

  // source video: mediapipe
  sourceVideo = document.getElementById("sourceVideo");
  sourceVideo.play();
  mediaPipe.predictWebcam(sourceVideo);
  console.log("Our source video is sent to MediaPipe");
}

// start videos on click
document.addEventListener("click", videoGo);

// function: window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setCameraDimensions(bgVideo);
}
