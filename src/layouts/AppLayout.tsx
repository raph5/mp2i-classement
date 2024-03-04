import type React from "react";
import { Button, Link, Navbar, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@nextui-org/react"
import { signOut } from "firebase/auth";
import { auth } from "../firebase/auth";
import { useState } from "react";

interface AppLayoutProps {
  children?: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {

  const [ isMenuOpen, setIsMenuOpen ] = useState(false);

  return (
    <main className="dark text-foreground bg-background h-full flex flex-col">
      <Navbar disableAnimation isBordered isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent>
          <NavbarMenuToggle
          />
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <Button as={Link} color="primary" href="/#/app/grade-form" variant="flat" onClick={() => setIsMenuOpen(false)}>
              Ajouter une note
            </Button>
          </NavbarItem>
        </NavbarContent>
        
        <NavbarMenu>
          <NavbarMenuItem>
            <Link color="foreground" className="w-full" href="/#/app" size="lg" onClick={() => setIsMenuOpen(false)}>Classement par matière</Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link color="foreground" className="w-full" href="/#/app/test-ranking" size="lg" onClick={() => setIsMenuOpen(false)}>Classement par devoir</Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link color="foreground" className="w-full" href="/#/app/profile" size="lg" onClick={() => setIsMenuOpen(false)}>Profile</Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <button className="text-danger" onClick={() => {signOut(auth); setIsMenuOpen(false)}}>Se déconecter</button>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>

      <div className="px-2 py-4 h-full flex flex-col">
        {children}
      </div>
    </main>
  )
}

export default AppLayout