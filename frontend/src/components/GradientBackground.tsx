"use client"

import { useEffect, useRef } from "react"

const GradientBackground = () => {
  const interBubbleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className="gradient-bg">
      <svg>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className="gradients-container">
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

