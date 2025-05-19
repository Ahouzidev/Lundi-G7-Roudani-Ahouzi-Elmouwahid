import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { ZoneService, Zone } from '../../services/zone.service';
import { ZoneDialogComponent } from './zone-dialog.component';
import { ZoneProjetsComponent } from './zone-projets.component';
import { ProjetDialogComponent } from '../projets/projet-dialog.component';

@Component({
  selector: 'app-zones',
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
              <h2>Gestion des zones</h2>
              <div class="button-container">
                <button mat-raised-button color="primary" (click)="openZoneDialog()" class="small-button">
                  <mat-icon>add</mat-icon>
                  Nouvelle Zone
                </button>
              </div>
            </div>
          </div>

          <table mat-table [dataSource]="zones" class="mat-elevation-z8">
            <ng-container matColumnDef="nom">
              <th mat-header-cell *matHeaderCellDef>Nom</th>
              <td mat-cell *matCellDef="let zone">{{zone.nom}}</td>
            </ng-container>

            <ng-container matColumnDef="localisation">
              <th mat-header-cell *matHeaderCellDef>Localisation</th>
              <td mat-cell *matCellDef="let zone">{{zone.localisation}}</td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let zone">{{zone.description}}</td>
            </ng-container>

            <ng-container matColumnDef="projets">
              <th mat-header-cell *matHeaderCellDef>Projets</th>
              <td mat-cell *matCellDef="let zone">{{zone.projets?.length || 0}} projets</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let zone">
                <button mat-icon-button color="primary" (click)="openZoneDialog(zone)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteZone(zone)">
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
    }
    .button-container {
      display: flex;
      justify-content: flex-start;
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
export class ZonesComponent implements OnInit {
  zones: Zone[] = [];
  displayedColumns = ['nom', 'localisation', 'description', 'projets', 'actions'];

  constructor(
    private zoneService: ZoneService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadZones();
  }

  loadZones() {
    this.zoneService.getAllZones().subscribe({
      next: (data) => {
        this.zones = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des zones:', error);
        this.snackBar.open('Erreur lors du chargement des zones', 'Fermer', {
          duration: 3000
        });
      }
    });
  }

  openZoneDialog(zone?: Zone) {
    const dialogRef = this.dialog.open(ZoneDialogComponent, {
      width: '600px',
      data: { zone }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (zone?.id) {
          this.zoneService.updateZone(zone.id, result).subscribe({
            next: () => {
              this.loadZones();
              this.snackBar.open('Zone modifiée avec succès', 'Fermer', {
                duration: 3000
              });
            },
            error: (error) => {
              console.error('Erreur lors de la modification de la zone:', error);
              this.snackBar.open('Erreur lors de la modification de la zone', 'Fermer', {
                duration: 3000
              });
            }
          });
        } else {
          this.zoneService.createZone(result).subscribe({
            next: () => {
              this.loadZones();
              this.snackBar.open('Zone créée avec succès', 'Fermer', {
                duration: 3000
              });
            },
            error: (error) => {
              console.error('Erreur lors de la création de la zone:', error);
              this.snackBar.open('Erreur lors de la création de la zone', 'Fermer', {
                duration: 3000
              });
            }
          });
        }
      }
    });
  }

  openZoneProjets(zone: Zone) {
    const dialogRef = this.dialog.open(ZoneProjetsComponent, {
      width: '800px',
      data: { zone: zone }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.action === 'create') {
          this.openProjetDialog(result.zone);
        } else if (result.action === 'details') {
          this.router.navigate(['/projets', result.projet.id]);
        }
      }
    });
  }

  openProjetDialog(zone: Zone) {
    const dialogRef = this.dialog.open(ProjetDialogComponent, {
      width: '500px',
      data: { zone: zone }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadZones();
      }
    });
  }

  deleteZone(zone: Zone) {
    if (zone.id && confirm('Êtes-vous sûr de vouloir supprimer cette zone ?')) {
      this.zoneService.deleteZone(zone.id).subscribe({
        next: () => {
          this.loadZones();
          this.snackBar.open('Zone supprimée avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la zone:', error);
          this.snackBar.open('Erreur lors de la suppression de la zone', 'Fermer', {
            duration: 3000
          });
        }
      });
    }
  }
} 