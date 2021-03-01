export type DoorPolicy = { id: string }
export type Employee = { id: number; policies: DoorPolicy[] }

export default interface EmployeeRepository {
  getPolicies(id: number): DoorPolicy[]
  setEmployee(employee: Employee): DoorPolicy[]
}

export class InMemoryDb implements EmployeeRepository {
  constructor(private db: Record<number, DoorPolicy[]> = {}) {}

  getPolicies(id: number): DoorPolicy[] {
    return this.db[id] || []
  }

  setEmployee(employee: Employee): DoorPolicy[] {
    this.db[employee.id] = employee.policies
    return employee.policies
  }
}
