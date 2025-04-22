import { useState, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Leva, useControls } from "leva";
import * as THREE from "three";
import BackButton from "../components/BackButton";
import GradientBackground from "../components/GradientBackground";
import GachaponMachineOpen from "../components/GachaponMachineOpen";

export default function OpenCapsule() {
  const [showCanvas, setShowCanvas] = useState(true);

  // show the canvas after brian's animation finishes playing
  useEffect(() => {
    const timer = setTimeout(() => setShowCanvas(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  // debug UI for three js parameters
  const params = useControls({
    rows: { value: 7, min: 1, max: 20, step: 1 },
    cols: { value: 7, min: 1, max: 20, step: 1 },
    curvature: { value: 5, min: 0, max: 20, step: 0.1 },
    spacing: { value: 10, min: 0, max: 50, step: 0.1 },
    imageWidth: { value: 7, min: 1, max: 20, step: 0.1 },
    imageHeight: { value: 4.5, min: 1, max: 20, step: 0.1 },
    depth: { value: 7.5, min: 0, max: 50, step: 0.1 },
    elevation: { value: 0, min: -10, max: 10, step: 0.1 },
    lookAtRange: { value: 20, min: 1, max: 100, step: 1 },
    verticalCurvature: { value: 0.5, min: 0, max: 5, step: 0.1 },
  });

  // TODO: replace video files with first frame image file
  const data = useMemo(
    () => [
      { name: "filmBackground.jpg" },
      { name: "filmBackground.jpg" },
      { name: "filmBackground.jpg" },
      { name: "filmBackground.jpg" },
    ],
    []
  );

  return (
    <>
      <Leva collapsed />
      <div className="relative h-screen w-screen flex flex-col items-center justify-center font-poppins text-center">
        <GradientBackground />
        <BackButton />
        <h1 className="text-3xl sm:text-4xl font-bold text-white absolute">
          Open Capsule
        </h1>
        <div className="w-screen h-screen flex items-center justify-center">
          {showCanvas ? (
            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 0, 40]} />
              <OrbitControls />
              <Gallery data={data} params={params} />
            </Canvas>
          ) : (
            <GachaponMachineOpen />
          )}
        </div>
      </div>
    </>
  );
}

// math functions
function calculateRotations(
  x: number,
  y: number,
  params: {
    depth: number;
    curvature: number;
    rows: number;
    spacing: number;
    verticalCurvature: number;
  }
) {
  const a = 1 / (params.depth * params.curvature);
  const rotationY = Math.atan(-2 * a * x);
  const normalizedY = y / ((params.rows * params.spacing) / 2);
  const rotationX = normalizedY * params.verticalCurvature;
  return { rotationX, rotationY };
}

function calculatePosition(
  row: number,
  col: number,
  params: {
    cols: number;
    spacing: number;
    rows: number;
    depth: number;
    curvature: number;
    verticalCurvature: number;
    elevation: number;
  }
) {
  const x = (col - params.cols / 2) * params.spacing;
  const y = (row - params.rows / 2) * params.spacing;
  let z = (x * x) / (params.depth * params.curvature);
  const normY = y / ((params.rows * params.spacing) / 2);
  z += Math.abs(normY) * normY * params.verticalCurvature * 5;
  const posY = y + params.elevation;
  const { rotationX, rotationY } = calculateRotations(x, posY, params);
  return { x, y: posY, z, rotationX, rotationY };
}

// three js image gallery
function Gallery({ data, params }: any) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const lookAtTarget = useRef(new THREE.Vector3());

  // precompute plane metadata and load textures
  const loader = useMemo(() => new THREE.TextureLoader(), []);
  const planeMeta = useMemo(() => {
    const list = [];
    for (let row = 0; row < params.rows; row++) {
      for (let col = 0; col < params.cols; col++) {
        const imgData = data[Math.floor(Math.random() * data.length)];
        const texture = loader.load(imgData.name);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        const { x, y, z, rotationX, rotationY } = calculatePosition(
          row,
          col,
          params
        );
        list.push({
          key: `${row}-${col}`,
          texture,
          basePos: { x, y, z },
          baseRot: { x: rotationX, y: rotationY, z: 0 },
          parallaxFactor: Math.random() * 0.5 + 0.5,
          randomOffset: {
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1,
            z: Math.random() * 2 - 1,
          },
          rotationMod: {
            x: (Math.random() - 0.5) * 0.15,
            y: (Math.random() - 0.5) * 0.15,
            z: (Math.random() - 0.5) * 0.2,
          },
          phaseOffset: Math.random() * Math.PI * 2,
        });
      }
    }
    return list;
  }, [data, loader, params]);

  // track mouse for parallax
  useEffect(() => {
    const onMove = (e: { clientX: number; clientY: number }) => {
      mouse.current.x =
        (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      mouse.current.y =
        (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // refs for meshes
  const refs = useRef<THREE.Mesh[]>([]);
  refs.current = [];
  const addRef = (r: any) => r && refs.current.push(r);

  useFrame(() => {
    // smooth mouse
    mouse.current.tx += (mouse.current.x - mouse.current.tx) * 0.05;
    mouse.current.ty += (mouse.current.y - mouse.current.ty) * 0.05;
    const tX = mouse.current.tx;
    const tY = mouse.current.ty;

    // camera lookAt
    lookAtTarget.current.set(
      tX * params.lookAtRange,
      -tY * params.lookAtRange,
      (tX * tX) / (params.depth * params.curvature)
    );
    camera.lookAt(lookAtTarget.current);

    const time = performance.now() * 0.001;
    const dist = Math.sqrt(tX * tX + tY * tY);

    // update each mesh
    refs.current.forEach((mesh, i) => {
      const m = planeMeta[i];
      const parX = tX * m.parallaxFactor * 3 * m.randomOffset.x;
      const parY = tY * m.parallaxFactor * 3 * m.randomOffset.y;
      const osc = Math.sin(time + m.phaseOffset) * dist * 0.1;

      mesh.position.set(
        m.basePos.x + parX + osc * m.randomOffset.x,
        m.basePos.y + parY + osc * m.randomOffset.y,
        m.basePos.z + osc * m.randomOffset.z * m.parallaxFactor
      );
      mesh.rotation.set(
        m.baseRot.x + tY * m.rotationMod.x * dist + osc * m.rotationMod.x * 0.2,
        m.baseRot.y + tX * m.rotationMod.y * dist + osc * m.rotationMod.y * 0.2,
        m.baseRot.z +
          tX * tY * m.rotationMod.z * 2 +
          osc * m.rotationMod.z * 0.3
      );
    });
  });

  // return three js plane for each image
  return planeMeta.map((m) => (
    <mesh
      key={m.key}
      ref={addRef}
      position={[m.basePos.x, m.basePos.y, m.basePos.z]}
      rotation={[m.baseRot.x, m.baseRot.y, m.baseRot.z]}
    >
      <planeGeometry args={[params.imageWidth, params.imageHeight]} />
      <meshBasicMaterial
        map={m.texture}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  ));
}
