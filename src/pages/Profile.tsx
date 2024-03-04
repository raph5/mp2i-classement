import { Avatar, Button, Card, Link } from "@nextui-org/react";
import type React from "react";
import { useUser } from "../hooks/useUsers";

const ProfilePage: React.FC = () => {

  const [ user ] = useUser()

  const getInitials = (name: string) => name.substring(0, 4)
  
  return (
    <section>
      <div className="flex flex-col items-center py-4 w-full mb-12">
        <Avatar
          src={user?.photoUrl ?? undefined}
          name={user?.name ?? '?'}
          showFallback
          className="w-32 h-32 text-3xl"
          getInitials={getInitials}
        />
        <h2 className="mt-4 text-large">{user?.name}</h2>
      </div>

      <Card className="mb-2 flex flex-row px-4 py-4">
        {user?.isValid
          ? <span className="material-symbols-rounded text-success mr-2">verified</span>
          : <span className="material-symbols-rounded text-warning mr-2">error</span>
        }
        {user?.isValid
          ? <span>Profile vérifié</span>
          : <span>Profile non vérifié</span>
        }
      </Card>

      <Button
        className="mb-8 w-full"
        as={Link}
        href="/#/app/profile-edit"
        startContent={
          <span className="material-symbols-rounded">edit</span>
        }
      >Modifier</Button>
      
      <Button
        color="danger"
        className="w-full"
      >Se déconecter</Button>
    </section>
  )
}

export default ProfilePage