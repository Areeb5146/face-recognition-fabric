
# Face Detection App

This React application demonstrates real-time face detection in a video using the face-api.js library. The application allows users to upload a video file, and it will detect faces in the video, drawing rectangles around them using fabricJs.

## Getting Started

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/face-detection-app.git
   cd face-detection-app
2. Install dependencies:
    ```bash
    npm install
3. Run the application:
    ```bash
    npm start

This will start the development server, and you can view the app by navigating to http://localhost:3000 in your web browser.

## Usage

Upload Video: Click on the "Upload file" button to select a video file. The app supports various video formats.
Play/Pause: Use the "Play" button to start or pause the video playback.
Face Detection: The app will automatically detect faces in real-time and draw rectangles around them. The detection is performed using face-api.js with pre-loaded models.

## Technologies Used
1. React.js: A JavaScript library for building user interfaces.
2. Fabric.js: A powerful and simple-to-use library for working with the HTML5 canvas.
3. face-api.js: A JavaScript API for face detection and recognition.
4. TailwindCss: For UI 

## Credits

This app uses the face-api.js library, and the face detection models are loaded from the official face-api.js GitHub repository:

- [face-api.js GitHub Repository](https://github.com/justadudewhohacks/face-api.js)

