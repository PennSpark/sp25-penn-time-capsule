import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import GachaponMachineModel from "../components/GachaponMachineModel";

function Dashboard() {
  return (
    <Canvas
      style={{ height: "100vh", width: "100vw" }}
      camera={{ position: [0, 0, 100], fov: 15 }}
    >
      <OrbitControls />
      <GachaponMachineModel />
      <Environment preset="dawn" background blur={0.5} />
    </Canvas>
  );
}

export default Dashboard;
