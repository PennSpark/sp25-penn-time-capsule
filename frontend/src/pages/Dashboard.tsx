import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

function Dashboard() {
  return (
    <Canvas
      style={{ height: "100vh", width: "100vw" }}
      camera={{ position: [0, 0, 100], fov: 15 }}
    >
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[5, 5, 5]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <Environment preset="dawn" background blur={0.5} />
    </Canvas>
  );
}

export default Dashboard;
