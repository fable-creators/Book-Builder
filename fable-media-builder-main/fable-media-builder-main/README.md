# Fable MediaBuilder Demo

This project integrates a Three.js scene with a Unity WebGL build, allowing for a seamless combination of 3D web graphics and Unity-based content.

## Setup

1. Build your Unity WebGL project:
   - Open your Unity project
   - Go to File > Build Settings
   - Select WebGL as the platform
   - Click "Build" and choose a destination folder

2. Copy Unity build output to this project:
   - Navigate to your Unity build output folder
   - Copy the contents of the `Build` folder
   - Paste these folders into the `public` directory of this project
   - You may need to create the `public` directory if it doesn't exist already
   - You may need to extract the gzip files in the `Build` folder to get the files, they should override the existing files.

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   This will start a local server, typically at `http://localhost:5173`

5. For production build:
   ```bash
   npm run build
   ```
   This will create a production-ready build in the `dist` directory

## Project Structure

- `public/`: Contains static assets including Unity WebGL build files
  - `Build/`: Unity WebGL build output
  - `TemplateData/`: Unity WebGL template data
- `src/`: Source files for the Three.js part of the project
- `index.html`: Main HTML file that includes both Three.js and Unity WebGL canvases

## Development

The main integration logic can be found in `src/main.js`. This file sets up the Three.js scene and handles the Unity WebGL instance creation and communication.

## Deployment

After building the project, you can deploy the contents of the `dist` directory to any static file hosting service. Make sure your hosting service is configured to serve the Unity WebGL files correctly, especially the `.data`, `.wasm`, and `.framework.js` files.

## Credits
- [Three.js](https://threejs.org/)
- [Unity](https://unity.com/)
- [Vite](https://vitejs.dev/)
