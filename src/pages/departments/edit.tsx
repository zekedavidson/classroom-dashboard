import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { useBack, type BaseRecord, type HttpError } from "@refinedev/core";
import * as z from "zod";

import { EditView } from "@/components/refine-ui/views/edit-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const departmentSchema = z.object({
    code: z.string().min(2, "Department code must be at least 2 characters"),
    name: z.string().min(3, "Department name must be at least 3 characters"),
    description: z.string().min(5, "Department description must be at least 5 characters").optional().or(z.literal("")),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

const DepartmentsEdit = () => {
    const back = useBack();

    const form = useForm<BaseRecord, HttpError, DepartmentFormValues>({
        resolver: zodResolver(departmentSchema),
        refineCoreProps: {
            resource: "departments",
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

    const onSubmit = async (values: DepartmentFormValues) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error("Error editing department:", error);
        }
    };

    if (isLoading) {
        return (
            <EditView className="class-view">
                <Breadcrumb />
                <h1 className="page-title">Edit Department</h1>
                <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                </div>
            </EditView>
        );
    }

    return (
        <EditView className="class-view">
            <Breadcrumb />

            <h1 className="page-title">Edit Department</h1>
            <div className="intro-row">
                <p>Modify the details of an existing department below.</p>
                <div className="flex items-center gap-2">
                    <Button onClick={() => back()} variant="outline">Discard</Button>
                </div>
            </div>

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="class-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
                            Department Details
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Department Code <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="CS" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Department Name <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Computer Science" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Description
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe the department focus..."
                                                    className="min-h-28"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                />
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

export default DepartmentsEdit;
