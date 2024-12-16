/* eslint-disable react/no-unknown-property */

// https://threejs.org/manual/#en/scenegraph

import { setBaseValue, useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useThree } from "@react-three/fiber";
import { OrbitControls, useHelper } from '@react-three/drei'
import { PointLightHelper } from 'three'

// use just one sphere for everything
const radius = 1;
const width_segments = 6;
const height_segments = 6;
const default_args = [radius, width_segments, height_segments]

function Light() {
  const ref = useRef()
  useHelper(ref, PointLightHelper, 1)

  return <pointLight ref={ref} args={[`white`, 100, 0]} position={[0, 0, 0]} />
}


function Sun({ phi }) {

  return (
    <>
      <mesh rotation={[0, phi, 0]} scale={[5, 5, 5]} position={[0, 0, 0]}>
        <sphereGeometry args={default_args} />
        <meshLambertMaterial emissive="#FFFF00" attach="material"/>
      </mesh>
    </>
  )
}

function Earth({ phi }) {

  return (
    <>
      <mesh position={[10, 0, 0]}>
        <meshLambertMaterial color="#2233FF"   attach="material"/>
        <sphereGeometry args={default_args} />
      </mesh>
    </>
  )
}

function SolarSystem({ phi }) {

  return (
    <object3D rotation={[0, phi / 2, 0]}>
      <pointLight color="#FFFFFF" intenisty={500} />
      <Sun phi={phi} />
      <Earth phi={phi} />
    </object3D>
  )
}


function SetupComponent() {
  // "Hook into" camera and set the lookAt position
  const { camera } = useThree();
  camera.lookAt(0, 0, 0);

  // Return an empty fragment
  return <></>;
}

function App() {
  const [phi, setPhi] = useState(0);

  useEffect(() => {
    const rot_range = [0, 2 * Math.PI];
    const rot_step = (rot_range[1] - rot_range[0]) / 360;
    const interval = setInterval(() => {
      setPhi(rot => rot + rot_step);
      // if (phi + rot_step <= rot_range[1]) {
      //   setPhi(rot => rot + rot_step);
      // }
      // else {
      //   setPhi(0)
      // }
    }, 10);
    return () => clearInterval(interval);
  }, [phi]);

  return (
    <Canvas
      style={{ background: "black" }}
      camera={{ position: [0, 50, 0], up: [0, 0, 1], fov: 40, near: 0.1, far: 1000, aspect: 2 }}
    >
      <SetupComponent />
      <OrbitControls />
      <gridHelper scale={5}/>
      <Light />
      <SolarSystem phi={phi} />
    </Canvas>
  )
}

export default App
