import { Routes, RouterModule } from '@angular/router';
import { PlatformComponent } from './platform/platform.component';
import { LandingComponent } from './landing/landing.component';
import { platformRoutes } from './platform/platform.routes';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [{
  path: '',
  children: [
    {path: 'platform', component: PlatformComponent, children: [...platformRoutes]},
    {path: 'landing/:action', component: LandingComponent},
  ]
}];

export const AppRoutes = RouterModule.forRoot(routes);
