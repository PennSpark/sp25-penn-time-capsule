// components/ChangeStyleButton.tsx
import { Wand2 } from "lucide-react";
import { useGachaStyle } from "../helpers/useGachaStyle";

interface Props {
  capsuleId?: string;
}

export default function ChangeStyleButton({ capsuleId }: Props) {
  const { style, nextStyle } = useGachaStyle(capsuleId);

  return (
    <button
      title={`Style: ${style}`}
      className="absolute z-10 cursor-pointer bottom-16 right-8 bg-white/20 backdrop-blur-md rounded-full p-4 shadow-lg hover:brightness-125 transition duration-300"
      onClick={nextStyle}
    >
      <Wand2 className="h-8 w-8 text-white" />
    </button>
  );
}
