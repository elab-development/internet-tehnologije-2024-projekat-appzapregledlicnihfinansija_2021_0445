import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  accounts: any[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.apiService.getAccounts().subscribe(data => {
      this.accounts = data;
    });
  }

  viewDetails(accountId: number) {
    this.router.navigate(['/transactions'], { queryParams: { accountId } });
  }
}
