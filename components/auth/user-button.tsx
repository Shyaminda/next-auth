import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { FaUser } from "react-icons/fa";
import { LogoutButton } from "@/components/auth/logout-button";
import { ExitIcon } from "@radix-ui/react-icons";

export const UserButton = () => {
	const user = useCurrentUser();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Avatar>
					<AvatarImage src={user?.image || ""} />
					<AvatarFallback className="bg-sky-500">
						<FaUser className="text-white" />
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-40" align="end">
				<LogoutButton>
					<DropdownMenuItem className="bg-slate-200 text-black">
						<ExitIcon className="h-4 w-4 mr-2" />
						Logout
					</DropdownMenuItem>
				</LogoutButton>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
