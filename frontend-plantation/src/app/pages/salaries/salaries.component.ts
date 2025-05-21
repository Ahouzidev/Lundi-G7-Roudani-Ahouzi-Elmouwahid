import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalaryService } from '../../services/salary.service';
import { Employee, SalaryCalculation } from '../../models/employee.model';

@Component({
  selector: 'app-salaries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h2>Gestion des Salaires</h2>
      
      <div class="row mb-4">
        <div class="col-md-4">
          <label for="startDate" class="form-label">Date de début</label>
          <input type="date" class="form-control" id="startDate" [(ngModel)]="startDate">
        </div>
        <div class="col-md-4">
          <label for="endDate" class="form-label">Date de fin</label>
          <input type="date" class="form-control" id="endDate" [(ngModel)]="endDate">
        </div>
        <div class="col-md-4">
          <button class="btn btn-primary mt-4" (click)="calculateSalaries()" [disabled]="loading">
            {{ loading ? 'Calcul en cours...' : 'Calculer les salaires' }}
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
        <p class="mt-2">Calcul des salaires en cours...</p>
      </div>

      <div *ngIf="error" class="alert alert-danger">
        {{ error }}
      </div>

      <div class="table-responsive" *ngIf="!loading && !error && salaryCalculations.length > 0">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Nom de l'employé</th>
              <th>Jours travaillés</th>
              <th>Taux journalier</th>
              <th>Salaire total</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let salary of salaryCalculations">
              <td>{{ salary.employeeName }}</td>
              <td>{{ salary.daysWorked }}</td>
              <td>{{ salary.dailyRate | currency:'MAD':'symbol-narrow':'1.2-2' }}</td>
              <td>{{ salary.totalSalary | currency:'MAD':'symbol-narrow':'1.2-2' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!loading && !error && salaryCalculations.length === 0" class="alert alert-info">
        Aucun salaire calculé pour la période sélectionnée.
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .table {
      margin-top: 20px;
    }
    .spinner-border {
      width: 3rem;
      height: 3rem;
    }
  `]
})
export class SalariesComponent implements OnInit {
  startDate: Date = new Date();
  endDate: Date = new Date();
  salaryCalculations: SalaryCalculation[] = [];
  employees: Employee[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private salaryService: SalaryService) {
    console.log('SalariesComponent initialized');
  }

  ngOnInit() {
    console.log('ngOnInit called');
    this.loadEmployees();
  }

  loadEmployees() {
    console.log('Loading employees...');
    this.loading = true;
    this.error = null;
    
    this.salaryService.getEmployees().subscribe({
      next: (employees) => {
        console.log('Employees loaded:', employees);
        this.employees = employees;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.error = 'Erreur lors du chargement des employés. Veuillez réessayer.';
        this.loading = false;
      }
    });
  }

  calculateSalaries() {
    if (!this.startDate || !this.endDate) {
      this.error = 'Veuillez sélectionner une période valide.';
      return;
    }

    console.log('Calculating salaries...');
    console.log('Start date:', this.startDate);
    console.log('End date:', this.endDate);
    console.log('Number of employees:', this.employees.length);
    
    this.loading = true;
    this.error = null;
    this.salaryCalculations = [];

    const calculations: SalaryCalculation[] = [];
    let completedCalculations = 0;

    this.employees.forEach(employee => {
      console.log('Calculating salary for employee:', employee);
      
      this.salaryService.calculateSalary(
        employee.id,
        this.startDate,
        this.endDate
      ).subscribe({
        next: (calculation) => {
          console.log('Salary calculation result:', calculation);
          calculations.push(calculation);
          completedCalculations++;

          if (completedCalculations === this.employees.length) {
            this.salaryCalculations = calculations;
            this.loading = false;
          }
        },
        error: (err) => {
          console.error(`Error calculating salary for employee ${employee.id}:`, err);
          completedCalculations++;

          if (completedCalculations === this.employees.length) {
            if (calculations.length > 0) {
              this.salaryCalculations = calculations;
              this.error = 'Certains calculs de salaire ont échoué.';
            } else {
              this.error = 'Erreur lors du calcul des salaires. Veuillez réessayer.';
            }
            this.loading = false;
          }
        }
      });
    });
  }
}