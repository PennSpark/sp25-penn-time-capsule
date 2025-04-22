// components/BackButton.tsx
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function InfoButton() {
  const navigate = useNavigate();

  const showOnboarding = () => {
    navigate("/");
  };

  return (
    <button
      onClick={showOnboarding}
      className={`absolute top-5 left-5 z-20 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 cursor-pointer transition`}
    >
      <Info className="h-6 w-6 text-white" />
    </button>
  );
}
