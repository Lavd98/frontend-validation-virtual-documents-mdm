import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../guards/auth.guard';
import { UserComponent } from './user/user.component';
import { DocumentReportComponent } from './document-report/document-report.component';
import { AreaComponent } from './area/area.component';
import { DocumentTypeComponent } from './document-type/document-type.component';
import { DocumentComponent } from './document/document.component';
import { ServiceGuard } from '../guards/service.guard';

const routes: Routes = [
  {
    path: 'consulta',
    component: DocumentReportComponent,
  },
  // {path:'dashboard', component:PagesComponent, canActivate:[authGuard],
  {
    path: 'dashboard',
    component: PagesComponent,

    children: [
      {
        path: '',
        redirectTo: 'documents',
        pathMatch: 'full',
      },
      {
        path: 'documents',
        component: DocumentComponent,
        canActivate: [ServiceGuard],
        data: { titulo: 'Lista de documentos' },
      },
      {
        path: 'document-type',
        component: DocumentTypeComponent,
        canActivate: [ServiceGuard],
        data: { titulo: 'Lista de tipo de documento' },
      },
      {
        path: 'area',
        component: AreaComponent,
        canActivate: [ServiceGuard],
        data: { titulo: 'Lista de areas' },
      },
      {
        path: 'users',
        component: UserComponent,
        canActivate: [ServiceGuard],
        data: { titulo: 'Lista de usuarios' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
