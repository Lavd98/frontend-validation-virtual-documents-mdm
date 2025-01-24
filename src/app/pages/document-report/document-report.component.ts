import { Component, OnInit, OnDestroy } from '@angular/core';
import { DocumentService } from '../services/document.service';

declare var $: any;

@Component({
  selector: 'app-document-report',
  templateUrl: './document-report.component.html',
  styleUrls: ['./document-report.component.css'],
})
export class DocumentReportComponent implements OnInit, OnDestroy {
  windowWidth: number = 0;
  isWidthMobile: boolean = false;
  documentNumber: string = '';
  documentData: { id: string; fileName: string } = { id: '', fileName: '' };
  error: boolean = false;

  constructor(private documentService: DocumentService) {
    this.updateWindowWidth();
  }

  ngOnInit(): void {
    window.addEventListener('resize', this.updateWindowWidth.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.updateWindowWidth.bind(this));
  }

  searchDocument(): void {
    debugger;
    this.documentService.getDocumentByNumber(this.documentNumber).subscribe(
      (data) => {
        this.documentData = data || { id: '', fileName: '' };
        if (!this.documentData) {
          this.showToast(
            'Error',
            '',
            'No se encontró el documento con el número ingresado',
            'bg-danger'
          );
        }
      },
      () => {
        this.documentData = { id: '', fileName: '' };
        this.showToast(
          'Error',
          '',
          'No se pudo cargar los perfiles',
          'bg-danger'
        );
      }
    );
  }

  showToast(
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

  updateWindowWidth(): void {
    this.windowWidth = window.innerWidth;
    this.isWidthMobile = this.windowWidth <= 900;
  }
}
