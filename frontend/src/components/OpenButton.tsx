export default function OpenButton({ onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="absolute uppercase saturate-100 w-[80%] max-w-sm text-2xl bottom-14 left-1/2 transform -translate-x-1/2 z-20 glass-golden pulse cursor-pointer hover:brightness-110 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300"
    >
      Open Capsule!
    </button>
  );
}
