// src/components/CompanyTable.tsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/reducers";
import {
  Company,
  addCompany,
  removeCompanies,
  toggleSelectCompany,
  updateSelectedEmployeesAsync,
  updateCompany,
  addEmployeeToCompany,
} from "../features/companySlice";
import { addEmployee } from "../features/employeeSlice";
import "./CompanyTable.css";

interface CompanyForm {
  name: string;
  address: string;

}
interface CompanyTableProps {
  visibleCompanies:number
}

const CompanyTable: React.FC<CompanyTableProps> = ({visibleCompanies}) =>{
  const dispatch = useDispatch();
  const companies = useSelector((state: RootState) => state.company.companies);
  
  useEffect(() => {
    dispatch(updateSelectedEmployeesAsync() as any);
  }, [companies, dispatch]);

  const [newCompany, setNewCompany] = useState<CompanyForm>({
    name: "",
    address: "",
  });
  const [newEmployee, setNewEmployee] = useState({
    companyId: 0,
    lastName: "",
    firstName: "",
    position: "",
  });
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);

  const handleAddCompany = () => {
    const newCompanyData = {
      id: Date.now(),
      name: newCompany.name,
      address: newCompany.address,
      isSelected: false,
      employees: [],
      employeesCount: 0,
    };

    dispatch(addCompany(newCompanyData));
    setNewCompany({ name: "", address: "" });
  };

  const handleEditCompany = (
    companyId: number,
    fieldName: string,
    value: string | number
  ) => {
    const updatedFields: Partial<Company> = {
      id: companyId,
      [fieldName]: value,
    };

    dispatch(updateCompany(updatedFields as Company));
  };

  const handleRemoveCompanies = () => {
    const selectedCompanyIds = companies
      .filter((company) => company.isSelected)
      .map((company) => company.id);
    dispatch(removeCompanies(selectedCompanyIds));
  };

  const handleSelectCompany = (companyId: number, companySelected: boolean) => {
    dispatch(toggleSelectCompany({ companyId, isSelected: !companySelected }));
    setTimeout(() => {
      dispatch(updateSelectedEmployeesAsync() as any);
    }, 0);
  };

  const handleSelectAllCompanies = () => {
    const allSelected = companies.every((company) => company.isSelected);
    companies.forEach((company) => {
      dispatch(
        toggleSelectCompany({ companyId: company.id, isSelected: !allSelected })
      );
    });
    dispatch(updateSelectedEmployeesAsync() as any);
  };

  const handleAddEmployee = (companyId: number) => {
    setNewEmployee({
      companyId,
      lastName: "",
      firstName: "",
      position: "",
    });
    setShowEmployeeForm(true);
  };

  const handleAddEmployeeSubmit = () => {
    if (
      newEmployee.companyId &&
      newEmployee.lastName &&
      newEmployee.firstName
    ) {
      const employeeData = {
        id: Date.now(),
        companyId: newEmployee.companyId,
        lastName: newEmployee.lastName,
        firstName: newEmployee.firstName,
        position: newEmployee.position,
        isEmployeeSelected: false,
      };

      dispatch(addEmployee(employeeData));
      dispatch(addEmployeeToCompany(employeeData));

      setShowEmployeeForm(false);
      setNewEmployee({
        companyId: 0,
        lastName: "",
        firstName: "",
        position: "",
      });
      dispatch(updateSelectedEmployeesAsync() as any);
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Название компании"
          value={newCompany.name}
          onChange={(e) =>
            setNewCompany({ ...newCompany, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Адрес компании"
          value={newCompany.address}
          onChange={(e) =>
            setNewCompany({ ...newCompany, address: e.target.value })
          }
        />
        <button className="button" onClick={handleAddCompany}>
          Добавить компанию
        </button>
      </div>
      <button className="button" onClick={handleRemoveCompanies}>
        Удалить выбранные компании
      </button>
      <button className="button" onClick={handleSelectAllCompanies}>
        Выделить всё
      </button>
      <table>
        <thead>
          <tr>
            <th>Выделить</th>
            <th>Название компании</th>
            <th>Кол-во сотрудников</th>
            <th>Адрес</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {companies.slice(0, visibleCompanies).map((company) => (
            <tr
              key={company.id}
              className={company.isSelected ? "selected" : ""}
            >
              <td>
                <input
                  type="checkbox"
                  checked={company.isSelected}
                  onChange={() =>
                    handleSelectCompany(company.id, company.isSelected)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={company.name}
                  onChange={(e) =>
                    handleEditCompany(company.id, "name", e.target.value)
                  }
                />
              </td>
              <td>{company.employees.length}</td>
              <td>
                <input
                  type="text"
                  value={company.address}
                  onChange={(e) =>
                    handleEditCompany(company.id, "address", e.target.value)
                  }
                />
              </td>
              <td>
                <button
                  className="button"
                  onClick={() => handleAddEmployee(company.id)}
                >
                  Добавить сотрудника
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showEmployeeForm && (
        <div>
          <input
            type="text"
            placeholder="Фамилия"
            value={newEmployee.lastName}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, lastName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Имя"
            value={newEmployee.firstName}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, firstName: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Должность"
            value={newEmployee.position}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, position: e.target.value })
            }
          />
          <button className="button" onClick={() => handleAddEmployeeSubmit()}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyTable;
