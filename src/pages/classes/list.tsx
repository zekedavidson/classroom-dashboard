import { CreateButton } from '@/components/refine-ui/buttons/create'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { ListView } from '@/components/refine-ui/views/list-view'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Subject, User } from '@/types'
import { useList } from '@refinedev/core'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import { Search } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { ClassRecord } from '@/types'

const ClassesList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedTeacher, setSelectedTeacher] = useState('all');

    // Fetch subjects and teachers for filter dropdowns
    const { query: subjectsQuery } = useList<Subject>({
        resource: 'subjects',
        pagination: { pageSize: 100 }
    });

    const { query: teachersQuery } = useList<User>({
        resource: 'users',
        filters: [{ field: 'role', operator: 'eq', value: 'teacher' }],
        pagination: { pageSize: 100 }
    });

    const subjects = subjectsQuery?.data?.data || [];
    const teachers = teachersQuery?.data?.data || [];

    // Build filters
    const searchFilters = searchQuery
        ? [{ field: 'name', operator: 'contains' as const, value: searchQuery }]
        : [];

    const subjectFilters = selectedSubject !== 'all'
        ? [{ field: 'subject', operator: 'eq' as const, value: selectedSubject }]
        : [];

    const teacherFilters = selectedTeacher !== 'all'
        ? [{ field: 'teacher', operator: 'eq' as const, value: selectedTeacher }]
        : [];

    const classTable = useTable<ClassRecord>({
        columns: useMemo<ColumnDef<ClassRecord>[]>(() => [
            {
                id: 'banner',
                accessorKey: 'bannerUrl',
                size: 80,
                header: () => <p className='column-title ml-2'>Banner</p>,
                cell: ({ getValue }) => {
                    const url = getValue<string>();
                    return url ? (
                        <img
                            src={url}
                            alt="Class banner"
                            className="w-12 h-12 rounded object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                            N/A
                        </div>
                    );
                }
            },
            {
                id: 'name',
                accessorKey: 'name',
                size: 200,
                header: () => <p className='column-title'>Class Name</p>,
                cell: ({ getValue }) => <span className='text-foreground'>{getValue<string>()}</span>,
            },
            {
                id: 'status',
                accessorKey: 'status',
                size: 100,
                header: () => <p className='column-title'>Status</p>,
                cell: ({ getValue }) => {
                    const status = getValue<string>();
                    return (
                        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                    );
                }
            },
            {
                id: 'subject',
                accessorKey: 'subject.name',
                size: 150,
                header: () => <p className='column-title'>Subject</p>,
                cell: ({ getValue }) => {
                    const name = getValue<string>();
                    return name
                        ? <Badge variant="secondary">{name}</Badge>
                        : <span className="text-muted-foreground">—</span>;
                }
            },
            {
                id: 'teacher',
                accessorKey: 'teacher.name',
                size: 150,
                header: () => <p className='column-title'>Teacher</p>,
                cell: ({ getValue }) => {
                    const name = getValue<string>();
                    return name
                        ? <span className="text-foreground">{name}</span>
                        : <span className="text-muted-foreground">—</span>;
                }
            },
            {
                id: 'capacity',
                accessorKey: 'capacity',
                size: 100,
                header: () => <p className='column-title'>Capacity</p>,
                cell: ({ getValue }) => {
                    const cap = getValue<number>();
                    return <span className="text-foreground">{cap ?? '—'}</span>;
                }
            },
        ], []),
        refineCoreProps: {
            resource: 'classes',
            pagination: { pageSize: 10, mode: 'server' },
            filters: {
                permanent: [...searchFilters, ...subjectFilters, ...teacherFilters]
            },
            sorters: {
                initial: [{ field: 'id', order: 'desc' }]
            },
        }
    });

    return (
        <ListView>
            <Breadcrumb />

            <h1 className='page-title'>Classes</h1>

            <div className='intro-row'>
                <p>Quick access to essential metrics and management tools.</p>

                <div className='actions-row'>
                    <div className='search-field'>
                        <Search className='search-icon' />

                        <Input
                            type="text"
                            placeholder="Search by class name..."
                            className='pl-10 w-full'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className='flex gap-2 w-full sm:w-auto'>
                        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by subject" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">
                                    All Subjects
                                </SelectItem>
                                {subjects.map(subject => (
                                    <SelectItem key={subject.id} value={subject.name}>
                                        {subject.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by teacher" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">
                                    All Teachers
                                </SelectItem>
                                {teachers.map(teacher => (
                                    <SelectItem key={teacher.id} value={teacher.name}>
                                        {teacher.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <CreateButton resource="classes" />
                    </div>
                </div>
            </div>

            <DataTable table={classTable} />
        </ListView>
    )
}

export default ClassesList
