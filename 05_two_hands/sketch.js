/* - - MediaPipe Hands tracking - - */

/*

Which tracking points can I use?
https://developers.google.com/static/mediapipe/images/solutions/hand-landmarks.png

We have a total of 21 points per hand:
0 = wrist
4 = thumb tip
8 = index finger tip
20 = pinky tip

Full documentation
https://developers.google.com/mediapipe/solutions/vision/hand_landmarker

What we do in this example:


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
  if (mediaPipe.landmarks[0] && mediaPipe.landmarks[1]) { // is at least one hand tracking ready?

    // index finger 1
    let index1X = map(mediaPipe.landmarks[0][8].x, 1, 0, 0, capture.scaledWidth);
    let index1Y = map(mediaPipe.landmarks[0][8].y, 0, 1, 0, capture.scaledHeight);

    // index finger 2
    let index2X = map(mediaPipe.landmarks[1][8].x, 1, 0, 0, capture.scaledWidth);
    let index2Y = map(mediaPipe.landmarks[1][8].y, 0, 1, 0, capture.scaledHeight);

    // center point between index1 and index2
    let centerX = (index1X + index2X) / 2;
    let centerY = (index1Y + index2Y) / 2;

    // distance between index1 and index2
    let distance = dist(index1X, index1Y, index2X, index2Y);

    push();
    centerOurStuff();

    // draw fingers
    fill('white');
    ellipse(index1X, index1Y, ellipseSize, ellipseSize); // index finger
    ellipse(index2X, index2Y, ellipseSize, ellipseSize); // thumb

    // draw center point
    fill('red');
    //ellipse(centerX, centerY, ellipseSize, ellipseSize);
    textSize(distance * 0.9);
    text("A", centerX, centerY);
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

