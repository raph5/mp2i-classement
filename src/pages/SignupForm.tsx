import type React from "react";
import PublicLayout from "../layouts/PublicLayout";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { updateProfile, type User } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignupFormPage: React.FC = () => {

  // hooks
  const { user } = useAuth() as { user: User }
  const navigate = useNavigate()

  // from values
  const [name, _setName] = useState('')
  function setName(val: string) {
    setNameError('')
    _setName(val)
  }

  // form errors
  const [nameError, setNameError] = useState('');
  
  // is form loading
  const [loading, setLoading] = useState(false);

  async function setUserData() {
    setLoading(true)

    try {
      await updateProfile(user, {
        displayName: name
      })
      navigate('/app')
    } catch(error) {
      console.log(error)
      setNameError("nom invalide")
    }

    setLoading(false)
  }

  return (
    <PublicLayout>
      <section className="min-h-screen px-6 py-14 flex flex-col">
        <h1 className="text-3xl font-medium mb-10">Inscription</h1>

        <div className="flex flex-col gap-2">
          <Input
            type="text"
            label="Nom"
            value={name}
            onValueChange={setName}
            isInvalid={nameError != ''}
            errorMessage={nameError} />

          <Button
            className="mt-4"
            color="primary"
            isLoading={loading}
            onClick={setUserData}
          >
            valider
          </Button>
        </div>
      </section>
    </PublicLayout>
  )
}

export default SignupFormPage