/* - - MediaPipe Face and hands tracking - - */

/*

Hand points (handLandmarks):
https://developers.google.com/static/mediapipe/images/solutions/hand-landmarks.png

We have a total of 21 points per hand:
0 = wrist
4 = thumb tip
8 = index finger tip
20 = pinky tip


Face points (faceLandmarks):
https://storage.googleapis.com/mediapipe-assets/documentation/mediapipe_face_landmark_fullsize.png

4 = nose tip
13 = upper lip
14 = lower lip
310 = mouth left corner
78 = mouth right corner
473 = left eye
468 = right eye


What we do in this example:
- get index fingers from both hands
- get nose tip
- see if index touches nose tip

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
  textAlign(CENTER, CENTER);
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
  // Check if landmarks are available
  if (
    mediaPipe.handLandmarks.length > 0 &&
    mediaPipe.faceLandmarks.length > 0
  ) {

    // index finger 1
    let indexX = map(mediaPipe.handLandmarks[0][8].x, 1, 0, 0, capture.scaledWidth);
    let indexY = map(mediaPipe.handLandmarks[0][8].y, 0, 1, 0, capture.scaledHeight);

    // index finger 2
    let index2X = map(mediaPipe.handLandmarks[1][8].x, 1, 0, 0, capture.scaledWidth);
    let index2Y = map(mediaPipe.handLandmarks[1][8].y, 0, 1, 0, capture.scaledHeight);

    // nose tip
    let noseX = map(mediaPipe.faceLandmarks[0][4].x, 1, 0, 0, capture.scaledWidth);
    let noseY = map(mediaPipe.faceLandmarks[0][4].y, 0, 1, 0, capture.scaledHeight);

    // // center point between index1 and index2
    // let centerX = (index1X + index2X) / 2;
    // let centerY = (index1Y + index2Y) / 2;

    // // distance between index1 and index2
    // let distance = dist(index1X, index1Y, index2X, index2Y);

    push();
    centerOurStuff();

    // Draw ellipses
    fill('white'); // Adjust the color as needed
    ellipse(indexX, indexY, ellipseSize, ellipseSize); // index finger 1
    ellipse(index2X, index2Y, ellipseSize, ellipseSize); // index finger 2
    ellipse(noseX, noseY, ellipseSize, ellipseSize); // nose


    // Draw labels
    fill('blue');

    // // draw fingers
    // fill('white');
    // ellipse(index1X, index1Y, ellipseSize, ellipseSize); // index finger
    // ellipse(index2X, index2Y, ellipseSize, ellipseSize); // thumb

    // // fingers touch
    // if (distance < 100) {
    //   fill('blue');
    //   textSize(200);
    //   text("BOOM!", centerX, centerY);
    // }

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

