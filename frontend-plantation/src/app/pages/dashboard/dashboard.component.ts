import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    RouterLink
  ],
  template: `
    <div class="dashboard-container">
      <h1>Tableau de bord</h1>
      
      <div class="dashboard-grid">
        <mat-card class="dashboard-card" [routerLink]="['/zones']">
          <mat-card-header>
            <mat-icon mat-card-avatar>terrain</mat-icon>
            <mat-card-title>Zones</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Gérez vos zones de plantation</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card" [routerLink]="['/projets']">
          <mat-card-header>
            <mat-icon mat-card-avatar>assignment</mat-icon>
            <mat-card-title>Projets</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Suivez vos projets en cours</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card" [routerLink]="['/employes']">
          <mat-card-header>
            <mat-icon mat-card-avatar>people</mat-icon>
            <mat-card-title>Employés</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Gérez votre personnel</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="dashboard-card" [routerLink]="['/besoins']">
          <mat-card-header>
            <mat-icon mat-card-avatar>shopping_cart</mat-icon>
            <mat-card-title>Besoins</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Suivez vos besoins en matériel</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .dashboard-card {
      cursor: pointer;
      transition: transform 0.2s;
      text-decoration: none;
      color: inherit;
    }
    .dashboard-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    mat-card-header {
      margin-bottom: 16px;
    }
    mat-icon[mat-card-avatar] {
      font-size: 40px;
      height: 40px;
      width: 40px;
    }
  `]
})
export class DashboardComponent {
  constructor() {}
} 