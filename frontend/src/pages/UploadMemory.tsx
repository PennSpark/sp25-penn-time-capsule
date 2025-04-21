import BackButton from "../components/BackButton";
import GradientBackground from "../components/GradientBackground";

export default function UploadMemory() {
  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-center font-poppins text-center py-20">
      <GradientBackground />

      {/* Back button */}
      <BackButton />

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 mx-5">
        Upload Memory Here
      </h1>
      <h4 className="text-xl sm:text-2xl text-white/60 mb-5 mx-5">
        Choose a name for your capsule and an opening date!
      </h4>
    </div>
  );
}
