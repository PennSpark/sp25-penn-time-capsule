// components/BackButton.tsx
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`absolute top-5 left-5 z-20 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 cursor-pointer transition`}
    >
      <ArrowLeft className="h-6 w-6 text-white" />
    </button>
  );
}
