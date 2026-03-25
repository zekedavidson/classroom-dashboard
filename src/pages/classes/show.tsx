import { ShowView, ShowViewHeader } from '@/components/refine-ui/views/show-view'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ClassDetails, User } from '@/types/index'
import { useShow, useCustom, useCustomMutation, useList, useApiUrl, useInvalidate, useNotification } from '@refinedev/core'
import { AdvancedImage } from '@cloudinary/react';
import { bannerPhoto } from '@/lib/cloudinary'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Trash2 } from 'lucide-react'

const Show = () => {
    const { query } = useShow<ClassDetails>({ resource: 'classes' });
    const classDetails = query.data?.data;
    const { isLoading, isError } = query;
    const apiUrl = useApiUrl();
    const invalidate = useInvalidate();
    const { open } = useNotification();

    const [selectedStudentToEnroll, setSelectedStudentToEnroll] = useState<string>('');

    // Fetch enrollments
    const enrollmentsQuery = useCustom({
        url: `${apiUrl}/classes/${classDetails?.id}/enrollments`,
        method: "get",
        queryOptions: {
            enabled: !!classDetails?.id,
        }
    }) as any;

    const enrollmentsData = enrollmentsQuery?.data;
    const enrollmentsLoading = enrollmentsQuery?.isLoading;

    const enrollmentsResponse = enrollmentsData?.data as any;
    const enrolledStudents = enrollmentsResponse?.data || [];
    const enrolledStudentIds = enrolledStudents.map((s: any) => s.id);

    // Fetch all students for enrollment dropdown
    const { query: studentsQuery } = useList<User>({
        resource: 'users',
        filters: [{ field: 'role', operator: 'eq', value: 'student' }],
        pagination: { pageSize: 1000 }
    });
    
    const allStudents = studentsQuery?.data?.data || [];
    const availableStudents = allStudents.filter(s => !enrolledStudentIds.includes(s.id));

    const enrollMutation = useCustomMutation();
    const unenrollMutation = useCustomMutation();

    const handleEnroll = () => {
        if (!selectedStudentToEnroll || !classDetails?.id) return;

        enrollMutation.mutate({
            url: `${apiUrl}/classes/${classDetails.id}/enroll`,
            method: "post",
            values: { studentId: selectedStudentToEnroll },
        }, {
            onSuccess: () => {
                open?.({ message: 'Student enrolled successfully', type: 'success' });
                setSelectedStudentToEnroll('');
                invalidate({
                    resource: 'classes',
                    invalidates: ['detail', 'list', 'resourceAll'],
                });
            },
            onError: (error) => {
                open?.({ message: error?.message || 'Failed to enroll student', type: 'error' });
            }
        });
    };

    const handleUnenroll = (studentId: string) => {
        if (!classDetails?.id) return;
        
        if (!confirm('Are you sure you want to remove this student from the class?')) return;

        unenrollMutation.mutate({
            url: `${apiUrl}/classes/${classDetails.id}/enroll/${studentId}`,
            method: "delete",
            values: {}
        }, {
            onSuccess: () => {
                open?.({ message: 'Student unenrolled successfully', type: 'success' });
                invalidate({
                    resource: 'classes',
                    invalidates: ['detail', 'list', 'resourceAll'],
                });
            },
            onError: (error) => {
                open?.({ message: error?.message || 'Failed to unenroll student', type: 'error' });
            }
        });
    };

    if (isLoading || isError || !classDetails) {
        return (
            <ShowView className='class-view class-show'>
                <ShowViewHeader resource='classes' title='Class Details' />

                <p className='state-message'>
                    {isLoading ? 'Loading class details...'
                        : isError ? 'Failed to load class details...'
                            : 'Class details not found'}
                </p>
            </ShowView>
        )
    }

    const teacherName = classDetails.teacher?.name ?? 'Unknown';
    const teachersInitials =
        teacherName.split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part: string) => part[0]?.toUpperCase())
            .join('')

    const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(teachersInitials || 'NA')}`;

    const { name, description, status, capacity, bannerUrl, bannerCldPubId, subject, teacher, department } = classDetails
    return (
        <ShowView className='class-view class-show'>
            <ShowViewHeader resource='classes' title='Class Details' />

            <div className='banner'>
                {bannerCldPubId ? (
                    <AdvancedImage
                        alt='Class Banner'
                        cldImg={bannerPhoto(bannerCldPubId, name)}
                    />
                ) : bannerUrl ? (
                    <img src={bannerUrl} alt='Class Banner' className='w-full h-full object-cover' />
                ) : (
                    <div className='placeholder' />
                )}
            </div>

            <Card className='details-card'>
                <div className='details-header'>
                    <div>
                        <h1>{name}</h1>
                        <p>{description}</p>
                    </div>

                    <div>
                        <Badge variant='outline'>{capacity} spots</Badge>
                        <Badge variant={status == 'active' ? 'default' :
                            'secondary'} data-status={status}>
                            {status.toUpperCase()}
                        </Badge>
                    </div>
                </div>

                <div className='details-grid'>
                    <div className='instructor'>
                        <p>Instructor</p>
                        <div>
                            <img src={teacher?.image ?? placeholderUrl}
                                alt={teacherName} />

                            <div>
                                <p>{teacherName}</p>
                                <p>{teacher?.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className='department'>
                        <p>Department</p>
                        <div>
                            <p>{department?.name}</p>
                            <p>{department?.description}</p>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className='subject'>
                    <p>Subject</p>

                    <div>
                        <Badge variant='outline'>Code: {subject?.code}</Badge>
                        <p>{subject?.name}</p>
                        <p>{subject?.description}</p>
                    </div>
                </div>

                <Separator />
                
                <div className='enrollments-section mt-8 px-8'>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Enrolled Students</h2>
                        <div className="flex items-center gap-2">
                            <Select value={selectedStudentToEnroll} onValueChange={setSelectedStudentToEnroll}>
                                <SelectTrigger className="w-[250px]">
                                    <SelectValue placeholder="Select a student to enroll" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableStudents.map(student => (
                                        <SelectItem key={student.id} value={student.id}>
                                            {student.name} ({student.email})
                                        </SelectItem>
                                    ))}
                                    {availableStudents.length === 0 && (
                                        <div className="p-2 text-sm text-muted-foreground text-center">No more students to enroll</div>
                                    )}
                                </SelectContent>
                            </Select>
                            <Button 
                                onClick={handleEnroll} 
                                disabled={!selectedStudentToEnroll || enrollMutation.mutation?.isPending}
                            >
                                {enrollMutation.mutation?.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Enroll
                            </Button>
                        </div>
                    </div>

                    {enrollmentsLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                        </div>
                    ) : enrolledStudents.length > 0 ? (
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50 transition-colors">
                                        <th className="h-12 px-4 text-left font-medium">Name</th>
                                        <th className="h-12 px-4 text-left font-medium">Email</th>
                                        <th className="h-12 px-4 text-left font-medium">Enrolled At</th>
                                        <th className="h-12 px-4 text-right font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enrolledStudents.map((enrollment: any) => (
                                        <tr key={enrollment.enrollmentId} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 flex items-center gap-3">
                                                <img 
                                                    src={enrollment.image || `https://placehold.co/100x100?text=${encodeURIComponent(enrollment.name?.[0] || 'NA')}`} 
                                                    alt={enrollment.name} 
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                                <span className="font-medium">{enrollment.name}</span>
                                            </td>
                                            <td className="p-4">{enrollment.email}</td>
                                            <td className="p-4 text-muted-foreground">
                                                {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleUnenroll(enrollment.id)}
                                                    disabled={unenrollMutation.mutation?.isPending}
                                                    title="Unenroll student"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 border rounded-md bg-muted/20">
                            <p className="text-muted-foreground">No students enrolled yet.</p>
                        </div>
                    )}
                </div>

                <Separator className="my-8" />
                <div className='join'>
                    <h2>Join Class</h2>

                    <ol>
                        <li>Ask your teacher for the invite code: <Badge variant="outline" className="ml-2 font-mono">{classDetails.inviteCode}</Badge></li>
                        <li>Click on "Join Class" button</li>
                        <li>Paste the code and click "join"</li>
                    </ol>
                </div>
            </Card>
        </ShowView>
    )
}

export default Show