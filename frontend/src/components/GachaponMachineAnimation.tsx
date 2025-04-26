// components/GachaponMachine.tsx
import React, { useState, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import { AnimationType, SCENE_URLS } from "../helpers/SplineScenes";
import { useGachaStyle } from "../helpers/useGachaStyle";
import LoadingScreen from "./LoadingScreen";

interface Props {
  capsuleId?: string;
  animation: AnimationType;
  styles?: React.CSSProperties;
  onLoadComplete?: () => void;
}

export default function GachaponMachineAnimation({
  capsuleId,
  animation,
  styles,
  onLoadComplete,
}: Props) {
  const { style } = useGachaStyle(capsuleId);
  const scene = SCENE_URLS[animation][style];
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  
  // This function will be called when the Spline scene is loaded
  const handleLoad = () => {
    setIsLoading(false);
    if (onLoadComplete) onLoadComplete();


  };
  
  // Simulate progress (Spline doesn't provide actual progress events)
  useEffect(() => {
    if (!isLoading) return;
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 100) {
        progress = 100;
        clearInterval(interval);
      }
      setLoadProgress(Math.floor(progress));
    }, 200);
    
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <>
      {isLoading && <LoadingScreen progress={loadProgress} />}
      <Spline 
        scene={scene} 
        style={styles} 
        onLoad={handleLoad}
      />
    </>
  );
}