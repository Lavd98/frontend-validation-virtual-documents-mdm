import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DocumentTypeService } from '../services/document-type.service';
import { DocumentType } from '../../interfaces/documet-type.interface';

declare var $: any;

@Component({
  selector: 'app-document-type',
  templateUrl: './document-type.component.html',
  styleUrl: './document-type.component.css',
})
export class DocumentTypeComponent implements OnInit {
  dataAll: DocumentType[] = [];
  viewOnly: boolean = false;
  filteredData: DocumentType[] = [];
  itemsPage: number = 10;
  currentPage: number = 1;
  searchText: string = '';
  confirmAction: string = '';
  selectedData: DocumentType = {};
  id: string = '';
  filterActive: boolean = true;
  filterInactive: boolean = false;

  @ViewChild('formModal') formModal!: ElementRef;
  @ViewChild('confirmModal') confirmModal!: ElementRef;

  constructor(private documentTypeService: DocumentTypeService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.documentTypeService.getActive().subscribe({
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
    this.documentTypeService.getInactive().subscribe({
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

  getPaginatedAreas(): DocumentType[] {
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

  openForm(data?: DocumentType, viewOnly: boolean = false): void {
    this.id = '';
    this.viewOnly = viewOnly;
    if (data) {
      this.id = data.Id || '';
      this.selectedData = {
        Name: data.Name || '',
      };
    } else {
      this.selectedData = {
        Id: '',
        Name: '',
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
    if (this.id && this.selectedData) {
      this.documentTypeService.put(this.id, this.selectedData).subscribe({
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
      const body: DocumentType = {
        Name: this.selectedData.Name,
      };

      this.documentTypeService.post(body).subscribe({
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

  openConfirmModal(
    action: 'activate' | 'inactivate',
    data: DocumentType
  ): void {
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
    this.documentTypeService.activateUser(this.id).subscribe({
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
    this.documentTypeService.inactivateUser(this.id).subscribe({
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
}
