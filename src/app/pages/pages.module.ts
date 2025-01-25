import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';

import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ToasterComponent } from './toaster/toaster.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { UserComponent } from './user/user.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DocumentReportComponent } from './document-report/document-report.component';
import { AreaComponent } from './area/area.component';
import { DocumentTypeComponent } from './document-type/document-type.component';
import { DocumentComponent } from './document/document.component';
import { TokenExpiredDialogComponent } from './token-expired-dialog/token-expired-dialog.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ToasterComponent,
    PagesComponent,
    UserComponent,
    DocumentReportComponent,
    AreaComponent,
    DocumentTypeComponent,
    DocumentComponent,
    TokenExpiredDialogComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    SharedModule,
    MatTableModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    FormsModule,
    PdfViewerModule,
  ],
})
export class PagesModule {}
