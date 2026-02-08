import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CustomerLoginComponent } from './customer/customer-login.component';
import { CustomerDashboardComponent } from './customer/customer-dashboard.component';
import { ManagerDashboardComponent } from './manager/manager-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'customer-login', component: CustomerLoginComponent },
  { path: 'customer-dashboard', component: CustomerDashboardComponent },
  { path: 'manager', component: ManagerDashboardComponent },
  { path: '**', redirectTo: '' }
];