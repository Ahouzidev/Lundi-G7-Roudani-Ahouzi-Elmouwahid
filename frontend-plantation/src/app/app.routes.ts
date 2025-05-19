import { Routes } from '@angular/router';
import { ProjetDetailsComponent } from './pages/projets/projet-details.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'zones',
    loadComponent: () => import('./pages/zones/zones.component').then(m => m.ZonesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'projets',
    loadComponent: () => import('./pages/projets/projets.component').then(m => m.ProjetsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'projets/:id',
    component: ProjetDetailsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'employes',
    loadComponent: () => import('./pages/employes/employes.component').then(m => m.EmployesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'employes/:id/presences',
    loadComponent: () => import('./pages/presences/presence-calendar.component').then(m => m.PresenceCalendarComponent),
    canActivate: [authGuard]
  },
  {
    path: 'fournisseurs',
    loadComponent: () => import('./pages/fournisseurs/fournisseurs.component').then(m => m.FournisseursComponent),
    canActivate: [authGuard]
  },
  {
    path: 'besoins',
    loadComponent: () => import('./pages/besoins/besoins.component').then(m => m.BesoinsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'vehicules',
    loadComponent: () => import('./pages/vehicules/vehicules.component').then(m => m.VehiculesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'presences',
    loadComponent: () => import('./pages/presences/presences.component').then(m => m.PresencesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'salaires',
    loadComponent: () => import('./pages/salaires/salaires.component').then(m => m.SalairesComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
