import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { VehiculeService, Vehicule } from '../../services/vehicule.service';
import { VehiculeDialogComponent } from './vehicule-dialog.component';

@Component({
  selector: 'app-vehicules',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Gestion des Véhicules</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="actions">
            <button mat-raised-button color="primary" (click)="openDialog()">
              <mat-icon>add</mat-icon>
              Nouveau Véhicule
            </button>
          </div>
          
          <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
            <!-- Marque Column -->
            <ng-container matColumnDef="marque">
              <th mat-header-cell *matHeaderCellDef>Marque</th>
              <td mat-cell *matCellDef="let element">{{element.marque}}</td>
            </ng-container>

            <!-- Modèle Column -->
            <ng-container matColumnDef="modele">
              <th mat-header-cell *matHeaderCellDef>Modèle</th>
              <td mat-cell *matCellDef="let element">{{element.modele}}</td>
            </ng-container>

            <!-- Immatriculation Column -->
            <ng-container matColumnDef="immatriculation">
              <th mat-header-cell *matHeaderCellDef>Immatriculation</th>
              <td mat-cell *matCellDef="let element">{{element.immatriculation}}</td>
            </ng-container>

            <!-- Type Column -->
            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let element">{{element.type}}</td>
            </ng-container>

            <!-- Projet Column -->
            <ng-container matColumnDef="projet">
              <th mat-header-cell *matHeaderCellDef>Projet</th>
              <td mat-cell *matCellDef="let element">{{element.projet?.nom || '-'}}</td>
            </ng-container>

            <!-- Date d'acquisition Column -->
            <ng-container matColumnDef="dateAcquisition">
              <th mat-header-cell *matHeaderCellDef>Date d'acquisition</th>
              <td mat-cell *matCellDef="let element">{{element.dateAcquisition | date}}</td>
            </ng-container>

            <!-- Kilométrage Column -->
            <ng-container matColumnDef="kilometrage">
              <th mat-header-cell *matHeaderCellDef>Kilométrage</th>
              <td mat-cell *matCellDef="let element">{{element.kilometrage}}</td>
            </ng-container>

            <!-- Statut Column -->
            <ng-container matColumnDef="statut">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let element">{{element.statut}}</td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let element">
                <button mat-icon-button color="primary" (click)="editVehicule(element)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteVehicule(element.id)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          <mat-paginator [pageSize]="5" [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of vehicules"></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .actions {
      margin-bottom: 20px;
    }
    table {
      width: 100%;
    }
    .mat-column-actions {
      width: 120px;
      text-align: center;
    }
  `]
})
export class VehiculesComponent implements OnInit {
  dataSource = new MatTableDataSource<Vehicule>([]);
  displayedColumns: string[] = ['marque', 'modele', 'immatriculation', 'type', 'projet', 'dateAcquisition', 'kilometrage', 'statut', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private vehiculeService: VehiculeService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadVehicules();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadVehicules(): void {
    this.vehiculeService.getAllVehicules().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des véhicules:', error);
      }
    });
  }

  openDialog(vehicule?: Vehicule): void {
    const dialogRef = this.dialog.open(VehiculeDialogComponent, {
      width: '500px',
      data: vehicule
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadVehicules();
      }
    });
  }

  editVehicule(vehicule: Vehicule): void {
    this.openDialog(vehicule);
  }

  deleteVehicule(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      this.vehiculeService.deleteVehicule(id).subscribe({
        next: () => {
          this.loadVehicules();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
        }
      });
    }
  }
} 