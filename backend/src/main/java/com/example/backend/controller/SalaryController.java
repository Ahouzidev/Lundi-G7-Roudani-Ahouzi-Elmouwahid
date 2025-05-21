package com.example.backend.controller;

import com.example.backend.service.SalaryService;
import com.example.backend.entity.Employee;
import com.example.backend.entity.Attendance;
import com.example.backend.repository.EmployeeRepository;
import com.example.backend.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/salaries")
@CrossOrigin(origins = "*")
public class SalaryController {
    @Autowired
    private SalaryService salaryService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @GetMapping("/employees")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = employeeRepository.findAll();
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/employees/{id}")
    public ResponseEntity<Employee> getEmployee(@PathVariable Long id) {
        return employeeRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/attendance")
    public ResponseEntity<List<Attendance>> getAttendanceRecords(
        @RequestParam Long employeeId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<Attendance> attendanceRecords = attendanceRepository.findByEmployeeIdAndDateBetween(
            employeeId, startDate, endDate);
        return ResponseEntity.ok(attendanceRecords);
    }

    @GetMapping("/calculate")
    public ResponseEntity<Map<String, Object>> calculateSalary(
        @RequestParam Long employeeId,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        Map<String, Object> salaryCalculation = salaryService.calculateSalary(employeeId, startDate, endDate);
        return ResponseEntity.ok(salaryCalculation);
    }
} 