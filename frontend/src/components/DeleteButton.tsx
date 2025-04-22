// components/BackButton.tsx
import { Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DeleteButton() {
  const navigate = useNavigate();

  const handleDeleteCapsule = async () => {
    //TODO logic to delete capsule
    handleBack();
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <button
      onClick={handleDeleteCapsule}
      className={`absolute top-5 right-5 z-20 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-red-400 cursor-pointer transition duration-300`}
    >
      <Trash className="h-6 w-6 text-white" />
    </button>
  );
}
