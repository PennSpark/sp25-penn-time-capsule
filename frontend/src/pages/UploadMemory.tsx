import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import BackButton from "../components/BackButton";
import GradientBackground from "../components/GradientBackground";
import { useNavigate } from "react-router";
import GachaponMachineAnimation from "../components/GachaponMachineAnimation";

export default function UploadMemory() {
  const [files, setFiles] = useState<File[]>([]);
  const [tagline, setTagline] = useState<string>("");
  const [uploadComplete, setUploadComplete] = useState(false);
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleSubmit = async () => {
    setUploadComplete(true);
    console.log("Uploading files:", files);

    try {
      const capsuleId = localStorage.getItem("capsuleId");
      if (!capsuleId) {
        console.error("No capsuleId in localStorage");
        return;
      }

      const token = localStorage.getItem("token");

      if (!capsuleId || !token) {
        console.error("Missing capsule ID or token");
        return;
      }

      for (const file of files) {
        const form = new FormData();
        form.append("file", file); // must match upload.single("file") in backend

        const res = await fetch(`${backendUrl}/api/files/upload/${capsuleId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(
            `Failed to upload ${file.name}:`,
            data.message || "Unknown error"
          );
        } else {
          console.log(`Uploaded ${file.name}:`, data.fileUrl);
        }
      }

      console.log("All files uploaded");
      setTimeout(() => {
        navigate("/dashboard");
      }, 7750); // Redirect after 7 seconds -- make length of animation
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-center font-poppins text-center">
      <GradientBackground />
      <BackButton />

      {uploadComplete ? (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
          <GachaponMachineAnimation animation="upload" />
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 mx-5">
            Fill the capsule
          </h1>
          <h4 className="text-xl sm:text-2xl text-white/60 mb-8 mx-5">
            Add any memories that capture your story and favorite moments.
          </h4>
          <div
            {...getRootProps()}
            className="w-[80%] max-w-2xl border-4 glass-background border-white/30 hover:border-white/70 rounded-2xl p-20 flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
          >
            <input {...getInputProps()} multiple />
            <Upload size={64} className="text-white mb-4" />
            <p className="text-white/80 text-lg">
              {isDragActive
                ? "Drop your files here…"
                : "Click or drag to upload files"}
            </p>
          </div>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            maxLength={30}
            placeholder="Give your memories a name they'll remember."
            className="text-center w-[80%] max-w-2xl glass-background border-4 border-white/30 hover:border-white/70 text-white placeholder-white/70 text-xl
                       rounded-2xl px-4 py-4 mt-4 transition duration-300 outline-none"
          />
          <button
            onClick={handleSubmit}
            disabled={files.length === 0}
            className={`w-[80%] max-w-2xl glass-background hover:brightness-125 text-white text-xl
                    rounded-2xl py-6 mt-10 font-semibold transition duration-300
                    ${
                      files.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "opacity-100 cursor-pointer"
                    }`}
          >
            {files.length === 0
              ? "Select files to upload"
              : `Upload ${files.length} File${files.length > 1 ? "s" : ""}`}
          </button>
        </div>
      )}
    </div>
  );
}
