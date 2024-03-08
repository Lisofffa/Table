// features/companySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk } from '../app/store'

export interface Employee {
  id: number
  companyId: number
  lastName: string
  firstName: string
  position: string
  isEmployeeSelected: boolean
}
export interface Company {
  id: number
  name: string
  address: string
  isSelected: boolean
  employees: number[]
  employeesCount: number
}

interface CompanyState {
  companies: Company[]
}

const initialState: CompanyState = {
  companies: [
    {
      id: 1,
      name: 'Company A',
      address: '123 Main St',
      isSelected: false,
      employees: [1, 2, 3, 4, 5],
      employeesCount: 5,
    },
    {
      id: 2,
      name: 'Company B',
      address: '456 Oak St',
      isSelected: false,
      employees: [6, 7, 8, 9, 10],
      employeesCount: 5,
    },
  ],
}

interface ToggleSelectCompanyPayload {
  companyId: number
  isSelected: boolean
}

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    toggleSelectCompany: (state, action: PayloadAction<ToggleSelectCompanyPayload>) => {
      const { companyId, isSelected } = action.payload
      const selectedCompany = state.companies.find((company) => company.id === companyId)

      if (selectedCompany) {
        selectedCompany.isSelected = isSelected
      }
    },
    addCompany: (state, action: PayloadAction<Company>) => {
      state.companies.push(action.payload)
    },
    removeCompanies: (state, action: PayloadAction<number[]>) => {
      state.companies = state.companies.filter((company) => !action.payload.includes(company.id))
    },
    addEmployeeToCompany: (state, action: PayloadAction<Employee>) => {
      const { companyId, ...employeeData } = action.payload

      const updatedCompanies = state.companies.map((company) => {
        if (company.id === companyId) {
          return {
            ...company,
            employees: [...company.employees, employeeData.id],
          }
        }
        return company
      })

      state.companies = updatedCompanies
    },
    updateSelectedEmployees: (state) => {
      const selectedEmployeeIds: number[] = []

      state.companies.forEach((company: Company) => {
        if (company.isSelected) {
          selectedEmployeeIds.push(...company.employees)
        }
      })

      state.companies.forEach((company: Company) => {
        const updatedEmployees: number[] = []

        selectedEmployeeIds.forEach((employeeId) => {
          if (company.employees.includes(employeeId)) {
            updatedEmployees.push(employeeId)
          }
        })

        if (company.employeesCount !== updatedEmployees.length) {
          company.employeesCount = updatedEmployees.length
        }
      })
    },
    updateCompany: (state, action: PayloadAction<Company>) => {
      const { id, ...updatedFields } = action.payload
      const companyToUpdate = state.companies.find((company) => company.id === id)

      if (companyToUpdate) {
        Object.assign(companyToUpdate, updatedFields)
      }
    },
  },
})

export const {
  addCompany,
  removeCompanies,
  toggleSelectCompany,
  updateSelectedEmployees,
  updateCompany,
  addEmployeeToCompany,
} = companySlice.actions

export const updateSelectedEmployeesAsync = (): AppThunk => (dispatch: any, getState: any) => {
  return Promise.resolve().then(() => {
    dispatch(updateSelectedEmployees())
  })
}
export default companySlice.reducer
