export type DepartmentFormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

export type DepartmentManagerOption = {
  id: string;
  firstName: string;
  lastName: string;
  employeeNumber: string;
  status: string;
};

export type DepartmentFormValues = {
  id?: string;
  name?: string;
  code?: string | null;
  description?: string | null;
  managerEmployeeId?: string | null;
};
