"use client"

import { useEffect, useRef } from "react"

const GradientBackground = () => {
  const interBubbleRef = useRef<HTMLDivElement>(null)
  const noiseCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Interactive bubble logic
    let curX = 0
    let curY = 0
    let tgX = 0
    let tgY = 0

    const move = () => {
      if (interBubbleRef.current) {
        curX += (tgX - curX) / 20
        curY += (tgY - curY) / 20
        interBubbleRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`
      }
      requestAnimationFrame(move)
    }

    const handleMouseMove = (event: MouseEvent) => {
      tgX = event.clientX
      tgY = event.clientY
    }

    window.addEventListener("mousemove", handleMouseMove)
    move()

    // Generate static noise on the canvas once
    const canvas = noiseCanvasRef.current
    if (canvas) {
      // Set canvas dimensions to fill the background
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        const imageData = ctx.createImageData(canvas.width, canvas.height)
        const buffer = imageData.data
        // Fill each pixel with a random gray value; use low alpha for subtlety
        for (let i = 0; i < buffer.length; i += 4) {
          const shade = Math.floor(Math.random() * 256)
          buffer[i] = shade       // red
          buffer[i + 1] = shade   // green
          buffer[i + 2] = shade   // blue
          buffer[i + 3] = 35      // alpha (transparency)
        }
        ctx.putImageData(imageData, 0, 0)
      }
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    // Set position absolute with a negative z-index to push the background to the back.
    <div
      className="gradient-bg"
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1 }}
    >
      {/* Noise canvas as part of the background (not an overlay) */}
      <canvas
        ref={noiseCanvasRef}
        className="noise-canvas"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <svg style={{ position: "absolute", width: "100%", height: "100%" }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className="gradients-container" style={{ position: "relative", zIndex: 1 }}>
        <div className="g1"></div>
        <div className="g2"></div>
        <div className="g3"></div>
        <div className="g4"></div>
        <div className="g5"></div>
        <div className="interactive" ref={interBubbleRef}></div>
      </div>
    </div>
  )
}

export default GradientBackground