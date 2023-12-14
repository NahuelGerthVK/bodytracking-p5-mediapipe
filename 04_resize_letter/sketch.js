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
- draw a an ellipse on index finger
- draw a an ellipse on thumb
- calculate the center point between index and thumb
- draw a letter at the center point
- calculate the distance between index and thumb
- use distance to change letter size

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
  if (mediaPipe.landmarks[0]) { // is hand tracking ready?

    // index finger
    let indexX = map(mediaPipe.landmarks[0][8].x, 1, 0, 0, capture.scaledWidth);
    let indexY = map(mediaPipe.landmarks[0][8].y, 0, 1, 0, capture.scaledHeight);

    // thumb
    let thumbX = map(mediaPipe.landmarks[0][4].x, 1, 0, 0, capture.scaledWidth);
    let thumbY = map(mediaPipe.landmarks[0][4].y, 0, 1, 0, capture.scaledHeight);

    // center point between index and thumb
    let centerX = (indexX + thumbX) / 2;
    let centerY = (indexY + thumbY) / 2;

    // distance between index and thumb
    let distance = dist(indexX, indexY, thumbX, thumbY);

    push();
    centerOurStuff();

    // draw fingers
    fill('white');
    ellipse(indexX, indexY, ellipseSize, ellipseSize); // index finger
    ellipse(thumbX, thumbY, ellipseSize, ellipseSize); // thumb

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

