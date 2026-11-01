
import {
  HandLandmarker,
  FilesetResolver
} from '@mediapipe/tasks-vision';

export function createHandTracker({
  video,
  canvas,
  onLandmarks,
  onNoHand,
  onStatus
}) {
  const context = canvas.getContext('2d');

  let handLandmarker = null;
  let webcamRunning = false;
  let animationFrameId = null;
  let lastVideoTime = -1;

  async function start() {
    if (webcamRunning) return;

    onStatus?.('LOADING');

    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      );

      handLandmarker = await HandLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numHands: 1
        }
      );

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      video.srcObject = stream;
      await video.play();

      canvas.width = 640;
      canvas.height = 480;

      webcamRunning = true;
      lastVideoTime = -1;

      onStatus?.('ACTIVE');

      detectFrame();

    } catch (error) {
      console.error('Hand tracking error:', error);

      stop();

      onStatus?.('ERROR');

      throw error;
    }
  }

  function drawHand(landmarks) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],
      [0, 5], [5, 6], [6, 7], [7, 8],
      [5, 9], [9, 10], [10, 11], [11, 12],
      [9, 13], [13, 14], [14, 15], [15, 16],
      [13, 17], [17, 18], [18, 19], [19, 20],
      [0, 17]
    ];

    context.strokeStyle = '#39d6e7';
    context.lineWidth = 3;

    for (const [start, end] of connections) {
      context.beginPath();

      context.moveTo(
        (1 - landmarks[start].x) * canvas.width,
        landmarks[start].y * canvas.height
      );

      context.lineTo(
        (1 - landmarks[end].x) * canvas.width,
        landmarks[end].y * canvas.height
      );

      context.stroke();
    }

    context.fillStyle = '#ffffff';

    for (const point of landmarks) {
      context.beginPath();

      context.arc(
        (1 - point.x) * canvas.width,
        point.y * canvas.height,
        5,
        0,
        Math.PI * 2
      );

      context.fill();
    }
  }

  function detectFrame() {
    if (!webcamRunning || !handLandmarker) return;

    if (
      video.readyState >= 2 &&
      video.currentTime !== lastVideoTime
    ) {
      lastVideoTime = video.currentTime;

      const result = handLandmarker.detectForVideo(
        video,
        performance.now()
      );

      context.clearRect(0, 0, canvas.width, canvas.height);

      if (result.landmarks && result.landmarks.length > 0) {
        const landmarks = result.landmarks[0];

        drawHand(landmarks);
        onLandmarks?.(landmarks);
      } else {
        onNoHand?.();
      }
    }

    animationFrameId = requestAnimationFrame(detectFrame);
  }

  function stop() {
    webcamRunning = false;

    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }

    if (handLandmarker) {
      handLandmarker.close();
      handLandmarker = null;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    lastVideoTime = -1;

    onStatus?.('OFF');
  }

  return {
    start,
    stop,
    isRunning: () => webcamRunning
  };
}
