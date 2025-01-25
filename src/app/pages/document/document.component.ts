import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Document } from '../../interfaces/documet.interface';
import { DocumentService } from '../services/document.service';
import { LoginData } from '../../interfaces/login.interface';
import { Area } from '../../interfaces/area.interface';
import { AreaService } from '../services/area.service';
import { DocumentTypeService } from '../services/document-type.service';
import { DocumentType } from '../../interfaces/documet-type.interface';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrl: './document.component.css',
})
export class DocumentComponent implements OnInit {
  dataAll: Document[] = [];
  dataAreaAll: Area[] = [];
  dataDocumentTypeAll: DocumentType[] = [];
  viewOnly: boolean = false;
  filteredData: Document[] = [];
  itemsPage: number = 10;
  currentPage: number = 1;
  searchText: string = '';
  confirmAction: string = '';
  selectedData: Document = {};
  selectedFile: File | null = null;
  id: string = '';
  filterActive: boolean = true;
  filterInactive: boolean = false;
  areaId: number = 0;

  @ViewChild('formModal') formModal!: ElementRef;
  @ViewChild('confirmModal') confirmModal!: ElementRef;

  constructor(
    private documentTypeService: DocumentTypeService,
    private documentService: DocumentService,
    private areaService: AreaService,
    private router: Router
  ) {}

  loginData: LoginData = (() => {
    const user = localStorage.getItem('user');
    if (!user) this.router.navigate(['/login']);
    return user ? JSON.parse(user) : { Token: undefined, User: {} };
  })();

  ngOnInit(): void {
    // this.validateToken();
    this.areaId = Number(this.loginData.User.Area?.Id) || 0;
    this.loadData();
    this.areaData();
    this.documentTypeData();
  }

  // validateToken(): void {
  //   this.authService.isTokenValid().subscribe({
  //     next: ({ data }) => {
  //       if (!data.valid && data.expired) {
  //         this.authService.logout();
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error validating token:', err);
  //       return false;
  //     },
  //   });
  // }

  documentTypeData(): void {
    this.documentTypeService.getActive().subscribe({
      next: ({ data }) => {
        this.dataDocumentTypeAll = data || [];
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.toastMessage(
          'Error',
          '',
          'No se pudo cargar los datos',
          'bg-danger'
        );
      },
    });
  }

  areaData(): void {
    this.areaService.getActive().subscribe({
      next: ({ data }) => {
        this.dataAreaAll = data || [];
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.toastMessage(
          'Error',
          '',
          'No se pudo cargar los datos',
          'bg-danger'
        );
      },
    });
  }

  loadData(): void {
    this.documentService.getActive(this.areaId).subscribe({
      next: ({ data }) => {
        this.dataAll = data || [];
        this.filterData();
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.toastMessage(
          'Error',
          '',
          'No se pudo cargar los datos',
          'bg-danger'
        );
      },
    });
  }

  loadDataInactive(): void {
    this.documentService.getInactive(this.areaId).subscribe({
      next: ({ data }) => {
        this.dataAll = data || [];
        this.filterData();
      },
      error: (err) => {
        console.error('Error loading data:', err);
        this.toastMessage(
          'Error',
          '',
          'No se pudo cargar los datos',
          'bg-danger'
        );
      },
    });
  }

  onAreaChange(): void {
    if (!this.areaId) return;
    if (this.filterActive) {
      this.loadData();
    } else {
      this.loadDataInactive();
    }
  }

  filterData(): void {
    this.filteredData = this.dataAll.filter(({ Name }) => {
      const searchStr = `${Name}`.toLowerCase();
      const matchesSearch = searchStr.includes(this.searchText.toLowerCase());
      return matchesSearch;
    });
  }

  onSearch(event: any): void {
    this.searchText = event.target.value;
    this.filterData();
    this.currentPage = 1;
  }

