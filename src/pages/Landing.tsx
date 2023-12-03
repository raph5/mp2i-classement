import type React from 'react'
import { Button } from "@nextui-org/react";
import PublicLayout from '../layouts/PublicLayout';
import googleLogo from '../assets/google.svg'
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LandingPage: React.FC = () => {
  
  const { signInWithGoogle } = useAuth()

  return (
    <PublicLayout>
      <section className="min-h-screen w-full flex items-center flex-col px-6 py-14">
        <h1 className="text-4xl font-bold text-center mb-10">MP2I Lamartin Classement</h1>
        <div className="flex flex-col gap-2 w-full mt-auto">
          <Button color="primary" as={Link} to="/login">
            Connexion
          </Button>
          <Button color="default" onClick={signInWithGoogle} startContent={<img className="w-5" src={googleLogo} alt="google logo" />}>
            Se connecter avec Google
          </Button>
          <Button color="default" variant="bordered" as={Link} to="/signup">
            S'inscrire
          </Button>
        </div>
      </section>
    </PublicLayout>
  )
}

export default LandingPage