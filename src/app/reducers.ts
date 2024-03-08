//src/app/reducers.ts
import { combineReducers } from '@reduxjs/toolkit'
import companyReducer from '../features/companySlice'
import employeeReducer from '../features/employeeSlice'

const rootReducer = combineReducers({
  company: companyReducer,
  employee: employeeReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
