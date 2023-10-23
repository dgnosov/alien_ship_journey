import { useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Group, Mesh, Vector3 } from "three";
import {
  CollisionPayload,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useControls } from "leva";
import { GLTFAlienSpaceShip } from "../../types/types";

interface IProps {}

const AlienShip: React.FC<IProps> = ({}) => {
  const { nodes, materials } = useGLTF(
    "./models/alien_spaceship.glb"
  ) as GLTFAlienSpaceShip;

  const spaceshipRB = useRef<RapierRigidBody>(null);
  const spaceshipGroup = useRef<Group>(null);
  const spaceshipRay = useRef<Mesh>(null);
  const spaceshipLights = useRef<Mesh>(null);
  const [_, getKeys] = useKeyboardControls();
  const [smoothedCameraPosition] = useState(() => new Vector3());
  const [smoothedCameraTarget] = useState(() => new Vector3());

  const [intersaction, setIntersation] = useState<CollisionPayload>();

  // Value for better smootheffect on camera and space ship movement
  const [smoothIndex] = useState(3);

  const settings = useControls("Camera", {
    camera: {
      y: 5,
      z: 11,
      x: 0,
    },
    cameraTarget: {
      y: 0.35,
      z: 0.5,
      x: 0,
    },
  });

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
    const { forward, backward, leftward, rightward, ray } = getKeys();

    /**
     * Fly phisics of alien space ship
     */
    const impulse = { x: 0, y: 0, z: 0 };
    const torgue = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.4 * delta;
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

    if (ray) {
      if (!spaceshipRay.current) return;
      // Turn on the light
      spaceshipRay.current.visible = true;
      updateCowsPosition();
    } else {
      if (!spaceshipRay.current) return;
      // Turn off the light
      spaceshipRay.current.visible = false;

      // Reset intersaction on ray off
      setIntersation(undefined);
    }

    spaceshipRB.current?.applyImpulse(impulse, true);
    spaceshipRB.current?.applyTorqueImpulse(torgue, true);

    /**
     * Camera position
     */
    const spaceShipPosition = spaceshipRB.current?.translation();
    if (!spaceShipPosition) return;

    const cameraPosition = new Vector3();
    cameraPosition.copy(spaceShipPosition as Vector3);
    cameraPosition.z += settings.camera.z;
    cameraPosition.y += settings.camera.y;
    cameraPosition.x += settings.camera.x;

    const cameraTarget = new Vector3();
    cameraTarget.copy(spaceShipPosition as Vector3);
    cameraTarget.z = settings.cameraTarget.z;
    cameraTarget.x = settings.cameraTarget.x;
    cameraTarget.y = settings.cameraTarget.y;

    smoothedCameraPosition.lerp(cameraPosition, smoothIndex * delta);
    smoothedCameraTarget.lerp(cameraPosition, smoothIndex * delta);

    smoothedCameraTarget.z -= settings.cameraTarget.z;
    smoothedCameraTarget.y -= settings.cameraTarget.y;
    smoothedCameraTarget.x -= settings.cameraTarget.x;

    // Set fixed camera position
    // state.camera.position.copy(smoothedCameraPosition);
    // state.camera.lookAt(smoothedCameraTarget);

    // Get current rotation coords (The coords after torque)
    const getSpaceshipRBRotationCoords = spaceshipRB.current?.rotation();

    if (!getSpaceshipRBRotationCoords) return;

    // Convert coords for setRotation method
    const convertRotationCoords = {
      x: getSpaceshipRBRotationCoords?.x,
      y: getSpaceshipRBRotationCoords?.y,
      z: getSpaceshipRBRotationCoords?.z,
      w: getSpaceshipRBRotationCoords.w,
    };

    // We need to work with Y axis
    // Initial rotation coords of Alien sheep is {x: 0, y: 0, z: 0}
    // After torque aproxiamte coords is the following {x: 0.55512, y: 0.132154, z: 0.087879}
    // So we need smoothly reset it to 0
    // In this case we use -= delta on Y axis
    convertRotationCoords.y -= delta;

    spaceshipRB.current?.setRotation(convertRotationCoords, true);
  });

  /**
   * Method to update cow's position when ship ray above the cow
   * @returns undefined
   */
  const updateCowsPosition = () => {
    if (!intersaction?.rigidBody || !spaceshipRB.current) return;

    intersaction.rigidBody.setTranslation(
      new Vector3(
        spaceshipRB.current.translation().x,
        spaceshipRB.current.translation().y - 0.5,
        spaceshipRB.current.translation().z
      ),
      true
    );

    intersaction.rigidBody.setGravityScale(0.1, true);
  };

  return (
    <RigidBody
      gravityScale={0}
      ref={spaceshipRB}
      colliders="hull"
      restitution={1}
      linearDamping={0.5}
      angularDamping={2}
      position={[1, 1, 1]}
      name="alien_spaceship"
      onIntersectionEnter={(e) => setIntersation(e)}
      onIntersectionExit={(e) => setIntersation(e)}
      sensor
    >
      <group ref={spaceshipGroup} dispose={null} scale={0.3} castShadow>
        <mesh ref={spaceshipRay} position={[0, -2, 0]} visible={true}>
          <coneGeometry args={[2, 4, 10]} />
          <meshPhongMaterial transparent color="purple" opacity={0.3} />
        </mesh>
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
          ref={spaceshipLights}
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
