import { OrbitControls } from "@react-three/drei";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";

// min and max Polar Angle sets the camera field of view
const enum CameraSettings {
  camera_angle = 4,
  fov = 40,
  minDistance = 10,
  maxDistance = 14,
  dampingFactor = 0.05,
}

function App() {
  return (
    <Canvas camera={{ fov: CameraSettings.fov }}>
      <Scene />
      <ambientLight />
      <OrbitControls
        minDistance={CameraSettings.minDistance}
        maxDistance={CameraSettings.maxDistance}
        enableDamping={true}
        enableRotate={false}
        dampingFactor={CameraSettings.dampingFactor}
        screenSpacePanning={true}
        maxPolarAngle={Math.PI / CameraSettings.camera_angle}
        minPolarAngle={Math.PI / CameraSettings.camera_angle}
      />
    </Canvas>
  );
}

export default App;
