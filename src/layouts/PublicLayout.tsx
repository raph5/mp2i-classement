import type React from "react"

interface PublicLayoutProps {
  children?: React.ReactNode
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {

  return (
    <main className="dark text-foreground bg-background min-h-screen">
      {children}
    </main>
  )
}

export default PublicLayout