  getPaginatedAreas(): Document[] {
    const startIndex = (this.currentPage - 1) * this.itemsPage;
    const filter = this.filteredData.slice(
      startIndex,
      startIndex + this.itemsPage
    );
    return filter;
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredData.length / this.itemsPage);
  }

  openForm(data?: Document, viewOnly: boolean = false): void {
    this.id = '';
    this.viewOnly = viewOnly;
    if (data) {
      this.id = data.Id || '';
      this.selectedData = {
        Name: data.Name || '',
        VerificationCode: data.VerificationCode || '',
        AreaId: data.AreaId || 0,
        TypeId: data.TypeId || 0,
        YearPublication: data.YearPublication || 0,
        Description: data.Description || '',
        FilePath: data.FilePath || '',
        UserId: data.UserId || 0,
      };
    } else {
      this.selectedData = {
        Id: '',
        Name: '',
        VerificationCode: '',
        AreaId: this.areaId,
        TypeId: 0,
        YearPublication: 0,
        Description: '',
        FilePath: '',
        UserId: Number(this.loginData.User.Id) || 0,
      };
    }

    const modalEl = this.formModal.nativeElement;
    modalEl.style.display = 'block';
    modalEl.classList.add('in');
  }

  closeModal(): void {
    const modalEl = this.formModal.nativeElement;
    modalEl.style.display = 'none';
    modalEl.classList.remove('in');
  }

  saveData(): void {
    const formData = new FormData();
    formData.append('Name', this.selectedData.Name || '');
    formData.append('AreaId', String(this.selectedData.AreaId || 0));
    formData.append('TypeId', String(this.selectedData.TypeId || 0));
    formData.append(
      'YearPublication',
      String(this.selectedData.YearPublication || 0)
    );
    formData.append('Description', this.selectedData.Description || '');
    formData.append('UserId', String(this.selectedData.UserId || 0));
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
    if (this.id && this.selectedData) {
      this.documentService.put(this.id, formData).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
          this.toastMessage(
            'registro actualizado',
            '',
            'El registro ha sido actualizado exitosamente',
            'bg-success'
          );
        },
        error: (err) => {
          this.toastMessage(
            'Error',
            '',
            'No se pudo actualizar el registro',
            'bg-danger'
          );
          console.error('Error updating user:', err);
        },
      });
    } else {
      this.documentService.post(formData).subscribe({
        next: () => {
          this.loadData();
          this.closeModal();
          this.toastMessage(
            'registro creado',
            '',
            'El registro ha sido creado exitosamente',
            'bg-success'
          );
        },
        error: (err) => {
          this.toastMessage(
            'Error',
            '',
            'No se pudo crear el registro',
            'bg-danger'
          );
          console.error('Error creating user:', err);
        },
      });
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  toastMessage(
    title: string,
    subtitle: string,
    body: string,
    className: string
  ): void {
    $(document).Toasts('create', {
      class: className,
      title: title,
      subtitle: subtitle,
      body: body,
      autohide: true,
      delay: 2000,
    });
  }

  openConfirmModal(action: 'activate' | 'inactivate', data: Document): void {
    this.confirmAction = action;
    this.id = data.Id || '';
    const modalEl = this.confirmModal.nativeElement;
    modalEl.style.display = 'block';
    modalEl.classList.add('in');
  }

  closeConfirmModal(): void {
    const modalEl = this.confirmModal.nativeElement;
    modalEl.style.display = 'none';
    modalEl.classList.remove('in');
  }

  confirmActivateData(): void {
    this.documentService.activateUser(this.id).subscribe({
      next: () => {
        this.loadDataInactive();
        this.closeConfirmModal();
        this.toastMessage(
          'registro activado',
          '',
          'El registro ha sido activado exitosamente',
          'bg-success'
        );
      },
      error: (err) => {
        this.toastMessage(
          'Error',
          '',
          'No se pudo activar el registro',
          'bg-danger'
        );
        console.error('Error activating user:', err);
      },
    });
  }

  confirmInactivateData(): void {
    this.documentService.inactivateUser(this.id).subscribe({
      next: () => {
        this.loadData();
        this.closeConfirmModal();
        this.toastMessage(
          'registro inactivado',
          '',
          'El registro ha sido inactivado exitosamente',
          'bg-success'
        );
      },
      error: (err) => {
        this.toastMessage(
          'Error',
          '',
          'No se pudo inactivar el registro',
          'bg-danger'
        );
        console.error('Error inactivating user:', err);
      },
    });
  }

  onFilterActiveChange() {
    if (this.filterActive) {
      this.filterInactive = false;
    }
    this.loadData();
  }

  onFilterInactiveChange() {
    if (this.filterInactive) {
      this.filterActive = false;
    }
    this.loadDataInactive();
  }

  openPdf(url: string = ''): void {
    const urlPath = `file://${url}`;
    window.open(urlPath, '_blank');
  }
}
