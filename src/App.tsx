import { KeyboardControls, OrbitControls } from "@react-three/drei";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import Lights from "./components/Lights";

function App() {
  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "KeyW"] },
        { name: "backward", keys: ["ArrowDown", "KeyS"] },
        { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
        { name: "rightward", keys: ["ArrowRight", "KeyD"] },
        { name: "portal", keys: ["Space"] },
      ]}
    >
      <Canvas camera={{ fov: 40 }} shadows={true}>
        <Scene />
        <Lights />
        <OrbitControls />
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
