import { useGLTF } from "@react-three/drei"
import { Suspense } from "react"

function GachaponMachineModel() {
  const Machine = () => {
    const machine = useGLTF("/gachapon-machine.glb")
    return <primitive object={machine.scene} scale={20.0} />
  }

  return (
    <>
      <directionalLight position={[1, 1, 2]} intensity={1.0}></directionalLight>
      <ambientLight />
      <Suspense fallback={null}>
        <Machine />
      </Suspense>
    </>
  )
}

export default GachaponMachineModel

