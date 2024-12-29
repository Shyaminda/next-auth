"use client";

import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";

export const Social = () => {
	return (
		<div className="flex items-center gap-x-2">
			<Button className="w-full" size="lg" variant="outline" onClick={() => {}}>
				<FcGoogle className="h-5 w-5" />
			</Button>
			<Button className="w-full" size="lg" variant="outline" onClick={() => {}}>
				<FaGithub className="h-5 w-5" />
			</Button>
		</div>
	);
};
