import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    CommonModule
  ],
  template: `
    <ng-container *ngIf="authService.isAuthenticated()">
      <mat-toolbar color="primary">
        <button mat-icon-button (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <span>Gestion de Plantation</span>
        <span class="toolbar-spacer"></span>
        
        <div class="user-menu">
          <span class="username">{{ authService.getUsername() }}</span>
          <button mat-button class="logout-button" (click)="signOut()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Logout</span>
          </button>
        </div>
      </mat-toolbar>

      <mat-sidenav-container>
        <mat-sidenav #sidenav mode="side">
          <mat-nav-list>
            <a mat-list-item routerLink="/dashboard">
              <mat-icon>dashboard</mat-icon>
              <span>Tableau de bord</span>
            </a>
            <a mat-list-item routerLink="/zones">
              <mat-icon>terrain</mat-icon>
              <span>Zones</span>
            </a>
            <a mat-list-item routerLink="/projets">
              <mat-icon>assignment</mat-icon>
              <span>Projets</span>
            </a>
            <a mat-list-item routerLink="/employes">
              <mat-icon>people</mat-icon>
              <span>Employés</span>
            </a>
            <a mat-list-item routerLink="/fournisseurs">
              <mat-icon>business</mat-icon>
              <span>Fournisseurs</span>
            </a>
            <a mat-list-item routerLink="/besoins">
              <mat-icon>shopping_cart</mat-icon>
              <span>Besoins</span>
            </a>
            <a mat-list-item routerLink="/vehicules">
              <mat-icon>directions_car</mat-icon>
              <span>Véhicules</span>
            </a>
            <a mat-list-item routerLink="/presences">
              <mat-icon>event_note</mat-icon>
              <span>Présences</span>
            </a>
            <a mat-list-item routerLink="/salaires">
              <mat-icon>payments</mat-icon>
              <span>Salaires</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content>
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </ng-container>

    <ng-container *ngIf="!authService.isAuthenticated()">
      <router-outlet></router-outlet>
    </ng-container>
  `,
  styles: [`
    mat-sidenav-container {
      height: calc(100vh - 64px);
    }
    mat-sidenav {
      width: 250px;
    }
    mat-nav-list {
      padding-top: 20px;
    }
    mat-icon {
      margin-right: 10px;
    }
    .toolbar-spacer {
      flex: 1 1 auto;
    }
    .user-menu {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .username {
      font-size: 14px;
      opacity: 0.9;
    }
    .logout-button {
      display: flex;
      align-items: center;
      gap: 8px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      padding: 0 16px;
      height: 36px;
      transition: background-color 0.2s;
    }
    .logout-button:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
    .logout-button mat-icon {
      margin-right: 4px;
    }
  `]
})
export class AppComponent {
  title = 'frontend-plantation';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  signOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
