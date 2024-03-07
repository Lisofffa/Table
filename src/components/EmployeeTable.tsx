// src/components/EmployeeTable.tsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/reducers";
import {
  removeEmployees,
  toggleSelectEmployee,
  updateEmployee,
} from "../features/employeeSlice";
import { updateSelectedEmployeesAsync } from "../features/companySlice";
interface EmployeeTableProps {
  visibleEmployees:number
}
const EmployeeTable: React.FC<EmployeeTableProps> = ({visibleEmployees}) =>{
  const dispatch = useDispatch();
  const companies = useSelector((state: RootState) => state.company.companies);

  const selectedEmployeeIds: number[] = [];
  companies.forEach((company) => {
    if (company.isSelected) {
      selectedEmployeeIds.push(...company.employees);
    }
  });

  const employees = useSelector((state: RootState) =>
    selectedEmployeeIds.map((employeeId) =>
      state.employee.employees.find((e) => e.id === employeeId)
    )
  );

  const [editableEmployeeId, setEditableEmployeeId] = useState<number | null>(
    null
  );

  const [editedEmployeeFields, setEditedEmployeeFields] = useState<{
    lastName: string;
    firstName: string;
    position: string;
  }>({ lastName: "", firstName: "", position: "" });

  const handleRemoveEmployees = () => {
    const selectedEmployeeIds = employees
      ?.filter((employee) => employee?.isEmployeeSelected)
      .map((employee) => employee?.id)
      .filter((id): id is number => id !== undefined);

    const selectedEmployeeIdsCopy = [...selectedEmployeeIds];

    dispatch(removeEmployees(selectedEmployeeIdsCopy));
    dispatch(
      toggleSelectEmployee({
        employeeIds: selectedEmployeeIdsCopy,
        isEmployeeSelected: false,
      })
    );
    dispatch(updateSelectedEmployeesAsync() as any);

    setEditableEmployeeId(null);
  };

  const handleSelectEmployee = (employeeId: number, selected: boolean) => {
    setEditableEmployeeId(employeeId);
    dispatch(
      toggleSelectEmployee({
        employeeIds: [employeeId],
        isEmployeeSelected: selected,
      })
    );
  };

  const handleEditEmployee = (employeeId: number) => {
    setEditableEmployeeId(employeeId);

    const employeeToEdit = employees.find(
      (employee) => employee?.id === employeeId
    );
    if (employeeToEdit) {
      setEditedEmployeeFields({
        lastName: employeeToEdit.lastName,
        firstName: employeeToEdit.firstName,
        position: employeeToEdit.position,
      });
    }
  };

  const handleSaveEditedEmployee = (employeeId: number) => {
    dispatch(
      updateEmployee({
        id: employeeId,
        lastName: editedEmployeeFields.lastName,
        firstName: editedEmployeeFields.firstName,
        position: editedEmployeeFields.position,
        companyId: 0, // TODO: did not provide the correct company identifier
        isEmployeeSelected: false,
      })
    );

    setEditableEmployeeId(null);
    setEditedEmployeeFields({
      lastName: "",
      firstName: "",
      position: "",
    });
  };

  const handleCancelEdit = () => {
    setEditableEmployeeId(null);
    setEditedEmployeeFields({
      lastName: "",
      firstName: "",
      position: "",
    });
  };
  const handleSelectAllEmployees = () => {
 
    const allEmployeeIds = companies.map((company) => company.employees).flat();

    dispatch(
      toggleSelectEmployee({
        employeeIds: allEmployeeIds,
        isEmployeeSelected: true,
      })
    );
  };
  
  useEffect(() => {
    dispatch(updateSelectedEmployeesAsync() as any);
  }, [selectedEmployeeIds, employees]);

  return (
    <div>
      {selectedEmployeeIds.length > 0 && (
        <>
          <button className="button" onClick={handleRemoveEmployees}>
            Удалить выбранных сотрудников
          </button>
          <button className="button" onClick={handleSelectAllEmployees}>
            Выделить всех сотрудников
          </button>
          <table>
            <thead>
              <tr>
                <th>Выделить </th>
                <th>Фамилия</th>
                <th>Имя</th>
                <th>Должность</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {employees.slice(0, visibleEmployees).map((employee) =>
                employee ? (
                  <tr
                    key={employee.id}
                    className={employee?.isEmployeeSelected ? "selected" : ""}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={employee?.isEmployeeSelected}
                        onChange={() =>
                          handleSelectEmployee(
                            employee?.id || 0,
                            !employee?.isEmployeeSelected
                          )
                        }
                      />
                    </td>
                    <td>
                      {editableEmployeeId === employee?.id ? (
                        <input
                          type="text"
                          value={editedEmployeeFields.lastName}
                          onChange={(e) =>
                            setEditedEmployeeFields({
                              ...editedEmployeeFields,
                              lastName: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <span>{employee?.lastName}</span>
                      )}
                    </td>
                    <td>
                      {editableEmployeeId === employee?.id ? (
                        <input
                          type="text"
                          value={editedEmployeeFields.firstName}
                          onChange={(e) =>
                            setEditedEmployeeFields({
                              ...editedEmployeeFields,
                              firstName: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <span>{employee?.firstName}</span>
                      )}
                    </td>
                    <td>
                      {editableEmployeeId === employee?.id ? (
                        <input
                          type="text"
                          value={editedEmployeeFields.position}
                          onChange={(e) =>
                            setEditedEmployeeFields({
                              ...editedEmployeeFields,
                              position: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <span>{employee?.position}</span>
                      )}
                    </td>
                    <td>
                      {editableEmployeeId === employee?.id ? (
                        <>
                          <button
                          className="button"
                            onClick={() =>
                              handleSaveEditedEmployee(employee?.id || 0)
                            }
                          >
                            Сохранить
                          </button>
                          <button  className="button"onClick={handleCancelEdit}>Отмена</button>
                        </>
                      ) : (
                        <button className="button"
                          onClick={() => handleEditEmployee(employee?.id || 0)}
                        >
                          Редактировать
                        </button>
                      )}
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default EmployeeTable;
