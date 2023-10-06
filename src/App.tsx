import { OrbitControls } from "@react-three/drei";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import { useControls } from "leva";

function App() {
  const cameraCrl = useControls("Camera", {
    camera_angle: 3,
    minDistance: 10,
    maxDistance: 14,
    dampingFactor: 0.05,
    fov: 40,
  });

  const directionalCtl = useControls("Directional Light", {
    visible: true,
    position: {
      x: -1.0,
      y: 4.4,
      z: 2.5,
    },
    castShadow: true,
  });

  return (
    <Canvas camera={{ fov: cameraCrl.fov }} shadows>
      <Scene />
      <directionalLight
        visible={directionalCtl.visible}
        position={[
          directionalCtl.position.x,
          directionalCtl.position.y,
          directionalCtl.position.z,
        ]}
        castShadow={directionalCtl.castShadow}
      />
      <ambientLight />
      <OrbitControls
        minDistance={cameraCrl.minDistance}
        maxDistance={cameraCrl.maxDistance}
        enableDamping={true}
        enableRotate={false}
        dampingFactor={cameraCrl.dampingFactor}
        screenSpacePanning={true}
        maxPolarAngle={Math.PI / cameraCrl.camera_angle}
        minPolarAngle={Math.PI / cameraCrl.camera_angle}
      />
    </Canvas>
  );
}

export default App;
