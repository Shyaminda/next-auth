"use client";

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {
	const onServiceActionClick = () => {
		//this function is same as the onApiRouteClick() function but done with server actions
		admin().then((data) => {
			if (data.error) {
				toast.error(data.error);
			}
			if (data.success) {
				toast.success(data.success);
			}
		});
	};

	const onApiRouteClick = () => {
		fetch("/api/admin").then((res) => {
			if (res.ok) {
				toast.success("Allowed API Route!");
			} else {
				toast.error("Forbidden API Route!");
			}
		});
	};
	return (
		<Card className="w-[600px]">
			<CardHeader>
				<p className="text-2xl font-semibold text-center">🔑 Admin</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<RoleGate allowedRole={UserRole.ADMIN}>
					<FormSuccess message="Admin access allowed!" />
				</RoleGate>
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
					<p className="text-sm font-medium">Admin view API Route</p>
					<Button onClick={onApiRouteClick}>Click to view</Button>
				</div>
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
					<p className="text-sm font-medium">Admin view Server Action</p>
					<Button onClick={onServiceActionClick}>Click to view</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default AdminPage;
