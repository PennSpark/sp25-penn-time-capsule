import BackButton from "../components/BackButton";
import GradientBackground from "../components/GradientBackground";

export default function OpenCapsule() {
  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-center font-poppins text-center py-20">
      <GradientBackground />

      {/* Back button */}
      <BackButton />

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 mx-5">
        Open Capsule
      </h1>
    </div>
  );
}
