import { userAtom } from "@/state/authAtom";
import Image from "../Image";
import { useAtomValue } from "jotai";
import { PopoverComp } from "../PopoverComp";
import { UserIcon } from "@phosphor-icons/react";
import { LogOutIcon } from "lucide-react";
import { useAuthLogout } from "@/hooks/useAuth";

export default function UserInfoCircle() {
  const user = useAtomValue(userAtom);
  const logout = useAuthLogout();


  return (
    <div>
      <PopoverComp content={
        <div className="text-primary text-sm -m-4 flex flex-col gap-0 text-secondary">
          <div className="px-4 py-2 text-secondary flex flex-col gap-0.5">
            <div className="font-semibold">{user.name}</div>
            <div className="text-xs font-light">{user.email}</div>
            </div>
          <hr></hr>
          <div className="flex gap-2 items-center hover:bg-accent px-4 py-2 text-xs"><UserIcon size={12}/><div>Profile</div></div>
          <div className="flex gap-2 items-center hover:bg-accent px-4 py-2 text-xs" onClick={logout}><LogOutIcon size={12} /><div>Log out</div></div>
        </div>
        }>
        <div className="p-0.5 border-2 rounded-full">
          <Image src={user.avatar_url} className="h-8 w-8 rounded-full " />
        </div>
      </PopoverComp>
    </div>
  );
}
