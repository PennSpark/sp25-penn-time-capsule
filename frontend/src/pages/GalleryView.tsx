import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ExitButton from "../components/ExitButton";

export default function GalleryView() {
  const location = useLocation();
  const imageUrl = location.state?.imageUrl;

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-75"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
    >
      <ExitButton />
      {imageUrl && (
        <img src={imageUrl} alt="Selected" className="w-screen h-screen " />
      )}
    </motion.div>
  );
}
