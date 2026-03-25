import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { useBack, useList, type BaseRecord, type HttpError } from "@refinedev/core";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Department } from "@/types";
import { Loader2 } from "lucide-react";

const subjectEditSchema = z.object({
    departmentId: z.coerce
        .number({
            required_error: "Department is required",
            invalid_type_error: "Department is required",
        })
        .min(1, "Department is required"),
    name: z.string().min(3, "Subject name must be at least 3 characters"),
    code: z.string().min(3, "Subject code must be at least 3 characters"),
    description: z.string().optional().or(z.literal("")),
});

type SubjectFormValues = z.infer<typeof subjectEditSchema>;

const SubjectsEdit = () => {
    const back = useBack();

    const form = useForm<BaseRecord, HttpError, SubjectFormValues>({
        resolver: zodResolver(subjectEditSchema),
        refineCoreProps: {
            resource: "subjects",
            action: "edit",
        },
    });

    const {
        refineCore: { onFinish, query },
        handleSubmit,
        formState: { isSubmitting },
        control,
    } = form;

    const { query: departmentsQuery } = useList<Department>({
        resource: "departments",
        pagination: {
            pageSize: 100,
        },
    });

    const departments = departmentsQuery.data?.data ?? [];
    const departmentsLoading = departmentsQuery.isLoading;
    const isLoading = query?.isLoading;

    const onSubmit = async (values: SubjectFormValues) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error("Error editing subject:", error);
        }
    };

    if (isLoading) {
        return (
            <EditView className="class-view">
                <Breadcrumb />
                <h1 className="page-title">Edit Subject</h1>
                <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                </div>
            </EditView>
        );
    }

    return (
        <EditView className="class-view">
            <Breadcrumb />

            <h1 className="page-title">Edit Subject</h1>
            <div className="intro-row">
                <p>Modify the details of an existing subject below.</p>
                <div className="flex items-center gap-2">
                    <Button onClick={() => back()} variant="outline">Discard</Button>
                </div>
            </div>

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="class-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
                            Subject Details
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={control}
                                    name="departmentId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Department <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <Select
                                                onValueChange={(value) =>
                                                    field.onChange(Number(value))
                                                }
                                                value={field.value ? String(field.value) : ""}
                                                disabled={departmentsLoading}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a department" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {departments.map((department) => (
                                                        <SelectItem
                                                            key={department.id}
                                                            value={String(department.id)}
                                                        >
                                                            {department.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                                Subject Name <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Intro to Programming" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Subject Code <span className="text-orange-600">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input readOnly disabled className="bg-muted cursor-not-allowed" placeholder="CS101" {...field} />
                                            </FormControl>
                                            <p className="text-xs text-muted-foreground mt-1">Providing safe edits: subject code cannot be changed.</p>
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
                                                    placeholder="Describe the subject focus..."
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

export default SubjectsEdit;
