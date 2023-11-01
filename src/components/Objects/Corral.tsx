import React, { useEffect, useState } from "react";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { CowsNumber } from "../Scene";

interface IProps {}

const Corral: React.FC<IProps> = () => {
  const [cowsInCorrel, setCowsInCorrel] = useState<string[]>([]);

  const handleCowsInCorrel = (name: string | undefined) => {
    if (!name) return;

    setCowsInCorrel((prev) => [...new Set([...prev, name])]);
  };

  useEffect(() => {
    console.log("SCORE", CowsNumber.cows, cowsInCorrel.length);

    if (CowsNumber.cows === cowsInCorrel.length) {
      console.log("WINNER");
    }
  }, [cowsInCorrel]);

  return (
    <RigidBody type="fixed">
      <CuboidCollider
        position={[11, 0, -10]}
        args={[5, 0.001, 5]}
        name="CORRAL"
        sensor
        onIntersectionEnter={(e) =>
          e.colliderObject?.name === "alien_spaceship"
            ? false
            : handleCowsInCorrel(e.rigidBodyObject?.name)
        }
      />
    </RigidBody>
  );
};

export default Corral;
