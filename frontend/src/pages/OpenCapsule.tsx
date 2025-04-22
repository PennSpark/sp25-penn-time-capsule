import BackButton from "../components/BackButton";
import GradientBackground from "../components/GradientBackground";
import GachaponMachineOpen from "../components/GachaponMachineOpen";
import { useState, useEffect, useMemo, useRef } from "react";
import { Calendar, Grid, ImageIcon, Plus, Code2 } from "lucide-react"
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Leva, useControls } from "leva";
import * as THREE from "three";

type file = 
{
  url: String,
  fileType: String
}

export default function OpenCapsule() {
  const [showCanvas, setShowCanvas] = useState(true);
  const capsuleId: String = localStorage.getItem("capsuleId") || "";
  const [files, setFiles] = useState<file[]>([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
  const [capsuleOpened, setCapsuleOpened] = useState<boolean>(false);
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/files/get/${capsuleId}`)
        const data = await res.json();
        setFiles(data.files);
        console.log(data.files)
  
      } catch(err) {
        console.error(err)
      }
    }
    fetchFiles();
    
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowCanvas(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  // Debug UI for parameters
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

  // Derive data array from backend files
  const data = [
    { name: "filmBackground.jpg" },
    { name: "filmBackground.jpg" },
    { name: "filmBackground.jpg" },
    { name: "filmBackground.jpg" },
  ];


  
  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-start font-poppins text-center py-20">
      {capsuleOpened ? (
        <>
        <GradientBackground />
        <BackButton />
        <Leva collapsed />
        <div className="relative h-screen w-screen flex flex-col items-center justify-center font-poppins text-center">
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
      ) : (
        <>
          {/* Combined header and machine container */}
          <GradientBackground />
          <BackButton />
          <div className="absolute top-32 left-0 right-0 z-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 mx-5">
              Spark
            </h1>

            <div className="flex items-center justify-center text-white/80 mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-lg md:text-2xl">
                {new Date(localStorage.getItem("capsuleDate") || "").toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
            </div>

            <img
              alt="machine"
              src="machine_render.png"
              className="max-h-80 mx-auto"
            />
            <button
  onClick={() => setCapsuleOpened(true)}
  className="mx-auto block mt-6 px-10 py-5 text-sm font-semibold text-white rounded-md bg-white/10 hover:bg-white/20 hover:scale-105 transition transform duration-300"
>
  Open Capsule
</button>
          </div>
        </>
      )}


      
    </div>


  );
}
function calculateRotations(x: number, y: number, params: any) {
  const a = 1 / (params.depth * params.curvature);
  const rotationY = Math.atan(-2 * a * x);
  const normalizedY = y / ((params.rows * params.spacing) / 2);
  const rotationX = normalizedY * params.verticalCurvature;
  return { rotationX, rotationY };
}

function calculatePosition(row: number, col: number, params: any) {
  const x = (col - params.cols / 2) * params.spacing;
  const y = (row - params.rows / 2) * params.spacing;
  let z = (x * x) / (params.depth * params.curvature);
  const normY = y / ((params.rows * params.spacing) / 2);
  z += Math.abs(normY) * normY * params.verticalCurvature * 5;
  const posY = y + params.elevation;
  const { rotationX, rotationY } = calculateRotations(x, posY, params);
  return { x, y: posY, z, rotationX, rotationY };
}

// Three.js image gallery
function Gallery({ data, params }: any) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const lookAtTarget = useRef(new THREE.Vector3());
  const refs = useRef<THREE.Mesh[]>([]);
  refs.current = [];
  const addRef = (r: THREE.Mesh) => r && refs.current.push(r);

  // Precompute metadata and load textures
  const loader = useMemo(() => new THREE.TextureLoader(), []);
  const planeMeta = useMemo(() => {
    const list: any[] = [];
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

  // Mouse parallax listener
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x =
        (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      mouse.current.y =
        (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Animation loop
  useFrame(() => {
    mouse.current.tx += (mouse.current.x - mouse.current.tx) * 0.05;
    mouse.current.ty += (mouse.current.y - mouse.current.ty) * 0.05;
    const tX = mouse.current.tx;
    const tY = mouse.current.ty;

    lookAtTarget.current.set(
      tX * params.lookAtRange,
      -tY * params.lookAtRange,
      (tX * tX) / (params.depth * params.curvature)
    );
    camera.lookAt(lookAtTarget.current);

    const time = performance.now() * 0.001;
    const dist = Math.hypot(tX, tY);

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

  // Render planes
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
