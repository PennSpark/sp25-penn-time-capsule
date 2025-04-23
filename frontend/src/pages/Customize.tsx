import GradientBackground from "../components/GradientBackground";
import BackButton from "../components/BackButton";
import ChangeStyleButton from "../components/ChangeStyleButton";
import GachaponMachineAnimation from "../components/GachaponMachineAnimation";

export default function Customize() {
  const capsuleId = localStorage.getItem("capsuleId") || "";
  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-center font-poppins text-center">
      <GradientBackground />

      {/* Utility buttons */}
      <BackButton />
      <ChangeStyleButton capsuleId={capsuleId} />

      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <GachaponMachineAnimation
          animation="inspect"
          capsuleId={capsuleId}
          styles={{ scale: "130%" }}
        />
      </div>
    </div>
  );
}
