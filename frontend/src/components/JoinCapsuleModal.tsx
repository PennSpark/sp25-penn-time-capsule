import { useState, useRef, useEffect } from "react";

type JoinCapsuleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (code: string) => void;
};

export default function JoinCapsuleModal({
  isOpen,
  onClose,
  onJoin,
}: JoinCapsuleModalProps) {
  const [code, setCode] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  // close when clicking outside
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
        <h2 className="text-2xl font-semibold text-white mb-4 text-center">
          Join a machine
        </h2>

        <input
          type="text"
          placeholder="Enter machine code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg bg-white/30 text-lg text-white placeholder-white/85 focus:outline-none"
        />

        <button
          onClick={() => onJoin(code)}
          className="w-full cursor-pointer py-3 rounded-lg bg-white/30 text-lg text-white font-medium hover:bg-white/40 transition"
        >
          Join
        </button>
      </div>
    </div>
  );
}
