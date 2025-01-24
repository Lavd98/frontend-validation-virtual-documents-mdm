import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../../interfaces/user.interface';
import { AreaService } from '../services/area.service';
import { Area } from '../../interfaces/area.interface';

declare var $: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  dataAll: User[] = [];
  dataAreaAll: Area[] = [];
  viewOnly: boolean = false;
  filteredData: User[] = [];
  itemsPage: number = 10;
  currentPage: number = 1;
  searchText: string = '';
  passwordVisible: boolean = false;
  confirmAction: string = '';
  selectedData: User = {};
  id: string = '';
  filterActive: boolean = true;
  filterInactive: boolean = false;

  @ViewChild('formModal') formModal!: ElementRef;
  @ViewChild('confirmModal') confirmModal!: ElementRef;

  constructor(
    private userService: UserService,
    private areaService: AreaService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.areaData();
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
    this.userService.getActive().subscribe({
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
    this.userService.getInactive().subscribe({
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
      const searchStr =
        `${data.Name} ${data.LastName} ${data.Profile} ${data.Username} ${data?.Area?.Name}`.toLowerCase();
      const matchesSearch = searchStr.includes(this.searchText.toLowerCase());
      return matchesSearch;
    });
  }

  onSearch(event: any): void {
    this.searchText = event.target.value;
    this.filterData();
    this.currentPage = 1;
  }

  getPaginatedAreas(): User[] {
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

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  openForm(data?: User, viewOnly: boolean = false): void {
    this.id = '';
    this.viewOnly = viewOnly;
    debugger;
    if (data) {
      this.id = data.Id || '';
      this.selectedData = {
        Username: data.Username || '',
        Name: data.Name || '',
        LastName: data.LastName || '',
        Password: data.Password || '',
        Profile: data.Profile || '',
        AreaId: data.Area?.Id || '',
      };
    } else {
      this.selectedData = {
        Username: '',
        Name: '',
        LastName: '',
        Password: '',
        Profile: '',
        AreaId: '',
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
      if (this.selectedData.Password === '') {
        delete this.selectedData.Password;
      }
      this.userService.put(this.id, this.selectedData).subscribe({
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
      const body: User = {
        Name: this.selectedData.Name,
        LastName: this.selectedData.LastName,
        Profile: this.selectedData.Profile,
        Username: this.selectedData.Username,
        Password: this.selectedData.Password,
        AreaId: this.selectedData.AreaId,
      };

      this.userService.post(body).subscribe({
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

  openConfirmModal(action: 'activate' | 'inactivate', data: User): void {
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
    this.userService.activateUser(this.id).subscribe({
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
    this.userService.inactivateUser(this.id).subscribe({
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
