// local
import {
  PoseLandmarker,
  FilesetResolver,
} from "./mediapipe/tasks-vision@0.10.3.js";

// make an object to export
const mediaPipe = {
  landmarks: [],
  worldLandmarks: [],
};

let poseLandmarker;
let runningMode = "VIDEO";
// let video = null;
let lastVideoTime = -1;

// Before we can use PoseLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
const createPoseLandmarker = async () => {
  const vision = await FilesetResolver.forVisionTasks("./mediapipe/wasm"); //local

  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `./mediapipe/pose_landmarker_full.task`, //local
      delegate: "GPU",
    },
    runningMode: runningMode,
    numPoses: 1,
  });
};
createPoseLandmarker();

const predictWebcam = async (video) => {
  // Now let's start detecting the stream.
  let startTimeMs = performance.now();

  if (lastVideoTime !== video.elt.currentTime && poseLandmarker) {
    lastVideoTime = video.elt.currentTime;
    let results = poseLandmarker.detectForVideo(video.elt, startTimeMs);
    mediaPipe.landmarks = results.landmarks;
    mediaPipe.worldLandmarks = results.worldLandmarks;
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
