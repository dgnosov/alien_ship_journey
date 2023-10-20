import { useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import {
  Group,
  Mesh,
  Object3D,
  Object3DEventMap,
  Vector,
  Vector3,
} from "three";
import {
  CollisionPayload,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useControls } from "leva";
import { GLTFAlienSpaceShip } from "../../types/types";

interface IProps {}

const enum intersactionTypes {
  start = "start",
  exit = "exit",
}

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
      if (
        !spaceshipRay.current ||
        !spaceshipRB.current
        // !intersaction?.rigidBodyObject
      )
        return;
      // Turn on the light
      spaceshipRay.current.visible = true;

      const test = spaceshipRB.current?.translation();

      console.log("test", intersaction);
      //       event.rigidBodyObject.gravityScale = 10;
      // event.rigidBodyObject.position.y = 0.4;

      // if (!intersaction?.rigidBodyObject) return;
      // intersaction.rigidBodyObject.position.y = 0.4;
      // intersaction.rigidBodyObject.position.x =
      //   spaceshipRB.current?.translation().x;
      // intersaction.rigidBodyObject.position.z =
      //   spaceshipRB.current?.translation().z;
    } else {
      if (!spaceshipRay.current) return;
      // Turn off the light
      spaceshipRay.current.visible = false;
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
    // In this case we use -= delta
    convertRotationCoords.y -= delta;

    spaceshipRB.current?.setRotation(convertRotationCoords, true);
  });

  /**
   * Check if spaceship ray intersect with cow
   * @param type
   * @param event
   * @returns
   */
  const checkIntersaction = (type: string, event: CollisionPayload | any) => {
    if (intersactionTypes.start === type) {
      if (!event.rigidBodyObject) return;
      setIntersation(event);
      return;
    }

    setIntersation(undefined);
  };

  /**
   * TODO
   * 1. При начале соприкосновение запишем данные в state
   * 2. При нажатии на пробел, проверим есть ли объект пересения
   *    и изменим у него
   */

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
      onIntersectionEnter={(e) => checkIntersaction(intersactionTypes.start, e)}
      onIntersectionExit={(e) => checkIntersaction(intersactionTypes.exit, e)}
      sensor
    >
      <group ref={spaceshipGroup} dispose={null} scale={0.3} castShadow>
        <mesh ref={spaceshipRay} position={[0, -1.5, 0]} visible={true}>
          <coneGeometry args={[1, 4, 10]} />
          <meshPhongMaterial transparent color="red" opacity={0.5} />
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
