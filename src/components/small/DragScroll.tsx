import React, { useRef, MouseEvent } from "react"

interface DragScrollProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const DragScroll: React.FC<DragScrollProps> = (props) => {
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const isDownRef = useRef(false)
  const startXRef = useRef<number | null>(null)
  const scrollLeftRef = useRef(0)

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    isDownRef.current = true
    if (sliderRef.current) {
      document.body.classList.add('hover:cursor-grabbing')
      startXRef.current = e.pageX - sliderRef.current.offsetLeft
      scrollLeftRef.current = sliderRef.current.scrollLeft
    }
  }

  const handleMouseLeave = () => {
    isDownRef.current = false
    if (sliderRef.current) {
      document.body.classList.remove('hover:cursor-grabbing')
    }
  }

  const handleMouseUp = () => {
    isDownRef.current = false
    if (sliderRef.current) {
      document.body.classList.remove('hover:cursor-grabbing')
    }
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDownRef.current || !sliderRef.current) return
    e.preventDefault()
    const x = e.pageX - sliderRef.current.offsetLeft
    const walk = (x - (startXRef.current as number))
    sliderRef.current.scrollLeft = (scrollLeftRef.current as number) - walk
  }

  return (
    <div
      ref={sliderRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {props.children}
    </div>
  )
}

export default DragScroll