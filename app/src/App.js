import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { fabric } from "fabric";
import { Button, FileInput, Label } from "flowbite-react";

const App = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Function to toggle play/pause of the video
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
    // Function to load face detection models
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

      // Function to scale the video and canvas dimensions
      const scaleVideo = (video, canvas) => {
        const width = video.clientWidth;
        const height = video.clientHeight;

        video.width = width;
        video.height = height;

        canvas.setDimensions({ width, height });
      };

      // Function to draw face rectangles on the canvas
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

      // Function to detect faces in the video
      const detectFaces = async () => {
        const detections = await faceapi
          .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks();
        drawFaces(detections);
      };

      // Event listener for when the video metadata is loaded
      videoElement.addEventListener("loadedmetadata", () => {
        scaleVideo(videoElement, canvas);
      });

      // Interval to repeatedly detect faces in the video
      const interval = setInterval(() => {
        detectFaces();
      }, 100);

      return () => {
        clearInterval(interval);
      };
    };

    initializeApp();
  }, []);

  // Event handler for when a new video file is selected
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