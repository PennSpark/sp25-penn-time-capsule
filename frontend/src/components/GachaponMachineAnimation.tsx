// components/GachaponMachine.tsx
import Spline from "@splinetool/react-spline";
import { AnimationType, SCENE_URLS } from "../helpers/SplineScenes";
import { useGachaStyle } from "../helpers/useGachaStyle";

interface Props {
  capsuleId?: string;
  animation: AnimationType;
  styles?: React.CSSProperties;
}

export default function GachaponMachineAnimation({
  capsuleId,
  animation,
  styles,
}: Props) {
  const { style } = useGachaStyle(capsuleId);
  const scene = SCENE_URLS[animation][style];

  return <Spline scene={scene} style={styles} />;
}
