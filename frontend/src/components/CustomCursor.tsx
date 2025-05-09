import { useEffect, useState, useRef } from 'react'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const frame = useRef(0)
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorSize = 24 // Cursor diameter
  const hoverRadius = cursorSize / 2 // Radius for hover detection

  // Hide the default cursor when component mounts
  useEffect(() => {
    document.body.style.cursor = 'none'
    
    // Restore default cursor when component unmounts
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [])

  // track mouse position
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  // Check proximity to clickable elements
  useEffect(() => {
    const checkProximity = () => {
      const selector = 'a, button, [role="button"], input[type="button"], input[type="submit"]'
      const clickableElements = document.querySelectorAll(selector)
      
      let hovering = false
      
      clickableElements.forEach(el => {
        const rect = el.getBoundingClientRect()
        
        // Calculate the closest point on the element to the cursor
        const closestX = Math.max(rect.left, Math.min(position.x, rect.right))
        const closestY = Math.max(rect.top, Math.min(position.y, rect.bottom))
        
        // Calculate distance from cursor to the closest point
        const dx = position.x - closestX
        const dy = position.y - closestY
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Check if any part of cursor is touching the element
        if (distance <= hoverRadius) {
          hovering = true
        }
      })
      
      setIsHovering(hovering)
    }
    
    const intervalId = setInterval(checkProximity, 10) 
    
    return () => clearInterval(intervalId)
  }, [position])

  // click/tap effect
  useEffect(() => {
    const down = () => {
      setIsClicking(true)
      setTimeout(() => setIsClicking(false), 80) 
    }
    window.addEventListener('mousedown', down)
    return () => window.removeEventListener('mousedown', down)
  }, [])

  useEffect(() => {
    const render = () => {
      if (cursorRef.current) {
        const { x, y } = position
        
        cursorRef.current.style.transform = `
          translate3d(${x}px, ${y}px, 0)
          scale(${isClicking ? 0.6 : isHovering ? 1.6 : 1})
        `
        
        // cursor style when hovering over clickable elements
        if (isHovering) {
          cursorRef.current.classList.add(styles.hovering)
        } else {
          cursorRef.current.classList.remove(styles.hovering)
        }
      }
      frame.current = requestAnimationFrame(render)
    }
    render()
    return () => cancelAnimationFrame(frame.current)
  }, [position, isHovering, isClicking])

  return <div ref={cursorRef} className={styles.cursor} />
}