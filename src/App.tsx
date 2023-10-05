import { OrbitControls } from "@react-three/drei";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";

function App() {
  return (
    <Canvas camera={{ fov: 20 }}>
      <Scene />
      <ambientLight />
      <OrbitControls enableRotate={false} />
    </Canvas>
  );
}

export default App;
