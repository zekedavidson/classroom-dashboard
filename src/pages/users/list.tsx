import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserListItem = {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
    createdAt?: string | null;
};

const getInitials = (name = "") => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
    return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
};

const UsersList = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const userColumns = useMemo<ColumnDef<UserListItem>[]>(
        () => [
            {
                id: "name",
                accessorKey: "name",
                size: 240,
                header: () => <p className="column-title ml-2">User</p>,
                cell: ({ row }) => (
                    <div className="flex items-center gap-2 ml-2">
                        <Avatar className="size-8">
                            {row.original.image && (
                                <AvatarImage src={row.original.image} alt={row.original.name} />
                            )}
                            <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                            <span className="truncate font-medium text-foreground">{row.original.name}</span>
                            <span className="text-xs text-muted-foreground truncate">
                                {row.original.email}
                            </span>
                        </div>
                    </div>
                ),
            },
            {
                id: "role",
                accessorKey: "role",
                size: 140,
                header: () => <p className="column-title">Role</p>,
                cell: ({ getValue }) => (
                    <Badge variant="secondary">{getValue<string>()}</Badge>
                ),
            },
            {
                id: "actions",
                size: 200,
                header: () => <p className="column-title">Actions</p>,
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <ShowButton
                            resource="users"
                            recordItemId={row.original.id}
                            variant="outline"
                            size="sm"
                        >
                            View
                        </ShowButton>
                        <EditButton
                            resource="users"
                            recordItemId={row.original.id}
                            variant="outline"
                            size="sm"
                        >
                            Edit
                        </EditButton>
                        <DeleteButton
                            resource="users"
                            recordItemId={row.original.id}
                            variant="outline"
                            size="sm"
                        >
                            Delete
                        </DeleteButton>
                    </div>
                ),
            },
        ],
        []
    );

    const searchFilters = searchQuery
        ? [
            {
                field: "name",
                operator: "contains" as const,
                value: searchQuery,
            },
        ]
        : [];

    const usersTable = useTable<UserListItem>({
        columns: userColumns,
        refineCoreProps: {
            resource: "users",
            pagination: {
                pageSize: 10,
                mode: "server",
            },
            filters: {
                permanent: [...searchFilters],
            },
            sorters: {
                initial: [
                    {
                        field: "createdAt",
                        order: "desc",
                    },
                ],
            },
        },
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Users</h1>

            <div className="intro-row">
                <p>Manage access, view accounts, and assign roles.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />
                        <Input
                            type="text"
                            placeholder="Search by name or email..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                    </div>
                    <CreateButton resource="users" />
                </div>
            </div>

            <DataTable table={usersTable} />
        </ListView>
    );
};

export default UsersList;
