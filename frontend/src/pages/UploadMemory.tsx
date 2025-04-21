import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import BackButton from "../components/BackButton";
import GradientBackground from "../components/GradientBackground";

export default function UploadMemory() {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleSubmit = () => {
    // TODO: replace with your upload logic
    console.log("Uploading files:", files);
  };

  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-center font-poppins text-center py-20">
      <GradientBackground />
      <BackButton />

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 mx-5">
        Fill the capsule
      </h1>
      <h4 className="text-xl sm:text-2xl text-white/60 mb-5 mx-5">
        Add any memories that capture your story and favorite moments.
      </h4>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className="w-[80%] max-w-2xl border-4 h-5/8 glass-background border-white/30 hover:border-white/70 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
      >
        <input {...getInputProps()} multiple />
        <Upload size={64} className="text-white mb-4" />
        <p className="text-white/80 text-lg">
          {isDragActive
            ? "Drop your files here…"
            : "Click or drag to upload files"}
        </p>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={files.length === 0}
        className={`w-[80%] max-w-2xl glass-background hover:brightness-125 text-white text-xl
                    rounded-2xl py-4 mt-6 font-semibold transition duration-300
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
  );
}
