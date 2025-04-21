import { useState, useRef, useEffect } from "react";
import { Calendar, Grid, ImageIcon, Plus } from "lucide-react";
import GradientBackground from "../components/GradientBackground";
import GachaponMachineIdle from "../components/GachaponMachineIdle";
import GachaponMachineOpen from "../components/GachaponMachineOpen";
import GachaponBallsFalling from "../components/GachaponBallsFalling";
import GachaponMachineUploadMemory from "../components/GachaponMachineUploadMemory";
import { useNavigate } from "react-router";

type TimeCapsule = {
  _id: string;
  name: string;
  date: string;
  files: { url: string; fileType: string }[];
};

// Sample data for machines
const machines = [
  { id: 1, name: "Spark", date: "August 15, 2025" },
  { id: 2, name: "me + friends", date: "September 21, 2023" },
  { id: 3, name: "Spring 2025", date: "March 20, 2025" },
  { id: 4, name: "Retreat", date: "July 10, 2025" },
  { id: 5, name: "Personal", date: "January 5, 2025" },
  { id: 6, name: "Halloween", date: "October 31, 2025" },
];

function Dashboard() {
  const [viewMode, setViewMode] = useState<"swipe" | "grid">("swipe");
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const plusButtonRef = useRef<HTMLButtonElement>(null);

  // handle navigation
  const navigate = useNavigate();
  const handleCreateCapsule = () => {
    navigate("/create");
  };
  const handleUploadMemory = () => {
    navigate("/upload");
  };
  const handleOpenCapsule = () => {
    navigate("/open");
  };

  // Toggle menu with the plus button
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle swipe navigation
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % machines.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + machines.length) % machines.length);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuOpen &&
        plusButtonRef.current &&
        !plusButtonRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".menu-container")
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="relative h-screen w-screen overflow-hidden font-poppins">
      {/* Gradient Background */}
      <GradientBackground />

      {/* View Toggle */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center bg-white/30 backdrop-blur-md rounded-full p-1">
          <button
            className={`p-3 rounded-full ${
              viewMode === "swipe" ? "bg-white" : "bg-transparent"
            }`}
            onClick={() => setViewMode("swipe")}
          >
            <ImageIcon
              className={`h-5 w-5 ${
                viewMode === "swipe" ? "text-gray-700" : "text-white"
              }`}
            />
          </button>
          <button
            className={`p-3 rounded-full ${
              viewMode === "grid" ? "bg-white" : "bg-transparent"
            }`}
            onClick={() => setViewMode("grid")}
          >
            <Grid
              className={`h-5 w-5 ${
                viewMode === "grid" ? "text-gray-700" : "text-white"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Add Button (only in grid view) */}
      {viewMode === "grid" && (
        <button
          title="add "
          className="absolute top-12 right-8 z-10 bg-white/30 backdrop-blur-md rounded-full p-3"
        >
          <Plus className="h-5 w-5 text-white" />
        </button>
      )}

      {viewMode === "swipe" ? (
        <div className="relative h-full w-full">
          {/* Swipe View */}
          <div className="absolute top-32 left-0 right-0 text-center z-10 pointer-events-none">
            <h1 className="text-5xl font-bold text-white mb-2">
              {machines[currentIndex].name}
            </h1>
            <div className="flex items-center justify-center text-white/80 mb-12">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">{machines[currentIndex].date}</span>
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="absolute inset-0 flex items-center justify-center mt-16">
            <GachaponMachineOpen />
          </div>

          {/* Swipe Navigation */}
          <div
            className="absolute left-0 top-0 h-full w-1/4 z-10 cursor-w-resize"
            onClick={handlePrev}
          />
          <div
            className="absolute right-0 top-0 h-full w-1/4 z-10 cursor-e-resize"
            onClick={handleNext}
          />

          {/* Pagination Dots */}
          <div className="absolute bottom-24 items-center left-1/2 transform -translate-x-1/2 z-10 flex space-x-3">
            {machines.map((_, index) => (
              <div
                key={index}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "h-6 w-6 bg-white"
                    : "h-3 w-3 bg-white/40"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>

          {/* Plus Button */}
          <button
            title="Add"
            ref={plusButtonRef}
            className="absolute bottom-16 right-8 z-10 bg-white/20 backdrop-blur-md rounded-full p-4 shadow-lg"
            onClick={toggleMenu}
          >
            <Plus className="h-8 w-8 text-white" />
          </button>

          {/* Translucent Menu */}
          {menuOpen && (
            <div
              title="Menu"
              className="absolute z-20 menu-container"
              style={{
                bottom: "140px",
                right: "32px",
              }}
            >
              <div className="bg-white/20 backdrop-blur-md rounded-lg w-48 overflow-hidden">
                <div className="flex flex-col">
                  <button
                    className="py-3 px-6 text-white text-lg text-left border-b border-white/10 hover:bg-white/10"
                    onClick={handleUploadMemory}
                  >
                    Upload Memory
                  </button>
                  <button
                    className="py-3 px-6 text-white text-lg text-left border-b border-white/10 hover:bg-white/10"
                    onClick={handleCreateCapsule}
                  >
                    New Capsule
                  </button>
                  <button className="py-3 px-6 text-white text-lg text-left border-b border-white/10 hover:bg-white/10">
                    Rename
                  </button>
                  <button className="py-3 px-6 text-white text-lg text-left border-b border-white/10 hover:bg-white/10">
                    Customize
                  </button>
                  <button className="py-3 px-6 text-white text-lg text-left hover:bg-white/10">
                    Share
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Grid View */
        <div className="absolute top-36 left-0 right-0 bottom-0 overflow-y-auto px-4 pb-4 z-10 max-w-4xl align-self-center mx-auto">
          <div className="grid grid-cols-2 gap-4 md:gap-8 md:mx-30">
            {machines.map((machine) => (
              <div
                key={machine.id}
                className="glass-background rounded-xl py-8 flex flex-col items-center border-2 border-white/30 hover:border-white/60 transition duration-300 cursor-pointer"
              >
                <h3 className="text-xl font-medium text-white mb-2">
                  {machine.name}
                </h3>
                <img
                  alt="machine"
                  src="machine_render.png"
                  className="max-h-80"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
