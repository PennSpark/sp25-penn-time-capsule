import { useState, useRef, useEffect } from "react";
import { Calendar, Grid, ImageIcon, Plus, Code2 } from "lucide-react";
import GradientBackground from "../components/GradientBackground";
import { useNavigate } from "react-router";
import JoinCapsuleModal from "../components/JoinCapsuleModal";
import MachineCodeModal from "../components/MachineCodeModal";
import InfoButton from "../components/InfoButton";
import OpenButton from "../components/OpenButton";
import { motion } from "framer-motion";
import GachaponMachineAnimation from "../components/GachaponMachineAnimation";

type TimeCapsule = {
  _id: string;
  name: string;
  date: string;
  files: { url: string; fileType: string }[];
};

function Dashboard() {
  const [viewMode, setViewMode] = useState<"swipe" | "grid">("swipe");
  const [capsules, setCapsules] = useState<TimeCapsule[]>([
    {
      _id: "defaultid",
      name: "No Memories Found!",
      date: "date",
      files: [],
    },
  ]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const plusButtonRef = useRef<HTMLButtonElement>(null);
  const backend_url: string =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
  const token = localStorage.getItem("token");

  // handle navigation
  const navigate = useNavigate();
  const handleCreateCapsule = () => {
    navigate("/create");
  };

  const handleEditCapsule = () => {
    const capsuleId = capsules[currentIndex]._id;
    const capsuleName = capsules[currentIndex].name;
    const capsuleDate = capsules[currentIndex].date;
    localStorage.setItem("capsuleId", capsuleId);
    localStorage.setItem("capsuleName", capsuleName);
    localStorage.setItem("capsuleDate", capsuleDate);
    navigate("/edit");
  };

  const handleUploadMemory = () => {
    navigate("/upload");
  };

  const handleCustomizeCapsule = () => {
    navigate("/customize");
  };

  const handleOpenCapsule = () => {
    const capsuleId = capsules[currentIndex]._id;
    localStorage.setItem("capsuleId", capsuleId);
    navigate("/open");
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // fetch all capsules on mount
  useEffect(() => {
    fetch(`${backend_url}/api/timecapsule/get`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setCapsules(data);
        }
        setCurrentIndex(0);
      })
      .catch((err) => console.error(err));
  }, []);
  // Toggle menu with the plus button
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Handle swipe navigation
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % capsules.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + capsules.length) % capsules.length);
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

  // display capsule opening button
  const isCapsuleOpenable = (date: string) => {
    const capsuleDateObj = new Date(date);
    // if dateStr is missing or invalid, bail out
    if (!date || isNaN(capsuleDateObj.getTime())) return false;

    const today = new Date().toISOString().split("T")[0];
    const capsuleDate = capsuleDateObj.toISOString().split("T")[0];
    return today === capsuleDate;
  };

  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const handleOpenJoinModal = () => setJoinModalOpen(true);
  const handleCloseJoinModal = () => setJoinModalOpen(false);

  const handleJoin = (code: string) => {
    //TODO call api to join capsule
    setJoinModalOpen(false);
  };

  const [machineCodeModalOpen, setMachineCodeModalOpen] = useState(false);
  const handleOpenMachineCodeModal = () => setMachineCodeModalOpen(true);
  const handleCloseMachineCodeModal = () => setMachineCodeModalOpen(false);
  const handleCopyCode = () => {
    navigator.clipboard
      .writeText(capsules[currentIndex]._id)
      .then(() => {
        console.log("Capsule ID copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy capsule ID: ", err);
      });
  };

  return (
    <>
      <div className="relative h-screen w-screen overflow-hidden font-poppins">
        {/* Gradient Background */}
        <GradientBackground />

        {/* View Toggle */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-10 scale-125">
          <div className="relative inline-flex isolate items-center bg-white/30 backdrop-blur-md rounded-full p-0">
            {/* sliding white pill */}
            <motion.div
              className="absolute top-0 left-0 h-full w-1/2 bg-white rounded-full -z-10"
              animate={{ x: viewMode === "swipe" ? 0 : "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />

            {/* Swipe button */}
            <button
              className="relative cursor-pointer z-10 w-1/2 p-3 flex items-center justify-center rounded-full"
              onClick={() => setViewMode("swipe")}
            >
              <ImageIcon
                className={`h-5 w-5 transition-colors duration-300 ${
                  viewMode === "swipe" ? "text-gray-700" : "text-white"
                }`}
              />
            </button>

            {/* Grid button */}
            <button
              className="relative cursor-pointer z-10 w-1/2 p-3 flex items-center justify-center rounded-full"
              onClick={() => setViewMode("grid")}
            >
              <Grid
                className={`h-5 w-5 transition-colors duration-300 ${
                  viewMode === "grid" ? "text-gray-700" : "text-white"
                }`}
              />
            </button>
          </div>
        </div>

        {viewMode === "swipe" ? (
          <div className="relative h-full w-full">
            {/* Swipe View */}
            <div className="absolute top-30 left-0 right-0 text-center z-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 break-words">
                {capsules[currentIndex].name}
                <button
                  onClick={handleOpenMachineCodeModal}
                  title="Show Machine Code"
                  className="inline p-1.5 align-baseline ml-2 hover:bg-white/30 rounded-full transition duration-300"
                  style={{ lineHeight: 0 }}
                >
                  <Code2 className="inline h-7 w-7 cursor-pointer text-white align-baseline" />
                </button>
              </h1>

              <div className="flex items-center justify-center text-white/80 mb-12">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-lg md:text-2xl">
                  {new Date(capsules[currentIndex].date).toLocaleDateString(
                    "en-US",
                    {
                      timeZone: "UTC",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
            </div>

            {/* 3D Canvas */}
            <div className="absolute inset-0 flex items-center justify-center mt-8 md:mt-12">
              <GachaponMachineAnimation
                animation="idle"
                capsuleId={capsules[currentIndex]._id}
              />
            </div>

            {/* Swipe Navigation */}
            <div
              className="absolute left-0 top-0 h-full w-1/4 z-10 "
              onClick={handlePrev}
            />
            <div
              className="absolute right-0 top-0 h-full w-1/4 z-10 "
              onClick={handleNext}
            />

            {/* Pagination Dots */}

            <div
              className={`absolute bottom-32 items-center left-1/2 transform -translate-x-1/2 z-10 flex space-x-3`}
            >
              {capsules.map((_, index) => (
                <div
                  key={index}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentIndex
                      ? "h-6 w-6 bg-white"
                      : "h-3 w-3 bg-white/40"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>

            {/* Capsule Opening Button */}
            {isCapsuleOpenable(capsules[currentIndex].date) && (
              <OpenButton onClick={handleOpenCapsule} />
            )}

            {/* Plus Button */}
            <button
              title="Add"
              ref={plusButtonRef}
              className={`absolute z-10 bg-white/20 backdrop-blur-md rounded-full p-4 shadow-lg cursor-pointer hover:brightness-125 transition-all duration-300 ${
                !isCapsuleOpenable(capsules[currentIndex].date)
                  ? "bottom-16 right-8"
                  : "top-6 right-8"
              }`}
              onClick={toggleMenu}
            >
              <Plus className="h-8 w-8 text-white" />
            </button>

            {/* Translucent Menu */}
            {menuOpen && (
              <div
                title="Menu"
                className={`absolute z-20 menu-container right-8 ${
                  !isCapsuleOpenable(capsules[currentIndex].date)
                    ? "bottom-36"
                    : "top-28"
                }`}
              >
                <div className="glass-background rounded-lg w-fit overflow-hidden">
                  <div className="flex flex-col">
                    <button
                      className="py-3 px-6 text-white text-lg text-left cursor-pointer border-b border-white/10 hover:bg-white/10"
                      onClick={handleUploadMemory}
                    >
                      Upload Memory
                    </button>
                    <button
                      className="py-3 px-6 text-white text-lg text-left cursor-pointer border-b border-white/10 hover:bg-white/10"
                      onClick={handleCreateCapsule}
                    >
                      New Capsule
                    </button>
                    <button
                      className="py-3 px-6 text-white text-lg text-left cursor-pointer border-b border-white/10 hover:bg-white/10"
                      onClick={handleEditCapsule}
                    >
                      Edit Capsule
                    </button>
                    <button
                      className="py-3 px-6 text-white text-lg text-left cursor-pointer border-b border-white/10 hover:bg-white/10"
                      onClick={handleCustomizeCapsule}
                    >
                      Customize
                    </button>
                    <button
                      className="py-3 px-6 text-white text-lg text-left cursor-pointer border-b border-white/10 hover:bg-white/10"
                      onClick={handleOpenJoinModal}
                    >
                      Join Existing
                    </button>
                    <button
                      className="py-3 px-6 text-red-300 text-lg text-left cursor-pointer hover:bg-white/10"
                      onClick={handleLogOut}
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Grid View */
          <div className="absolute top-32 left-0 right-0 bottom-0 overflow-y-auto px-4 pb-4 z-10 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 py-10 gap-4 md:gap-8 text-center">
              {capsules.map((machine, index) => (
                <div
                  key={machine._id}
                  onClick={() => {
                    setCurrentIndex(index);
                    setViewMode("swipe");
                  }}
                  className={`${
                    isCapsuleOpenable(machine.date)
                      ? "glass-golden pulse"
                      : "glass-background"
                  } rounded-xl py-8 flex flex-col items-center border-2 border-white/30 hover:border-white/60 transition duration-300 cursor-pointer`}
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
      {/* External Modals */}
      <JoinCapsuleModal
        isOpen={joinModalOpen}
        onClose={handleCloseJoinModal}
        onJoin={handleJoin}
      />
      <MachineCodeModal
        code={capsules[currentIndex]._id}
        isOpen={machineCodeModalOpen}
        onClose={handleCloseMachineCodeModal}
        onCopy={handleCopyCode}
      />
      <InfoButton />
    </>
  );
}

export default Dashboard;
