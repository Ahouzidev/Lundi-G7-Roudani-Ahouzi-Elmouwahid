export interface Employee {
    id: number;
    name: string;
    dailyRate: number;
}

export interface Attendance {
    id: number;
    employeeId: number;
    date: Date;
    isPresent: boolean;
}

export interface SalaryCalculation {
    employeeId: number;
    employeeName: string;
    daysWorked: number;
    dailyRate: number;
    totalSalary: number;
} 