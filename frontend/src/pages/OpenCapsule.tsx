import { useState, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  useTexture,
} from "@react-three/drei";
import { Leva, useControls } from "leva";
import * as THREE from "three";
import BackButton from "../components/BackButton";
import GradientBackground from "../components/GradientBackground";
import { useLocation, useNavigate } from "react-router-dom";
import GachaponMachineAnimation from "../components/GachaponMachineAnimation";

// Enable Three.js built-in cache
THREE.Cache.enabled = true;

// Define file type from backend
export type File = {
  url: string;
  fileType: string;
};

export default function OpenCapsule() {
  const location = useLocation() as { state: { skipAnimation?: boolean } };
  const [loading, setLoading] = useState(true);
  const [showCanvas, setShowCanvas] = useState<boolean>(
    () => !!location.state?.skipAnimation
  );

  useEffect(() => {
    if (!location.state?.skipAnimation) {
      const timer = setTimeout(() => setShowCanvas(true), 9000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const capsuleId = localStorage.getItem("capsuleId") || "";
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/api/files/get/${capsuleId}`);
        const data = await res.json();
        setFiles(data.files || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (capsuleId) fetchFiles();
  }, [backendUrl, capsuleId]);

  const params = useControls({
    rows: { value: 5, min: 1, max: 20, step: 1 },
    cols: { value: 5, min: 1, max: 20, step: 1 },
    curvature: { value: 5, min: 0, max: 20, step: 0.1 },
    spacing: { value: 12, min: 0, max: 50, step: 0.1 },
    imageWidth: { value: 10, min: 1, max: 20, step: 0.1 },
    imageHeight: { value: 6, min: 1, max: 20, step: 0.1 },
    depth: { value: 7.5, min: 0, max: 50, step: 0.1 },
    elevation: { value: 0, min: -10, max: 10, step: 0.1 },
    lookAtRange: { value: 14, min: 1, max: 100, step: 1 },
    verticalCurvature: { value: 0.5, min: 0, max: 5, step: 0.1 },
  });

  // derive data array from backend files
  const data = useMemo(() => files.map((f) => ({ name: f.url })), [files]);

  return (
    <>
      <Leva collapsed />
      <div className="relative h-screen w-screen flex flex-col items-center justify-center font-poppins text-center">
        <GradientBackground />
        <BackButton />

        <div className="w-screen h-screen flex items-center justify-center">
          {showCanvas ? (
            loading ? (
              <div className="text-white text-2xl">Loading files...</div>
            ) : data.length > 0 ? (
              <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 40]} />
                <OrbitControls />
                <Gallery data={data} params={params} />
              </Canvas>
            ) : (
              <div className="text-white text-lg">No images found.</div>
            )
          ) : (
            <GachaponMachineAnimation animation="open" />
          )}
        </div>
      </div>
    </>
  );
}

// Math helpers unchanged
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
  const navigate = useNavigate();
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const lookAtTarget = useRef(new THREE.Vector3());
  const refs = useRef<THREE.Mesh[]>([]);
  refs.current = [];
  const addRef = (r: THREE.Mesh) => r && refs.current.push(r);

  // preload all textures and cache them, drei handles automatically
  const textures = useTexture(data.map((d: any) => d.name));

  const planeMeta = useMemo(() => {
    const list: any[] = [];
    for (let row = 0; row < params.rows; row++) {
      for (let col = 0; col < params.cols; col++) {
        const textureArray = Object.values(textures);
        const idx = (row * params.cols + col) % textureArray.length;
        const texture = Object.values(textures)[idx];
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
  }, [textures, params]);

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

  return planeMeta.map((m) => (
    <mesh
      key={m.key}
      ref={addRef}
      position={[m.basePos.x, m.basePos.y, m.basePos.z]}
      rotation={[m.baseRot.x, m.baseRot.y, m.baseRot.z]}
      onClick={() =>
        navigate("/gallery", { state: { imageUrl: m.texture.image.src } })
      }
      onPointerOver={(e) => (document.body.style.cursor = "pointer")}
      onPointerOut={(e) => (document.body.style.cursor = "default")}
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
