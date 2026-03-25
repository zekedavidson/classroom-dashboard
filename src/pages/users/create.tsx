import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { useBack, type BaseRecord, type HttpError } from "@refinedev/core";
import * as z from "zod";

import { CreateView } from "@/components/refine-ui/views/create-view";
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

const userCreateSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["student", "teacher", "admin"]),
    image: z.string().optional(),
});

type UserFormValues = z.infer<typeof userCreateSchema>;

const UsersCreate = () => {
    const back = useBack();

    const form = useForm<BaseRecord, HttpError, UserFormValues>({
        resolver: zodResolver(userCreateSchema),
        refineCoreProps: {
            resource: "users",
            action: "create",
        },
        defaultValues: {
            name: "",
            email: "",
            role: "student",
            image: "",
        },
    });

    const {
        refineCore: { onFinish },
        handleSubmit,
        formState: { isSubmitting },
        control,
    } = form;

    const onSubmit = async (values: UserFormValues) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    return (
        <CreateView className="class-view">
            <Breadcrumb />

            <h1 className="page-title">Create User</h1>
            <div className="intro-row">
                <p>Provide the essential details to add a new user to the system.</p>
                <Button onClick={() => back()}>Go Back</Button>
            </div>

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="class-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
                            User Profile
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
                                                <Input placeholder="john@example.com" {...field} />
                                            </FormControl>
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
                                                <Input placeholder="https://example.com/avatar.png" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" size="lg" disabled={isSubmitting}>
                                    {isSubmitting ? "Creating..." : "Create User"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </CreateView>
    );
};

export default UsersCreate;
