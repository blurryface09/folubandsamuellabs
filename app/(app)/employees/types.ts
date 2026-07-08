export type EmployeeFormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

export type EmployeeFormDepartment = {
  id: string;
  name: string;
  code: string | null;
};

export type EmployeeFormValues = {
  id?: string;
  employeeNumber?: string;
  firstName?: string;
  lastName?: string;
  workEmail?: string | null;
  phone?: string | null;
  jobTitle?: string | null;
  departmentId?: string | null;
  employmentType?: string;
  status?: string;
  hireDate?: Date | string | null;
};
