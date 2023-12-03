import type React from "react";
import PublicLayout from "../layouts/PublicLayout";
import {Button, Input, Link} from "@nextui-org/react";
import { useState } from 'react';
import { useAuth } from "../hooks/useAuth"

const SignupPage: React.FC = () => {

  const { signUp } = useAuth();

  // form content
  const [email, _setEmail] = useState('');
  const [pwd, _setPwd] = useState('');
  function setEmail(val: string) {
    if(emailError) setEmailError('')
    if(pwdError) setPwdError('')
    _setEmail(val)
  }
  function setPwd(val: string) {
    if(emailError) setEmailError('')
    if(pwdError) setPwdError('')
    _setPwd(val)
  }

  // from errors
  const [emailError, setEmailError] = useState('');
  const [pwdError, setPwdError] = useState('');
  
  // is form loading
  const [loading, setLoading] = useState(false);
  
  // password visibility
  const [pwdVisible, setPwdVisible] = useState(false);
  const togglePwdVisibility = () => setPwdVisible(!pwdVisible);

  async function signUpBtn() {
    setLoading(true)
    
    try {
      await signUp(email, pwd)
    } catch(error) {
      console.log(error)
      setEmailError("email ou mot de passe invalide")
      setPwdError("email ou mot de passe invalide")
    }

    setLoading(false)
  }

  return (
    <PublicLayout>
      <section className="min-h-screen px-6 py-14 flex flex-col">
        <h1 className="text-3xl font-medium mb-10">Inscription</h1>

        <div className="flex flex-col gap-2">
          <Input
            type="email"
            label="Email"
            value={email}
            onValueChange={setEmail}
            isInvalid={emailError != ''}
            errorMessage={emailError} />

          <Input
            type={pwdVisible ? "text" : "password"}
            label="Mot de passe"
            value={pwd}
            onValueChange={setPwd}
            isInvalid={pwdError != ''}
            errorMessage={pwdError}
            endContent={
              <button className="focus:outline-none" type="button" onClick={togglePwdVisibility}>
                {pwdVisible ? (
                  <span className="material-symbols-rounded block text-1xl text-default-400 pointer-events-none">visibility</span>
                ) : (
                  <span className="material-symbols-rounded block text-1xl text-default-400 pointer-events-none">visibility_off</span>
                )}
              </button>
            } />

          <Button
            className="mt-4"
            color="primary"
            isLoading={loading}
            onClick={signUpBtn}
          >S'inscrire</Button>
        </div>

        <p className="mt-auto">
          Si vous avez déjà un compte ? <Link href="/#/login">connectez vous</Link>
        </p>
      </section>
    </PublicLayout>
  )
}

export default SignupPage