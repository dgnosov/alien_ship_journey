import { useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Group, Mesh, ShaderMaterial } from "three";
import { GLTF } from "three-stdlib";
import { RapierRigidBody, RigidBody } from "@react-three/rapier";

interface IProps {}

type GLTFResult = GLTF & {
  nodes: {
    spaceship: Mesh;
    portal: Mesh;
    cabine: Mesh;
    lights: Mesh;
  };
  materials: {
    metalic: ShaderMaterial;
    glass: ShaderMaterial;
    lights: ShaderMaterial;
  };
};

const AlienShip: React.FC<IProps> = ({}) => {
  const { nodes, materials } = useGLTF(
    "./models/alien_spaceship.glb"
  ) as GLTFResult;

  const spaceshipRB = useRef<RapierRigidBody>(null);
  const spaceshipGroup = useRef<Group>(null!);
  const [_, getKeys] = useKeyboardControls();

  useFrame((state, delta) => {
    /**
     * Rotate and bounce
     */
    if (!spaceshipGroup.current) return;
    spaceshipGroup.current.rotateY(delta * 0.5);
    const time = state.clock.getElapsedTime();
    spaceshipGroup.current.position.y = Math.sin(time) / 10.0;

    /**
     * Keyboard actions
     */
    const { forward, backward, leftward, rightward, portal } = getKeys();

    /**
     * Fly phisics of alien space ship
     */
    const impulse = { x: 0, y: 0, z: 0 };
    const torgue = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torgueStrength = 0.2 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torgue.x -= torgueStrength;
    }

    if (rightward) {
      impulse.x += impulseStrength;
      torgue.z -= torgueStrength;
    }

    if (backward) {
      impulse.z += impulseStrength;
      torgue.x += torgueStrength;
    }

    if (leftward) {
      impulse.x -= impulseStrength;
      torgue.z += torgueStrength;
    }

    if (portal) {
      console.log("catch", portal);
    }

    spaceshipRB.current?.applyImpulse(impulse, true);
    spaceshipRB.current?.applyTorqueImpulse(torgue, true);
  });

  return (
    <RigidBody
      gravityScale={0}
      ref={spaceshipRB}
      colliders="hull"
      restitution={0.2}
      linearDamping={0.5}
      angularDamping={2}
      position={[2, 2, 1]}
    >
      <group ref={spaceshipGroup} dispose={null} scale={0.3}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.spaceship.geometry}
          material={materials.metalic}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.portal.geometry}
          material={nodes.portal.material}
          position={[0, -0.31, 0]}
          rotation={[0, 0, Math.PI]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.cabine.geometry}
          material={materials.glass}
          position={[0, -0.028, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.lights.geometry}
          material={materials.lights}
          position={[0, -0.156, 0]}
          rotation={[0, -0.786, 0]}
        />
      </group>
    </RigidBody>
  );
};

useGLTF.preload("/alien_spaceship.glb");

export default AlienShip;
