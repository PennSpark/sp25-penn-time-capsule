import { Style } from "./useGachaStyle";

export type AnimationType = "idle" | "open" | "upload" | "inspect";

export const SCENE_URLS: Record<AnimationType, Record<Style, string>> = {
  idle: {
    blue: "https://prod.spline.design/AyreJIDcpSswIRPT/scene.splinecode",
    green: "https://prod.spline.design/kbKnyDaR3wQXtK0m/scene.splinecode",
    glass: "https://prod.spline.design/KeaD3zdSYK6Qqcgu/scene.splinecode",
    toon: "https://prod.spline.design/zYp8kpvE3Hvz6mgq/scene.splinecode",
    rainbow: "https://prod.spline.design/kuq3EArjex62WwKE/scene.splinecode",
  },
  open: {
    blue: "https://prod.spline.design/ae-GyfMlqB4xVQ3d/scene.splinecode",
    green: "https://prod.spline.design/yKQujx0fD8hHo1eJ/scene.splinecode",
    glass: "https://prod.spline.design/juCsiM6wmhmXRppY/scene.splinecode",
    toon: "https://prod.spline.design/c-yUhdrfEtDhvc4P/scene.splinecode",
    rainbow: "https://prod.spline.design/yDb4Bfx2S-Xws39o/scene.splinecode",
  },
  upload: {
    blue: "https://prod.spline.design/Tn3n9jhHB9RdLg37/scene.splinecode",
    green: "https://prod.spline.design/NI4pjEz2E69VMmsA/scene.splinecode",
    glass: "https://prod.spline.design/nuFy6tNzqGUeGDYL/scene.splinecode",
    toon: "https://prod.spline.design/WO3ByhIu4gfPHKA0/scene.splinecode",
    rainbow: "https://prod.spline.design/MHtIoLawrjo3uVt0/scene.splinecode",
  },
  inspect: {
    blue: "https://prod.spline.design/CVxexPX5eKdZt2wc/scene.splinecode",
    green: "https://prod.spline.design/jqVl9MNpK1KzrYuk/scene.splinecode",
    glass: "https://prod.spline.design/th12BFpA6CB36VeU/scene.splinecode",
    toon: "https://prod.spline.design/vaBZbiAgfK-4Ze8a/scene.splinecode",
    rainbow: "https://prod.spline.design/2DPP91gB5wOYoos2/scene.splinecode",
  },
};
