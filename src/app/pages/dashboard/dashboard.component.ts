import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginData } from '../../interfaces/login.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  loginData: LoginData = JSON.parse(localStorage.getItem('user') || '{}');
  moduleList: any[] = [];
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {}

  redirect(url: string) {
    this.router.navigate([url]);
  }
}
