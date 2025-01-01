import { UserInfo } from "@/components/user-info";
import { currentUser } from "@/lib/auth";

const ServerPage = async () => {
	const user = await currentUser();
	//@ts-expect-error //this is a next auth issue
	return <UserInfo label="💻 Server component" user={user} />;
};

export default ServerPage;
