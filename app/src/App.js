import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { fabric } from "fabric";
import { Button, FileInput, Label } from "flowbite-react";

const App = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    const videoElement = videoRef.current;
    if (videoElement.paused) {
      videoElement.play();
      setIsPlaying(true);
    } else {
      videoElement.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/weights"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/weights"),
      ]);
    };

    const initializeApp = async () => {
      await loadModels();

      const videoElement = videoRef.current;
      const canvas = new fabric.Canvas(canvasRef.current);

      const scaleVideo = (video, canvas) => {
        const width = video.clientWidth;
        const height = video.clientHeight;

        video.width = width;
        video.height = height;

        canvas.setDimensions({ width, height });
      };

      const drawFaces = (faces) => {
        const objectsToRemove = canvas.getObjects();
        canvas.remove(...objectsToRemove);
      
        const videoElement = videoRef.current;
        const scalingFactor = {
          x: videoElement.clientWidth / videoElement.videoWidth,
          y: videoElement.clientHeight / videoElement.videoHeight,
        };
      
        faces.forEach((face) => {
          const { x, y, width, height } = face.detection.box;
          const adjustedX = x * scalingFactor.x;
          const adjustedY = y * scalingFactor.y;
      
          const rect = new fabric.Rect({
            left: adjustedX,
            top: adjustedY,
            width: width * scalingFactor.x,
            height: height * scalingFactor.y,
            fill: "transparent",
            stroke: "red",
            strokeWidth: 2,
            selectable: false,
          });
      
          canvas.add(rect);
        });
      };

      const detectFaces = async () => {
        const detections = await faceapi
          .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();
        drawFaces(detections);
      };

      videoElement.addEventListener("loadedmetadata", () => {
        scaleVideo(videoElement, canvas);
      });

      const interval = setInterval(() => {
        detectFaces();
      }, 100);

      return () => {
        clearInterval(interval);
      };
    };

    initializeApp();
  }, []);

  const handleFileChange = () => {
    const file = fileInputRef.current.files[0];
    if (file) {
      const videoElement = videoRef.current;
      videoElement.src = URL.createObjectURL(file);
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div>
        <div className="mb-2 block">
          <Label htmlFor="file-upload" value="Upload file" />
        </div>
        <FileInput
          id="file-upload"
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </div>

      <div className="relative flex justify-center">
        <video ref={videoRef} className="absolute object-fit contain" />
        <canvas ref={canvasRef} className="absolute object-fit contain" />
      </div>

      <div className="flex items-end justify-center">
        <Button
          outline
          gradientDuoTone="purpleToPink"
          onClick={togglePlayPause}
          className="mb-1"
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
      </div>
    </div>
  );
};

export default App;