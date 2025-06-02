import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { EmployeService, Employe } from '../../services/employe.service';
import { EmployeDialogComponent } from './employe-dialog.component';

@Component({
  selector: 'app-employes',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatPaginatorModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-content>
          <div class="header">
            <div class="header-content">
              <button mat-raised-button color="primary" (click)="openEmployeDialog()" class="small-button">
                <mat-icon>add</mat-icon>
                Nouvel Employé
              </button>
            </div>
          </div>

          <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">
            <ng-container matColumnDef="nom">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let employe">{{employe.nom}}</td>
            </ng-container>

            <ng-container matColumnDef="prenom">
              <th mat-header-cell *matHeaderCellDef>Prénom</th>
              <td mat-cell *matCellDef="let employe">{{employe.prenom}}</td>
            </ng-container>

            <ng-container matColumnDef="fonction">
              <th mat-header-cell *matHeaderCellDef>Fonction</th>
              <td mat-cell *matCellDef="let employe">{{employe.fonction}}</td>
            </ng-container>

            <ng-container matColumnDef="dateEmbauche">
              <th mat-header-cell *matHeaderCellDef>Date d'embauche</th>
              <td mat-cell *matCellDef="let employe">{{employe.dateEmbauche | date}}</td>
            </ng-container>

            <ng-container matColumnDef="numeroTelephone">
              <th mat-header-cell *matHeaderCellDef>Téléphone</th>
              <td mat-cell *matCellDef="let employe">{{employe.numeroTelephone}}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let employe">{{employe.email}}</td>
            </ng-container>

            <ng-container matColumnDef="tauxJournalier">
              <th mat-header-cell *matHeaderCellDef>Taux journalier</th>
              <td mat-cell *matCellDef="let employe">{{employe.tauxJournalier | currency:'DH '}}</td>
            </ng-container>

            <ng-container matColumnDef="projet">
              <th mat-header-cell *matHeaderCellDef>Projet</th>
              <td mat-cell *matCellDef="let employe">{{employe.projet?.nom || '-'}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let employe">
                <div class="action-buttons">
                  <button mat-icon-button color="primary" (click)="openEmployeDialog(employe)" matTooltip="Modifier">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="deleteEmploye(employe)" matTooltip="Supprimer">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
          <mat-paginator [pageSize]="5" [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of employes"></mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
    .header {
      margin-bottom: 20px;
    }
    .header-content {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .small-button {
      min-width: auto;
      padding: 0 16px;
      height: 36px;
      line-height: 36px;
    }
    table {
      width: 100%;
    }
    .mat-column-actions {
      width: 120px;
      text-align: center;
      padding: 0;
    }
    .action-buttons {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
    }
    .action-buttons button {
      width: 36px;
      height: 36px;
      line-height: 36px;
      padding: 0;
    }
    .action-buttons mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      line-height: 20px;
    }
    mat-card {
      margin-bottom: 20px;
    }
    mat-card-content {
      padding: 20px;
    }
    td.mat-cell {
      text-align: center;
      padding: 0 8px;
    }
    th.mat-header-cell {
      text-align: center;
      padding: 0 8px;
    }
    .mat-column-actions .mat-cell {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  `]
})
export class EmployesComponent implements OnInit {
  dataSource = new MatTableDataSource<Employe>([]);
  displayedColumns = ['nom', 'prenom', 'fonction', 'dateEmbauche', 'numeroTelephone', 'email', 'tauxJournalier', 'projet', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private employeService: EmployeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEmployes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadEmployes() {
    this.employeService.getAllEmployes().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des employés:', error);
        this.snackBar.open('Erreur lors du chargement des employés', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  openEmployeDialog(employe?: Employe) {
    const dialogRef = this.dialog.open(EmployeDialogComponent, {
      width: '500px',
      data: { employe }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          // Update existing employee
          this.employeService.updateEmploye(result.id, result).subscribe({
            next: () => {
              this.loadEmployes();
              this.snackBar.open('Employé modifié avec succès', 'Fermer', {
                duration: 3000
              });
            },
            error: (error) => {
              console.error('Erreur lors de la modification de l\'employé:', error);
              this.snackBar.open('Erreur lors de la modification de l\'employé', 'Fermer', {
                duration: 3000
              });
            }
          });
        } else {
          // Create new employee
          this.employeService.createEmploye(result).subscribe({
            next: () => {
              this.loadEmployes();
              this.snackBar.open('Employé créé avec succès', 'Fermer', {
                duration: 3000
              });
            },
            error: (error) => {
              console.error('Erreur lors de la création de l\'employé:', error);
              this.snackBar.open('Erreur lors de la création de l\'employé', 'Fermer', {
                duration: 3000
              });
            }
          });
        }
      }
    });
  }

  deleteEmploye(employe: Employe) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      this.employeService.deleteEmploye(employe.id!).subscribe({
        next: () => {
          this.loadEmployes();
          this.snackBar.open('Employé supprimé avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          this.snackBar.open('Erreur lors de la suppression de l\'employé', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }

  viewPresences(employe: Employe): void {
    if (employe.id) {
      this.router.navigate(['/employes', employe.id, 'presences']);
    }
  }
} 