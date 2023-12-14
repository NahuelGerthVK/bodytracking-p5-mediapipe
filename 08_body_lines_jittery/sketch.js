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
- draw a few points
- connect them with lines

*/


/* - - Variables - - */

// webcam variables
let capture; // our webcam
let captureEvent; // callback when webcam is ready

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
  fill('white');

}


/* - - Draw - - */
function draw() {

  background(0);


  /* WEBCAM */
  push();
  centerOurStuff(); // center the webcam
  scale(-1, 1); // mirror webcam
  image(capture, -capture.scaledWidth, 0, capture.scaledWidth, capture.scaledHeight); // draw webcam
  scale(-1, 1); // unset mirror
  pop();


  /* TRACKING */
  if (mediaPipe.landmarks[0]) { // is hand tracking ready?

    //console.log("we have a total of " + mediaPipe.landmarks[0].length + " points");

    // nose
    let noseX = map(mediaPipe.landmarks[0][0].x, 1, 0, 0, capture.scaledWidth);
    let noseY = map(mediaPipe.landmarks[0][0].y, 0, 1, 0, capture.scaledHeight);

    // left shoulder
    let leftShoulderX = map(mediaPipe.landmarks[0][12].x, 1, 0, 0, capture.scaledWidth);
    let leftShoulderY = map(mediaPipe.landmarks[0][12].y, 0, 1, 0, capture.scaledHeight);

    // right shoulder
    let rightShoulderX = map(mediaPipe.landmarks[0][11].x, 1, 0, 0, capture.scaledWidth);
    let rightShoulderY = map(mediaPipe.landmarks[0][11].y, 0, 1, 0, capture.scaledHeight);

    // left hand
    let leftHandX = map(mediaPipe.landmarks[0][19].x, 1, 0, 0, capture.scaledWidth);
    let leftHandY = map(mediaPipe.landmarks[0][19].y, 0, 1, 0, capture.scaledHeight);

    // right hand
    let rightHandX = map(mediaPipe.landmarks[0][20].x, 1, 0, 0, capture.scaledWidth);
    let rightHandY = map(mediaPipe.landmarks[0][20].y, 0, 1, 0, capture.scaledHeight);


    push();
    centerOurStuff();

    // draw lines
    strokeWeight(10);

    // lines left hand
    stroke('blue');
    line(0, 0, leftHandX, leftHandY); // top left to left hand
    line(0, capture.scaledHeight / 2, leftHandX, leftHandY); // middle left to left hand
    line(0, capture.scaledHeight, leftHandX, leftHandY); // bottom left to left hand

    // lines right hand
    stroke('red');
    line(capture.scaledWidth, 0, rightHandX, rightHandY); // top right to right hand
    line(capture.scaledWidth, capture.scaledHeight / 2, rightHandX, rightHandY); // middle right to right hand
    line(capture.scaledWidth, capture.scaledHeight, rightHandX, rightHandY); // bottom right to right hand

    // body lines
    stroke('yellow');
    line(noseX, noseY, leftShoulderX, leftShoulderY); // nose to left shoulder
    line(noseX, noseY, rightShoulderX, rightShoulderY); // nose to right shoulder
    line(leftShoulderX, leftShoulderY, rightShoulderX, rightShoulderY); // shoulders


    // draw points
    noStroke();
    fill('white');
    ellipse(noseX, noseY, ellipseSize, ellipseSize); // nose
    ellipse(leftShoulderX, leftShoulderY, ellipseSize, ellipseSize); // left shoulder
    ellipse(rightShoulderX, rightShoulderY, ellipseSize, ellipseSize); // right shoulder
    ellipse(leftHandX, leftHandY, ellipseSize, ellipseSize); // left hand
    ellipse(rightHandX, rightHandY, ellipseSize, ellipseSize); // right hand

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
  translate(width / 2 - capture.scaledWidth / 2, height / 2 - capture.scaledHeight / 2); // center the webcam
}

// function: window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setCameraDimensions(capture);
}

