import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ZoneService } from '../../services/zone.service';
import { ProjetService } from '../../services/projet.service';
import { Zone } from '../../models/zone.model';
import { Projet } from '../../models/projet.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    NgxChartsModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Statistiques générales -->
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>terrain</mat-icon>
            </div>
            <div class="stat-info">
              <h3>Total Zones</h3>
              <p class="stat-number">{{totalZones}}</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>assignment</mat-icon>
            </div>
            <div class="stat-info">
              <h3>Total Projets</h3>
              <p class="stat-number">{{totalProjets}}</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>trending_up</mat-icon>
            </div>
            <div class="stat-info">
              <h3>Projets en cours</h3>
              <p class="stat-number">{{projetsEnCours}}</p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="stat-info">
              <h3>Projets terminés</h3>
              <p class="stat-number">{{projetsTermines}}</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Graphiques -->
      <div class="charts-grid">
        <!-- Distribution des projets par zone -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Distribution des projets par zone</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <ngx-charts-pie-chart
              [results]="projetsParZone"
              [gradient]="true"
              [legend]="true"
              [labels]="true"
              [doughnut]="true"
              [arcWidth]="0.4"
              [view]="[500, 300]">
            </ngx-charts-pie-chart>
          </mat-card-content>
        </mat-card>

        <!-- Statut des projets -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Statut des projets</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <ngx-charts-bar-vertical
              [results]="statutProjets"
              [gradient]="true"
              [xAxis]="true"
              [yAxis]="true"
              [legend]="false"
              [showXAxisLabel]="true"
              [showYAxisLabel]="true"
              [xAxisLabel]="'Statut'"
              [yAxisLabel]="'Nombre de projets'"
              [view]="[500, 300]">
            </ngx-charts-bar-vertical>
          </mat-card-content>
        </mat-card>

        <!-- Progression des projets -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Progression des projets</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <ngx-charts-line-chart
              [results]="progressionProjets"
              [gradient]="true"
              [xAxis]="true"
              [yAxis]="true"
              [legend]="true"
              [showXAxisLabel]="true"
              [showYAxisLabel]="true"
              [xAxisLabel]="'Mois'"
              [yAxisLabel]="'Nombre de projets'"
              [view]="[500, 300]">
            </ngx-charts-line-chart>
          </mat-card-content>
        </mat-card>

        <!-- Budget par zone -->
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Budget par zone</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <ngx-charts-bar-horizontal
              [results]="budgetParZone"
              [gradient]="true"
              [xAxis]="true"
              [yAxis]="true"
              [legend]="false"
              [showXAxisLabel]="true"
              [showYAxisLabel]="true"
              [xAxisLabel]="'Budget (DH)'"
              [yAxisLabel]="'Zone'"
              [view]="[500, 300]">
            </ngx-charts-bar-horizontal>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .stat-card {
      background: linear-gradient(45deg, #2196F3, #1976D2);
      color: white;
    }

    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      padding: 20px;
    }

    .stat-icon {
      margin-right: 20px;
    }

    .stat-icon mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
    }

    .stat-info h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 400;
    }

    .stat-number {
      margin: 5px 0 0 0;
      font-size: 24px;
      font-weight: 500;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
      gap: 20px;
    }

    .chart-card {
      margin-bottom: 20px;
    }

    .chart-card mat-card-header {
      padding: 16px;
      border-bottom: 1px solid #eee;
    }

    .chart-card mat-card-content {
      padding: 16px;
      display: flex;
      justify-content: center;
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalZones: number = 0;
  totalProjets: number = 0;
  projetsEnCours: number = 0;
  projetsTermines: number = 0;

  // Données pour les graphiques
  projetsParZone: any[] = [];
  statutProjets: any[] = [];
  progressionProjets: any[] = [];
  budgetParZone: any[] = [];

  constructor(
    private zoneService: ZoneService,
    private projetService: ProjetService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Charger les zones
    this.zoneService.getAllZones().subscribe(zones => {
      this.totalZones = zones.length;
      this.projetsParZone = zones.map(zone => ({
        name: zone.nom,
        value: zone.projets?.length || 0
      }));
    });

    // Charger les projets
    this.projetService.getAllProjets().subscribe(projets => {
      this.totalProjets = projets.length;
      this.projetsEnCours = projets.filter(p => p.statut === 'EN_COURS').length;
      this.projetsTermines = projets.filter(p => p.statut === 'TERMINE').length;

      // Préparer les données pour le graphique de statut
      this.statutProjets = [
        { name: 'Planifié', value: projets.filter(p => p.statut === 'PLANIFIE').length },
        { name: 'En cours', value: this.projetsEnCours },
        { name: 'Terminé', value: this.projetsTermines },
        { name: 'Suspendu', value: projets.filter(p => p.statut === 'SUSPENDU').length }
      ];

      // Simuler des données de progression (à remplacer par des données réelles)
      this.progressionProjets = [
        {
          name: 'Projets',
          series: [
            { name: 'Jan', value: 5 },
            { name: 'Fév', value: 8 },
            { name: 'Mar', value: 12 },
            { name: 'Avr', value: 15 },
            { name: 'Mai', value: 18 },
            { name: 'Juin', value: 20 }
          ]
        }
      ];

      // Préparer les données pour le graphique de budget
      this.budgetParZone = projets
        .filter(p => p.zone)
        .reduce((acc: any[], projet) => {
          const zoneIndex = acc.findIndex(z => z.name === projet.zone?.nom);
          if (zoneIndex === -1) {
            acc.push({ name: projet.zone?.nom, value: projet.budget || 0 });
          } else {
            acc[zoneIndex].value += projet.budget || 0;
          }
          return acc;
        }, []);
    });
  }
} 