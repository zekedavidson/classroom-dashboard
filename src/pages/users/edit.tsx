import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { useBack, type BaseRecord, type HttpError } from "@refinedev/core";
import * as z from "zod";

import { EditView, EditViewHeader } from "@/components/refine-ui/views/edit-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const userEditSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["student", "teacher", "admin"]),
    image: z.string().optional(),
});

type UserFormValues = z.infer<typeof userEditSchema>;

const UsersEdit = () => {
    const back = useBack();

    const form = useForm<BaseRecord, HttpError, UserFormValues>({
        resolver: zodResolver(userEditSchema),
        refineCoreProps: {
            resource: "users",
            action: "edit",
        },
    });

    const {
        refineCore: { onFinish, query },
        handleSubmit,
        formState: { isSubmitting },
        control,
    } = form;

    const isLoading = query?.isLoading;

    const onSubmit = async (values: UserFormValues) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error("Error editing user:", error);
        }
    };

    if (isLoading) {
        return (
            <EditView className="class-view">
                <Breadcrumb />
                <h1 className="page-title">Edit User</h1>
                <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                </div>
            </EditView>
        );
    }

    return (
        <EditView className="class-view">
            <Breadcrumb />

            <h1 className="page-title">Edit User</h1>
            <div className="intro-row">
                <p>Modify the details of an existing user account.</p>
                <div className="flex items-center gap-2">
                    <Button onClick={() => back()} variant="outline">Discard</Button>
                </div>
            </div>

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="class-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
                            User Details
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Full Name <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Email Address <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input readOnly disabled className="bg-muted cursor-not-allowed" placeholder="john@example.com" {...field} />
                                            </FormControl>
                                            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed directly via basic edit form.</p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Role <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="student">Student</SelectItem>
                                                    <SelectItem value="teacher">Teacher</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="image"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Avatar URL
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://example.com/avatar.png" {...field} value={field.value ?? ""} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" size="lg" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </EditView>
    );
};

export default UsersEdit;
