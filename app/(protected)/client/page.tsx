"use client";

import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/use-current-user";

const ClientPage = () => {
	const user = useCurrentUser();
	//@ts-expect-error //this is a next auth issue
	return <UserInfo label="👨‍⚖️ Client component" user={user} />;
};

export default ClientPage;
