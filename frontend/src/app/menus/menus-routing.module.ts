import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenusPage } from './menus.page';

const routes: Routes = [
  {
    path: '',
    component: MenusPage
  },
  {
    path: 'registration',
    loadChildren: () => import('./registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenusPageRoutingModule {}
