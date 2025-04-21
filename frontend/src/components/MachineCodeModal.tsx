import { useRef, useEffect, useState } from "react";
import { Copy, Share2 } from "lucide-react";

type MachineCodeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  onCopy: () => void;
};

export default function MachineCodeModal({
  isOpen,
  onClose,
  code,
  onCopy,
}: MachineCodeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    });
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 font-poppins">
      <div
        ref={modalRef}
        className="glass-background-modal rounded-xl p-6 w-full max-w-sm mx-4"
      >
        <h2 className="text-2xl font-semibold text-white text-center mb-4">
          Machine Code
        </h2>

        <div className="bg-white/20 text-white text-center text-xl font-medium py-3 rounded-lg mb-3">
          {code}
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCopy}
            className={`flex-1 flex gap-2 cursor-pointer items-center justify-center text-xl py-3 rounded-lg transition-all duration-300 ${
              copied
                ? "bg-[#7ad47a] text-white"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <Copy size={20} />
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
