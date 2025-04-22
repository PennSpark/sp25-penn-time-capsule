// components/DeleteButton.tsx
import { Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

type DeleteButtonProps = {
  capsuleId: string;
  token: string; // assuming you're passing in the JWT token for auth
};

export default function DeleteButton({ capsuleId, token }: DeleteButtonProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleDeleteCapsule = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/timecapsule/leave/${capsuleId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to leave/delete capsule");
      }

      const data = await res.json();
      console.log(data.message); // optional: display a toast or alert here

      handleBack();
    } catch (err) {
      console.error(err);
      alert("Something went wrong while trying to delete/leave the capsule.");
    } finally {
      setLoading(false);
    }
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
      disabled={loading}
      className={`absolute top-5 right-5 z-20 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-red-400 cursor-pointer transition duration-300 ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <Trash className="h-6 w-6 text-white" />
    </button>
  );
}
