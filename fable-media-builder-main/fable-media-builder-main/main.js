import "./styles/style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

class ThreeJSUnityTemplate {
  constructor() {
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initLights();
    this.initMesh();
    this.initControls();
    this.initUnityInstance();
    this.addEventListeners();
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
  }

  initCamera() {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.camera.position.z = 3;
    this.scene.add(this.camera);
  }

  initRenderer() {
    this.canvas = document.querySelector("canvas.webgl");
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    const hemisphereLight = new THREE.HemisphereLight(0x7444ff, 0xff00bb, 0.5);
    const pointLight = new THREE.PointLight(0x7444ff, 1, 100);
    pointLight.position.set(0, 3, 4);
    this.scene.add(ambientLight, directionalLight, hemisphereLight, pointLight);
  }

  initMesh() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: "#7444ff" });
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
  }

  async initUnityInstance() {
    // Unity container and canvas should already exist in the DOM from the Unity template
    this.unityContainer = document.getElementById('unity-container');
    this.unityCanvas = document.getElementById('unity-canvas');

    // Load Unity build
    const buildUrl = "Build";
    const loaderUrl = buildUrl + "/BuildOutput.loader.js";
    const config = {
      dataUrl: buildUrl + "/webgl.data",  // removed .gz
      frameworkUrl: buildUrl + "/build.framework.js",  // removed .gz
      codeUrl: buildUrl + "/build.wasm",  // removed .gz
      streamingAssetsUrl: "StreamingAssets",
      companyName: "DefaultCompany",
      productName: "MediaBuilder",
      productVersion: "0.1",
      showBanner: unityShowBanner,
  };

    // Load Unity loader script
    const script = document.createElement('script');
    script.src = loaderUrl;
    
    // Wait for loader to be ready and create Unity instance
    script.onload = () => {
      createUnityInstance(this.unityCanvas, config, (progress) => {
        const progressBar = document.querySelector("#unity-progress-bar-full");
        if (progressBar) {
          progressBar.style.width = `${100 * progress}%`;
        }
      }).then(unityInstance => {
        this.unityInstance = unityInstance;
        // Hide loading bar
        const loadingBar = document.querySelector("#unity-loading-bar");
        if (loadingBar) {
          loadingBar.style.display = "none";
        }
        
        // Setup fullscreen button
        const fullscreenButton = document.querySelector("#unity-fullscreen-button");
        if (fullscreenButton) {
          fullscreenButton.onclick = () => {
            unityInstance.SetFullscreen(1);
          };
        }
      }).catch((message) => {
        alert(message);
      });
    };

    document.body.appendChild(script);
  }

  sendToUnity(gameObject, methodName, parameter) {
    if (this.unityInstance) {
      this.unityInstance.SendMessage(gameObject, methodName, parameter);
    }
  }

  addEventListeners() {
    window.addEventListener("resize", () => this.onResize());
  }

  onResize() {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;
    
    // Update Three.js
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Update Unity canvas size if needed
    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // For desktop, maintain Unity's original aspect ratio
      this.unityCanvas.style.width = "960px";
      this.unityCanvas.style.height = "600px";
    }
  }

  animate() {
    const elapsedTime = this.clock.getElapsedTime();
    
    // Animate mesh
    this.mesh.rotation.x = elapsedTime * 0.5;
    this.mesh.rotation.y = elapsedTime * 0.5;
    this.mesh.rotation.z = elapsedTime * 0.5;
    
    // Update controls
    this.controls.update();
    
    // Render Three.js scene
    this.renderer.render(this.scene, this.camera);
    
    // Call animate again on the next frame
    window.requestAnimationFrame(() => this.animate());
  }
}

// Initialize the template
new ThreeJSUnityTemplate();