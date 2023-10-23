import { Mesh, ShaderMaterial } from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

export type GLTFCow = GLTF & {
  nodes: {
    body: Mesh;
    eye_main: Mesh;
    eye_main001: Mesh;
    nose: Mesh;
    eye: Mesh;
    eye001: Mesh;
    nose_dot: Mesh;
    nose_dot001: Mesh;
    leg: Mesh;
    leg001: Mesh;
    leg002: Mesh;
    leg003: Mesh;
    horn: Mesh;
    horn001: Mesh;
    tail: Mesh;
  };
  materials: {
    body: ShaderMaterial;
    eye_main: ShaderMaterial;
    eye: ShaderMaterial;
    nose: ShaderMaterial;
    nose_dot: ShaderMaterial;
    leg: ShaderMaterial;
    horn: ShaderMaterial;
  };
};

export type GLTFAlienSpaceShip = GLTF & {
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
