import { useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Group, Mesh, Vector, Vector3 } from "three";
import {
  CollisionPayload,
  RapierRigidBody,
  RigidBody,
} from "@react-three/rapier";
import { useControls } from "leva";
import { GLTFAlienSpaceShip } from "../../types/types";
import { useSpring, animated } from "@react-spring/three";

interface IProps {}

const enum Directions {
  forward = "forward",
  rightward = "rightward",
  backward = "backward",
  leftward = "leftward",
  zero = "",
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
  const [YCoord, setYCoord] = useState(0);
  const [XCoord, setXCoord] = useState(0);
  const [ZCoord, setZCoord] = useState(0);
  const [direction, setDirection] = useState("");
  const [checkIsCowOnBoard, setCheckIsCowOnBoard] = useState(false);

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
    spaceshipGroup.current.position.y = Math.sin(time) / 20.0;

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
      setDirection(Directions.forward);
    }

    if (rightward) {
      impulse.x += impulseStrength;
      torgue.z -= torgueStrength;
      setDirection(Directions.rightward);
    }

    if (backward) {
      impulse.z += impulseStrength;
      torgue.x += torgueStrength;
      setDirection(Directions.backward);
    }

    if (leftward) {
      impulse.x -= impulseStrength;
      torgue.z += torgueStrength;
      setDirection(Directions.leftward);
    }

    if (ray) {
      if (!spaceshipRay.current) return;
      // Turn on the light
      if (!checkIsCowOnBoard) {
        spaceshipRay.current.visible = true;
      }
      updateCowsPosition(time, delta);
    } else {
      if (!spaceshipRay.current) return;
      // Turn off the light
      spaceshipRay.current.visible = false;
      setDirection(Directions.zero);
      reset(delta);
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
    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);

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
   * Reset cows to initial state
   * @returns
   */
  const reset = (delta: number) => {
    setIntersation(undefined);
    setYCoord(0);
    setCheckIsCowOnBoard(false);
    if (!intersaction?.rigidBody) return;

    const impulse = { x: 0, y: 0, z: 0 };

    // Impulse after ray lost cow
    // Effect of cow fly after drop, to avoid zero drop
    if (direction === Directions.forward) {
      impulse.x -= delta * 0.2;
      impulse.z -= delta * 0.2;
    }

    if (direction === Directions.rightward) {
      impulse.x += delta * 0.2;
      impulse.z -= delta * 0.2;
    }

    if (direction === Directions.backward) {
      impulse.x += delta * 0.2;
      impulse.z += delta * 0.2;
    }

    if (direction === Directions.leftward) {
      impulse.x -= delta * 0.2;
      impulse.z += delta * 0.2;
    }

    if (direction === Directions.zero) {
      impulse.x = delta * 0.01;
      impulse.z = delta * 0.01;
    }

    intersaction.rigidBody.applyImpulse(impulse, true);
    intersaction.rigidBody.setGravityScale(1, false);

    if (!intersaction.rigidBodyObject) return;
    intersaction.rigidBodyObject.visible = true;
  };

  /**
   * Method to update cow's position when ship ray above the cow
   * @returns undefined
   */
  const updateCowsPosition = (time: number, delta: number) => {
    if (!intersaction?.rigidBody || !spaceshipRB.current) return;

    const positionInsideRay = 0.3;
    const speedOnCowrayUp = 0.05;

    // Ship coords to fix cow on ship movement
    const fixedPos = {
      x: spaceshipRB.current.translation().x,
      y: YCoord,
      z: spaceshipRB.current.translation().z,
    };

    // Selected cow start coords
    const startPos = {
      x: intersaction.rigidBody.translation().x,
      y: intersaction.rigidBody.translation().y,
      z: intersaction.rigidBody.translation().z,
    } as Vector3;

    // Ship coords on scene
    const endPos = {
      x: spaceshipRB.current.translation().x,
      y: spaceshipRB.current.translation().y,
      z: spaceshipRB.current.translation().z,
    } as Vector3;

    const t = Math.min(time / delta, speedOnCowrayUp);

    // Smooth calculating of two Vector3 (from one to another)
    const currentPosition = new Vector3().lerpVectors(startPos, endPos, t);

    // Final cow coords for movement with ship
    const finalPos =
      currentPosition.y >= spaceshipRB.current.translation().y
        ? fixedPos
        : currentPosition;

    intersaction.rigidBody.setTranslation(finalPos, true);
    intersaction.rigidBody.setGravityScale(0.005, false);

    if (YCoord >= positionInsideRay) {
      setYCoord(positionInsideRay);
      return;
    }

    setYCoord((prev) => (prev += delta / 2));

    if (!intersaction.rigidBodyObject || !spaceshipRay.current) return;

    // If cow is on board, hide cow and ray
    if (currentPosition.y >= 0.8) {
      intersaction.rigidBodyObject.visible = false;
      spaceshipRay.current.visible = false;
      setCheckIsCowOnBoard(true);
    } else {
      setCheckIsCowOnBoard(false);
    }
  };

  /**
   * We can take only one cow
   * @param e -CollisionPayload
   * @returns
   */
  const checkIntersaction = (e: CollisionPayload) => {
    if (intersaction) return;
    setIntersation(e);
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
      onIntersectionEnter={(e) => checkIntersaction(e)}
      onIntersectionExit={(e) => checkIntersaction(e)}
      sensor
    >
      <group ref={spaceshipGroup} dispose={null} scale={0.3} castShadow>
        <group position={[0, -1.2, 0]} visible={true}>
          <mesh ref={spaceshipRay}>
            <coneGeometry args={[1, 4, 10]} />
            <meshPhongMaterial transparent color="red" opacity={0.5} />
          </mesh>
        </group>
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
          name="lights"
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
