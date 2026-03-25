import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useGetIdentity } from "@refinedev/core";
import { User as UserIcon } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
};

export function UserAvatar() {
  const { data: user, isLoading: userIsLoading } = useGetIdentity<User>();

  if (userIsLoading || !user) {
    return <Skeleton className={cn("h-10", "w-10", "rounded-full")} />;
  }

  const { name, avatar } = user;
  const initials = getInitials(name);

  return (
    <Avatar className={cn("h-10", "w-10", "border", "border-border")}>
      {avatar && <AvatarImage src={avatar} alt={name} />}
      <AvatarFallback className="flex flex-col items-center justify-center bg-muted">
        {initials ? (
          <span className="text-xs font-bold leading-none">{initials}</span>
        ) : (
          <UserIcon className="h-5 w-5 text-muted-foreground" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}

const getInitials = (name = "") => {
  const names = name.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

UserAvatar.displayName = "UserAvatar";
