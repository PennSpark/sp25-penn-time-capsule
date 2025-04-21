import { useRef, useState } from "react";
import { Calendar, Pencil } from "lucide-react";
import GradientBackground from "../components/GradientBackground";
import BackButton from "../components/BackButton";

export default function CreateCapsule() {
  const [name, setName] = useState("");
  const [openingDate, setOpeningDate] = useState("");
  const dateInputRef = useRef<HTMLInputElement>(null);

  const onDateRowClick = () => {
    const input = dateInputRef.current!;
    if (typeof input.showPicker === "function") input.showPicker();
    else input.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // submit logic…
  };

  return (
    <div className="relative h-screen w-screen flex flex-col items-center justify-center font-poppins text-center py-20">
      <GradientBackground />

      {/* Back button */}
      <BackButton />

      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 mx-5">
        Create Capsule
      </h1>
      <h4 className="text-xl sm:text-2xl text-white/60 mb-5 mx-5">
        Choose a name for your capsule and an opening date!
      </h4>

      <img
        alt="machine render"
        src="machine_render.png"
        className="h-[40%] md:h-[50%] mb-5"
      />

      <form
        onSubmit={handleSubmit}
        className="z-10 flex flex-col items-center space-y-4 px-4 w-full max-w-sm"
        autoComplete="off"
      >
        {/* Name field */}
        <div className="flex items-center w-full glass-background rounded-xl px-4 py-3">
          <Pencil className="h-5 w-5 text-white/70 mr-3" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="flex-1 bg-transparent outline-none text-white placeholder-white/70 text-lg"
          />
        </div>

        {/* Opening Date field */}
        <div
          onClick={onDateRowClick}
          className="flex items-center w-full glass-background rounded-xl px-4 py-3 cursor-pointer"
        >
          <Calendar className="h-5 w-5 text-white/70 mr-3" />
          <input
            ref={dateInputRef}
            type="date"
            value={openingDate}
            onChange={(e) => setOpeningDate(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white placeholder-white/70 text-lg"
          />
        </div>

        {/* Save button */}
        <button
          type="submit"
          className="w-full glass-background rounded-xl mt-5 py-4 text-lg font-medium text-white hover:brightness-125 cursor-pointer transition-all duration-300"
        >
          Save
        </button>
      </form>
    </div>
  );
}
