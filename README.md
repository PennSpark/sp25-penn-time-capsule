# Capsule 
**_Written By: Shaurya Sarma_**  

## Overview

Capsule is a collaborative web application where users can create and share **interactive 3D time capsules**. These capsules act as digital containers for memories—such as images, videos, and notes—and can be "unlocked" at specific dates, revealing an immersive 3D showcase of the content inside.

**Key Highlights:**
- Capsules can store various media types (images, videos, and notes).
- Real-time updates show capsules being filled as new memories are added.
- When a capsule is opened, memories are revealed in a **3D parallax-style gallery**.
- Inspired by Japanese **gachapon machines**, creating a fun, tactile user experience.

---

## Design

The design philosophy of Capsule was heavily influenced by Japanese gachapon machines, which naturally aligned with the idea of memories being "collected" and "unlocked."

### **Core Design Choices**
- **Gachapon Theme** – Memories are stored in capsule-like 3D objects, while each gachapon machine represents a specific time capsule (e.g., *Penn Class of 2028*).
- **Playful Color Palette** – Bright, clay-like colors were chosen to give the application a whimsical, nostalgic feel.
- **3D Animations** – Built using **Blender** and **Spline**, we created bouncy, immersive animations where:
  - Uploading a memory feels like dropping a capsule into a machine.
  - Opening a time capsule is visualized as dispensing gachapon balls.

**Customization:**  
We experimented with color customization and themes for capsules. Our vision was to allow users to decorate capsules with stickers and widgets on the 3D models, but this was left as a future feature due to time constraints.

---

## Implementation

### **Frontend**
- Built with **React Three Fiber** to seamlessly blend **3D elements** with standard web UI.
- Users can:
  - Register or log in.
  - Create, edit, or join time capsules.
  - Upload memories (photos/videos).
  - Open capsules and explore the 3D timeline of memories.

### **Backend**
- **Media Storage:** All user-uploaded files are stored in **AWS S3**, optimized for fast retrieval during capsule openings.
- **Database:** User accounts, capsule metadata, and access information are stored in **MongoDB** for quick dashboard loading and account management.
- **Interactive Timeline:** When a capsule is opened, media files are displayed in a dynamic 3D scene, allowing users to click and explore them in detail.

---

## Future Extensions

- **Personalized Capsule Decorations:** Stickers, engravings, and color customization directly on 3D models.
- **Social Capsules:** Shared spaces where multiple users can add memories simultaneously.
- **VR Support:** A multiplayer VR version where users can walk around and interact with capsules and memories in real time.

---

## Demo

[![Capsule Demo](https://img.youtube.com/vi/VcS-ikD9YmM/0.jpg)](https://www.youtube.com/embed/VcS-ikD9YmM)
