import { BaseRecord, DataProvider, GetListParams, GetListResponse } from "@refinedev/core";
import { Subject } from "@/types";

const mockSubjects: Subject[] = [
  {
    id: 1,
    name: 'Introduction to Computer Science',
    code: 'CS101',
    description: 'An introductory course to programming and computer science principles.',
    department: 'CS',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Calculus I',
    code: 'MATH101',
    description: 'Limits, derivatives, and introduction to integrals.',
    department: 'Math',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: 'English Composition',
    code: 'ENG101',
    description: 'Focuses on the development of writing skills and critical reading.',
    department: 'English',
    createdAt: new Date().toISOString()
  }
];

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({ resource }:
    GetListParams): Promise<GetListResponse<TData>> => {
    if (resource != 'subjects')
      return { data: [] as TData[], total: 0 };

    return {
      data: mockSubjects as unknown as TData[],
      total: mockSubjects.length
    }
  },

  getOne: async () => { throw new Error('This function is not present in mock') },
  create: async () => { throw new Error('This function is not present in mock') },
  update: async () => { throw new Error('This function is not present in mock') },
  deleteOne: async () => { throw new Error('This function is not present in mock') },

  getApiUrl: () => '',

}
