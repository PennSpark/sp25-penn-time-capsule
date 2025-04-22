import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ExitButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/open", { state: { skipAnimation: true } });
  };

  return (
    <button
      onClick={handleBack}
      className="absolute top-5 right-5 z-20 p-2 bg-black backdrop-blur-md rounded-full hover:bg-black/60 cursor-pointer transition"
    >
      <X className="h-6 w-6 text-white" />
    </button>
  );
}
