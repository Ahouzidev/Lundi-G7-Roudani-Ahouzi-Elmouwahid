import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
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
    MatCardModule
  ],
  template: `
    <div class="container">
      <mat-card>
        <mat-card-content>
          <div class="header">
            <div class="header-content">
              <h2>Gestion des employés</h2>
              <button mat-raised-button color="primary" (click)="openEmployeDialog()" class="small-button">
                <mat-icon>add</mat-icon>
                Nouvel Employé
              </button>
            </div>
          </div>

          <table mat-table [dataSource]="employes" class="mat-elevation-z8">
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
              <td mat-cell *matCellDef="let employe">{{employe.tauxJournalier | currency}}</td>
            </ng-container>

            <ng-container matColumnDef="projet">
              <th mat-header-cell *matHeaderCellDef>Projet</th>
              <td mat-cell *matCellDef="let employe">{{employe.projet?.nom || '-'}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let employe">
                <button mat-icon-button color="primary" (click)="openEmployeDialog(employe)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="viewPresences(employe)">
                  <mat-icon>event_available</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteEmploye(employe)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
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
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }
    .header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.87);
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
    }
    mat-card {
      margin-bottom: 20px;
    }
    mat-card-content {
      padding: 20px;
    }
  `]
})
export class EmployesComponent implements OnInit {
  employes: Employe[] = [];
  displayedColumns = ['nom', 'prenom', 'fonction', 'dateEmbauche', 'numeroTelephone', 'email', 'tauxJournalier', 'projet', 'actions'];

  constructor(
    private employeService: EmployeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEmployes();
  }

  loadEmployes() {
    this.employeService.getAllEmployes().subscribe({
      next: (data) => {
        this.employes = data;
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
      width: '600px',
      data: employe
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (employe?.id) {
          this.employeService.updateEmploye(employe.id, result).subscribe({
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
    if (employe.id && confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      this.employeService.deleteEmploye(employe.id).subscribe({
        next: () => {
          this.loadEmployes();
          this.snackBar.open('Employé supprimé avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de l\'employé:', error);
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