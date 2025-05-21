package com.example.backend.service;

import com.example.backend.entity.Employee;
import com.example.backend.entity.Attendance;
import com.example.backend.repository.EmployeeRepository;
import com.example.backend.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SalaryService {
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    public Map<String, Object> calculateSalary(Long employeeId, LocalDate startDate, LocalDate endDate) {
        Employee employee = employeeRepository.findById(employeeId)
            .orElseThrow(() -> new RuntimeException("Employee not found"));

        List<Attendance> attendanceRecords = attendanceRepository.findByEmployeeIdAndDateBetween(
            employeeId, startDate, endDate);

        long daysWorked = attendanceRecords.stream()
            .filter(Attendance::getIsPresent)
            .count();

        double totalSalary = daysWorked * employee.getDailyRate();

        return Map.of(
            "employeeId", employee.getId(),
            "employeeName", employee.getName(),
            "daysWorked", daysWorked,
            "dailyRate", employee.getDailyRate(),
            "totalSalary", totalSalary
        );
    }
} 