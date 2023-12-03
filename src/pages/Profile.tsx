import { Avatar, Button, Card } from "@nextui-org/react";
import type React from "react";
import { useAuth } from "../hooks/useAuth";

const ProfilePage: React.FC = () => {

  const { user, isValid } = useAuth()

  const getInitials = (name: string) => name.substring(0, 4)
  
  return (
    <section>
      <div className="flex flex-col items-center py-4 w-full mb-12">
        <Avatar
          src={user?.photoURL ?? undefined}
          name={user?.displayName ?? '?'}
          showFallback
          className="w-32 h-32 text-3xl"
          getInitials={getInitials}
        />
        <h2 className="mt-4 text-large">{user?.displayName}</h2>
      </div>

      <Card className="mb-8 flex flex-row px-4 py-4">
        {isValid
          ? <span className="material-symbols-rounded text-success mr-2">verified</span>
          : <span className="material-symbols-rounded text-warning mr-2">error</span>
        }
        {isValid
          ? <span>Profile vérifié</span>
          : <span>Profile non vérifié</span>
        }
      </Card>
      
      <Button
        color="danger"
        className="w-full"
      >Se déconecter</Button>
    </section>
  )
}

export default ProfilePage