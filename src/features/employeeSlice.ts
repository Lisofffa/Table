// features/employeeSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Employee {
  id: number
  companyId: number
  lastName: string
  firstName: string
  position: string
  isEmployeeSelected: boolean
}

interface EmployeeState {
  employees: Employee[]
}

const initialState: EmployeeState = {
  employees: [
    {
      id: 1,
      companyId: 1,
      lastName: 'Smith',
      firstName: 'John',
      position: 'Manager',
      isEmployeeSelected: false,
    },
    {
      id: 2,
      companyId: 1,
      lastName: 'Johnson',
      firstName: 'Anna',
      position: 'Developer',
      isEmployeeSelected: false,
    },
    {
      id: 3,
      companyId: 1,
      lastName: 'Williams',
      firstName: 'Robert',
      position: 'Designer',
      isEmployeeSelected: false,
    },
    {
      id: 4,
      companyId: 1,
      lastName: 'Jones',
      firstName: 'Emma',
      position: 'Analyst',
      isEmployeeSelected: false,
    },
    {
      id: 5,
      companyId: 1,
      lastName: 'Brown',
      firstName: 'Michael',
      position: 'Tester',
      isEmployeeSelected: false,
    },
    {
      id: 6,
      companyId: 2,
      lastName: 'Davis',
      firstName: 'Olivia',
      position: 'Manager',
      isEmployeeSelected: false,
    },
    {
      id: 7,
      companyId: 2,
      lastName: 'Miller',
      firstName: 'William',
      position: 'Developer',
      isEmployeeSelected: false,
    },
    {
      id: 8,
      companyId: 2,
      lastName: 'Moore',
      firstName: 'Sophia',
      position: 'Designer',
      isEmployeeSelected: false,
    },
    {
      id: 9,
      companyId: 2,
      lastName: 'Garcia',
      firstName: 'Liam',
      position: 'Analyst',
      isEmployeeSelected: false,
    },
    {
      id: 10,
      companyId: 2,
      lastName: 'White',
      firstName: 'Emily',
      position: 'Tester',
      isEmployeeSelected: false,
    },
  ],
}

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.employees.push(action.payload)
    },

    toggleSelectEmployee: (
      state,
      action: PayloadAction<{
        employeeIds: number[]
        isEmployeeSelected: boolean
      }>
    ) => {
      const { employeeIds, isEmployeeSelected } = action.payload

      state.employees.forEach((employee) => {
        if (employeeIds.includes(employee.id)) {
          employee.isEmployeeSelected = isEmployeeSelected
        }
      })
    },
    removeEmployees: (state, action: PayloadAction<number[]>) => {
      const employeeIdsToRemove = action.payload
      state.employees = state.employees.filter(
        (employee) => !employeeIdsToRemove.includes(employee.id)
      )
    },
    updateEmployee: (state, action: PayloadAction<Partial<Employee>>) => {
      const { id, ...updatedFields } = action.payload
      const employeeToUpdate = state.employees.find((employee) => employee.id === id)

      if (employeeToUpdate) {
        Object.assign(employeeToUpdate, updatedFields)
      }
    },
  },
})

export const { addEmployee, removeEmployees, toggleSelectEmployee, updateEmployee } =
  employeeSlice.actions
export default employeeSlice.reducer
