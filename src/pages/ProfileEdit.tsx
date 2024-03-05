import { Input, Button, Avatar } from "@nextui-org/react"
import type React from "react"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import ImageButton from "../components/small/ImageButton";
import { useEditUser, useUser } from "../hooks/useUsers";

const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [ user, isUserLoading ] = useUser();
  const editUser = useEditUser();

  // form data
  const [ userName, setUserName ] = useState("");
  const [ photo, setPhoto ] = useState<File>();
  const [ photoPreviewUrl, setPhotoPreviewUrl ] = useState("");

  // form states
  const [ loading, setLoading ] = useState(false);
  const [ success, setSuccess ] = useState(false);

  async function submit() {
    setLoading(true);

    try {
      await editUser({ name: userName, photo: photo });
      setSuccess(true);
      navigate('/app/profile');
    }
    finally {
      setLoading(false);
    }
  }

  function cancel() {
    navigate('/app/profile')
  }

  function updatePhoto(photo: File | undefined) {
    if(!photo) return;
    setPhotoPreviewUrl(URL.createObjectURL(photo));
    setPhoto(photo);
  }

  // set userName input when user data is loaded
  useEffect(() => {
    if(!isUserLoading && user?.name) {
      setUserName(user.name);
    }
  }, [isUserLoading]);

  return (
    <section>
      <h1 className="text-3xl font-medium mb-10">Profile</h1>
      
      <div className="flex flex-col gap-2">

        <Avatar
          className="mx-auto mb-4 w-32 h-32 text-3xl"
          src={photoPreviewUrl || user?.photoUrl} />

        <Input
          value={userName}
          onValueChange={setUserName}
          label="Nom d'utilisateur" />
        
        <ImageButton
          onImageChange={updatePhoto}
          startContent={
            <span className="material-symbols-rounded">{photo ? 'check' : 'image'}</span>
          }
        >Changer de photo de profile</ImageButton>
        
        <div className="mt-6 flex justify-center gap-2">
          <Button
            className="w-full"
            variant="flat"
            color="danger"
            onClick={cancel}
          >Annuler</Button>
          
          <Button
            className="w-full"
            color="primary"
            onClick={submit}
            isLoading={loading}
            startContent={success && !loading &&
              <span className="material-symbols-rounded">check</span>
            }
          >Valider</Button>
        </div>
      </div>
    </section>
  )
}

export default ProfileEditPage