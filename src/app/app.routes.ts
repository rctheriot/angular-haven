import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HavenLoginComponent } from './haven-login/haven-login.component';
import { HavenMainComponent } from './haven-main/haven-main.component';
import { HavenHomeComponent } from './haven-home/haven-home.component';

import { AuthGuard } from './auth-guard.service';

const router: Routes = [
  {
    path: 'login',
    component: HavenLoginComponent
  },
  {
    path: 'main',
    component: HavenMainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: HavenHomeComponent
      },
    ],
  },
  {
    path: '',
    component: HavenLoginComponent
  },
  {
    path: '**',
    component: HavenLoginComponent
  }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
