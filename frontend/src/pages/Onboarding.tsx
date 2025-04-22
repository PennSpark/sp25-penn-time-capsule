"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import { Calendar, Plus } from "lucide-react";
import GradientBackground from "../components/GradientBackground";
import GachaponBallsFalling from "../components/GachaponBallsFalling";
import GachaponMachineIdle from "../components/GachaponMachineIdle";
import GachaponMachineUploadMemory from "../components/GachaponMachineUploadMemory";

function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  // Handle screen tap to advance
  const handleScreenTap = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      // Navigate to dashboard when onboarding is complete
      navigate("/dashboard");
    }
  };

  return (
    <div
      className="relative h-screen w-screen overflow-hidden font-poppins"
      onClick={handleScreenTap}
    >
      {/* Gradient Background (present on all screens) */}
      <GradientBackground />

      {currentStep === 0 && (
        <>
          {/* 3D balls layer */}
          <div className="absolute inset-0 z-10">
            <GachaponBallsFalling />
          </div>

          {/* text overlay layer */}
          <h1
            className="
          absolute inset-0
          z-20
          flex items-center justify-center
          text-4xl md:text-5xl font-bold
          text-white text-center px-6
          pointer-events-none
        "
          >
            Welcome to Capsule
          </h1>
        </>
      )}

      {/* Intro Screen 1 */}
      {currentStep === 1 && (
        <div className="absolute inset-0 flex flex-col items-center z-20 px-6">
          <div className="absolute top-28 left-0 right-0 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Capsule
            </h1>
            <p className="text-xl text-white/80 mb-12">
              Capture. Collect. Relive.
            </p>
          </div>

          {/* 3D Canvas - same size as dashboard */}
          <div className="absolute inset-0 flex items-center justify-center mt-16 md:mt-20">
            <GachaponMachineIdle />
          </div>

          <div className="absolute bottom-24 left-0 right-0 px-6">
            <p className="text-lg text-white/90 text-center max-w-md mx-auto">
              Store your memories in a capsule machine and open all the memories
              together with friends!
            </p>
          </div>
        </div>
      )}

      {/* Intro Screen 2 */}
      {currentStep === 2 && (
        <div className="absolute inset-0 flex flex-col items-center z-20 px-6">
          <div className="absolute top-28 left-0 right-0 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Capsule
            </h1>
            <p className="text-xl text-white/80 mb-12">
              Capture. Collect. Relive.
            </p>
          </div>

          {/* 3D Canvas - same size as dashboard */}
          <div className="absolute inset-0 flex items-center justify-center">
            <GachaponMachineUploadMemory />
          </div>

          <div className="absolute bottom-22 left-0 right-0 px-6">
            <p className="text-lg text-white/90 text-center max-w-md mx-auto">
              Upload memories from your camera roll and store them in a gachapon
              ball!
            </p>
          </div>
        </div>
      )}

      {/* Dashboard Tutorial - Machines */}
      {currentStep === 3 && (
        <div className="relative h-full w-full">
          {/* View Toggle (non-functional) */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex items-center bg-white/30 backdrop-blur-md rounded-full p-1">
              <button className="p-3 rounded-full bg-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-700"
                >
                  <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                  <path d="M8.5 2v20"></path>
                  <path d="M16 2v20"></path>
                  <path d="M2 8.5h20"></path>
                  <path d="M2 16h20"></path>
                </svg>
              </button>
              <button className="p-3 rounded-full bg-transparent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <path d="M21 15l-5-5L5 21"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Swipe View */}
          <div className="absolute top-28 left-0 right-0 text-center z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 break-words">
              Spark
            </h1>

            <div className="flex items-center justify-center text-white/80 mb-12">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-lg md:text-2xl">March 21, 2025</span>
            </div>
          </div>

          {/* 3D Canvas with highlight box */}
          <div className="absolute inset-0 flex items-center justify-center mt-16 md:mt-20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-2 border-white rounded-xl bg-white/10 w-[400px] h-[60%] animate-pulse"></div>
            </div>
            <GachaponMachineIdle />
          </div>

          {/* Plus “button” – transparent look, not clickable */}
          <div className="absolute bottom-16 right-8 z-20 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Plus className="h-8 w-8 text-white" />
            </div>
          </div>

          <div className="absolute bottom-22 items-center left-1/2 transform -translate-x-1/2 z-10 flex space-x-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`
              rounded-full transition-all
              ${i === 1 ? "h-6 w-6 bg-white" : "h-3 w-3 bg-white/40"}
            `}
              />
            ))}
          </div>

          {/* Info Box - smaller and below model */}
          <div className="absolute bottom-27 right-9/19 transform -translate-x-1/2 -translate-x-4 z-20">
            <div className="glass-background rounded-lg p-3 max-w-[200px]">
              <p className="text-white text-center text-sm">
                Access all your capsules on the main page
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Tutorial - Plus Button */}
      {currentStep === 4 && (
        <div className="relative h-full w-full">
          {/* View Toggle (non-functional) */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex items-center bg-white/30 backdrop-blur-md rounded-full p-1">
              <button className="p-3 rounded-full bg-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-700"
                >
                  <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                  <path d="M8.5 2v20"></path>
                  <path d="M16 2v20"></path>
                  <path d="M2 8.5h20"></path>
                  <path d="M2 16h20"></path>
                </svg>
              </button>
              <button className="p-3 rounded-full bg-transparent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <path d="M21 15l-5-5L5 21"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Swipe View */}
          <div className="absolute top-28 left-0 right-0 text-center z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 break-words">
              Spark
            </h1>

            <div className="flex items-center justify-center text-white/80 mb-12">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-lg md:text-2xl">March 21, 2025</span>
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="absolute inset-0 flex items-center justify-center mt-16 md:mt-20">
            <GachaponMachineIdle />
          </div>

          <div className="absolute bottom-14 right-8 z-20 pointer-events-none">
            {/* square box around the plus */}
            <div className="border-2 border-white bg-white/10 rounded-lg p-2 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Plus className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>

          <div className="absolute bottom-22 items-center left-1/2 transform -translate-x-1/2 z-10 flex space-x-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`
              rounded-full transition-all
              ${i === 1 ? "h-6 w-6 bg-white" : "h-3 w-3 bg-white/40"}
            `}
              />
            ))}
          </div>

          {/* Info Box */}
          <div className="absolute bottom-14 right-32 z-20">
            <div className="glass-background rounded-lg p-3 max-w-[250px]">
              <p className="text-white text-center text-sm">
                Click here for external actions like joining a capsule or
                uploading memories!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Open Capsule Tutorial */}
      {currentStep === 5 && (
        <div className="absolute inset-0 z-20">
          <div className="absolute top-28 left-0 right-0 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              me + friends
            </h1>
          </div>

          {/* 3D Canvas */}
          <div className="absolute inset-0 flex items-center justify-center transform -translate-y-8 mt-16 md:mt-20">
            <GachaponMachineIdle />
          </div>

          <button className="absolute uppercase w-[170px] max-w-sm text-2xl bottom-32 left-1/2 transform -translate-x-1/2 z-20 bg-white/20 backdrop-blur-md cursor-pointer text-white font-semibold px-6 py-2.5 rounded-xl">
            OPEN!
          </button>

          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20">
            <div className="glass-background rounded-lg p-3 max-w-[250px]">
              <p className="text-white text-center text-sm">
                Open all the memories on a pre-selected day with friends
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Final Tutorial Screen */}
      {currentStep === 6 && (
        <div className="absolute inset-0 z-20">
          <div className="absolute top-28 left-0 right-0 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              me + friends
            </h1>
          </div>

          {/* 3D Canvas */}
          <div className="absolute inset-0 flex items-center justify-center transform -translate-y-8 mt-16 md:mt-20">
            <GachaponMachineIdle />
          </div>

          <div className="absolute bottom-15 left-1/2 transform -translate-x-1/2 z-20">
            <div className="glass-background rounded-lg p-3 max-w-[250px]">
              <p className="text-white text-center text-sm">
                Experience and relive the memories via an interactive 3D
                gallery!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tap to continue hint (only on first few screens) */}
      {currentStep < 3 && (
        <div className="absolute bottom-10 left-0 right-0 text-center text-white/70 text-sm animate-pulse z-30">
          Tap to continue
        </div>
      )}
    </div>
  );
}

export default Onboarding;
