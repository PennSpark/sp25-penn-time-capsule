import BackButton from "../components/BackButton";
import GradientBackground from "../components/GradientBackground";
import { useState, useEffect } from "react";
import { Calendar, Grid, ImageIcon, Plus, Code2 } from "lucide-react";
import GachaponMachineIdle from "../components/GachaponMachineIdle";

type file = {
  url: String;
  fileType: String;
};

export default function OpenCapsule() {
  const capsuleId: String = localStorage.getItem("capsuleId") || "";
  const [files, setFiles] = useState<file[]>([]);
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
  const [capsuleOpened, setCapsuleOpened] = useState<boolean>(false);
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/files/get/${capsuleId}`);
        const data = await res.json();
        setFiles(data.files);
        console.log(data.files);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFiles();
  }, []);
  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-start font-poppins text-center py-20">
      <GradientBackground />
      <BackButton />
      {capsuleOpened ? (
        <>
          {/* When capsuleOpened is true, render something or nothing as needed */}
        </>
      ) : (
        <>
          {/* Combined header and machine container */}
          <div className="absolute top-32 left-0 right-0 z-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 mx-5">
              Spark
            </h1>

            <div className="flex items-center justify-center text-white/80 mb-4">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-lg md:text-2xl">
                {new Date(
                  localStorage.getItem("capsuleDate") || ""
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
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
