import { useShow } from "@refinedev/core";
import { useParams } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ShowView,
    ShowViewHeader,
} from "@/components/refine-ui/views/show-view";

type UserDetails = {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
    createdAt?: string | null;
    emailVerified?: boolean | null;
};

const getInitials = (name = "") => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""
        }`.toUpperCase();
};

const UsersShow = () => {
    const { id } = useParams();

    const { query } = useShow<UserDetails>({
        resource: "users",
    });

    const user = query.data?.data;

    if (query.isLoading || query.isError || !user) {
        return (
            <ShowView className="class-view">
                <ShowViewHeader resource="users" title="User Details" />
                <p className="text-sm text-muted-foreground">
                    {query.isLoading
                        ? "Loading user details..."
                        : query.isError
                            ? "Failed to load user details."
                            : "User details not found."}
                </p>
            </ShowView>
        );
    }

    return (
        <ShowView className="class-view space-y-6">
            <ShowViewHeader resource="users" title="User Details" />

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                    <CardTitle>Profile Overview</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-6 items-start">
                    <Avatar className="size-24 border border-border">
                        {user.image && <AvatarImage src={user.image} alt={user.name} />}
                        <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>

                    <div className="space-y-4 flex-1">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>
                        
                        <div className="flex gap-2 items-center">
                            <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                            {user.emailVerified && <Badge variant="outline">Verified</Badge>}
                        </div>

                        {user.createdAt && (
                           <div className="text-sm text-muted-foreground mt-4">
                               Joined on {new Date(user.createdAt).toLocaleDateString()}
                           </div> 
                        )}
                    </div>
                </CardContent>
            </Card>
        </ShowView>
    );
};

export default UsersShow;
