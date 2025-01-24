import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AreaService } from '../services/area.service';
import { Area } from '../../interfaces/area.interface';

declare var $: any;

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrl: './area.component.css',
})
export class AreaComponent implements OnInit {
  dataAll: Area[] = [];
  viewOnly: boolean = false;
  filteredData: Area[] = [];
  itemsPage: number = 10;
  currentPage: number = 1;
  searchText: string = '';
  confirmAction: string = '';
  selectedData: Area = {};
  id: string = '';
  filterActive: boolean = true;
  filterInactive: boolean = false;

  @ViewChild('formModal') formModal!: ElementRef;
  @ViewChild('confirmModal') confirmModal!: ElementRef;

  constructor(private areaService: AreaService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.areaService.getActive().subscribe({
      next: (areas) => {
        this.dataAll = areas.data || [];
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
    this.areaService.getInactive().subscribe({
      next: (response) => {
        this.dataAll = response.data || [];
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
    this.filteredData = this.dataAll.filter((data) => {
      const searchStr = `${data.Name} ${data.Abbreviation}`.toLowerCase();
      const matchesSearch = searchStr.includes(this.searchText.toLowerCase());
      return matchesSearch;
    });
  }

  onSearch(event: any): void {
    this.searchText = event.target.value;
    this.filterData();
    this.currentPage = 1;
  }

  getPaginatedAreas(): Area[] {
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

  openForm(data?: Area, viewOnly: boolean = false): void {
    this.id = '';
    this.viewOnly = viewOnly;
    if (data) {
      this.id = data.Id || '';
      this.selectedData = {
        Name: data.Name || '',
        Abbreviation: data.Abbreviation || '',
      };
    } else {
      this.selectedData = {
        Id: '',
        Name: '',
        Abbreviation: '',
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
      this.areaService.put(this.id, this.selectedData).subscribe({
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
      const body: Area = {
        Name: this.selectedData.Name,
        Abbreviation: this.selectedData.Abbreviation,
      };

      this.areaService.post(body).subscribe({
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

  openConfirmModal(action: 'activate' | 'inactivate', data: Area): void {
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
    this.areaService.activateUser(this.id).subscribe({
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
    this.areaService.inactivateUser(this.id).subscribe({
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
