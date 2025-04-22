import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import AuthLayout from "./pages/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { GoogleOAuthProvider } from "@react-oauth/google";
import CreateCapsule from "./pages/CreateCapsule";
import UploadMemory from "./pages/UploadMemory";
import EditCapsule from "./pages/EditCapsule";
import OpenCapsule from "./pages/OpenCapsule";
import Onboarding from "./pages/Onboarding";
import GalleryView from "./pages/GalleryView";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="/create" element={<CreateCapsule />} />
          <Route path="/edit" element={<EditCapsule />} />
          <Route path="/upload" element={<UploadMemory />} />
          <Route path="/open" element={<OpenCapsule />} />
          <Route path="/gallery" element={<GalleryView />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);
