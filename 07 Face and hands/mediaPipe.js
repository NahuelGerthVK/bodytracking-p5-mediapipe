// imports for hands
import {
  HandLandmarker,
  FilesetResolver as HandFilesetResolver, // Rename it for hands
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

// imports for face
import vision from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";
const { FaceLandmarker, FilesetResolver: FaceFilesetResolver, DrawingUtils } = vision;


// make an object to export
const mediaPipe = {
  handednesses: [],
  handLandmarks: [],
  faceLandmarks: [],
  worldLandmarks: [],
};

let handLandmarker;
let faceLandmarker;
let runningMode = "VIDEO";
let lastVideoTime = -1;

// Initialize HandLandmarker
const createHandLandmarker = async () => {
  const vision = await HandFilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
      delegate: "GPU",
    },
    runningMode: runningMode,
    numHands: 2, // change number of hands here
  });
};
createHandLandmarker();


// Initialize FaceLandmarker
const createFaceLandmarker = async () => {
  const vision = await FaceFilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
      delegate: "GPU",
    },
    outputFaceBlendshapes: true,
    runningMode,
    numFaces: 1
  });
};
createFaceLandmarker();


const predictWebcam = async (video) => {
  // Now let's start detecting the stream.
  let startTimeMs = performance.now();

  if (lastVideoTime !== video.elt.currentTime) {
    lastVideoTime = video.elt.currentTime;

    // Detect hand landmarks
    const handResults = handLandmarker.detectForVideo(video.elt, startTimeMs);
    mediaPipe.handednesses = handResults.handednesses;
    mediaPipe.handLandmarks = handResults.landmarks;
    mediaPipe.worldLandmarks = handResults.worldLandmarks;


    // Detect face landmarks
    const faceResults = faceLandmarker.detectForVideo(video.elt, startTimeMs);
    mediaPipe.faceLandmarks = faceResults.faceLandmarks;
  }

  // Call this function again to keep predicting when the browser is ready.
  window.requestAnimationFrame(() => {
    predictWebcam(video);
  });
};

// add the predictWebcam function to the mediaPipe object
mediaPipe.predictWebcam = predictWebcam;

// export our object so we can use it globally
export { mediaPipe };
