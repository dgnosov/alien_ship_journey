import { KeyboardControls, OrbitControls } from "@react-three/drei";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import Scene from "./components/Scene";
import Lights from "./components/Lights";
import { Perf } from "r3f-perf";

function App() {
  return (
    <KeyboardControls
      map={[
        { name: "forward", keys: ["ArrowUp", "KeyW"] },
        { name: "backward", keys: ["ArrowDown", "KeyS"] },
        { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
        { name: "rightward", keys: ["ArrowRight", "KeyD"] },
        { name: "ray", keys: ["Space"] },
      ]}
    >
      <Canvas camera={{ fov: 40 }} shadows={true}>
        {/* <Perf /> */}
        <Scene />
        <Lights />
        <OrbitControls />
        {/* <axesHelper args={[5]} /> */}
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
