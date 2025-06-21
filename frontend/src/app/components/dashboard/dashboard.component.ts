import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ThemeService } from '../../services/theme.service';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { DashboardSidebarComponent } from './components/dashboard-sidebar/dashboard-sidebar.component';
import { StatsCardsComponent } from './components/stats-cards/stats-cards.component';
import { UserTableComponent } from './components/user-table/user-table.component';
import { RolesOverviewComponent } from './components/roles-overview/roles-overview.component';
import { WelcomeCardComponent } from './components/welcome-card/welcome-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DashboardHeaderComponent,
    DashboardSidebarComponent,
    StatsCardsComponent,
    UserTableComponent,
    RolesOverviewComponent,
    WelcomeCardComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  users: any[] = [];
  roles: any[] = [];
  isLoadingUsers = false;
  isLoadingRoles = false;
  stats = {
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    editorUsers: 0,
    viewerUsers: 0,
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    public themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    if (this.isAdmin()) {
      this.loadUsers();
      this.loadRoles();
    }
  }

  loadUsers(): void {
    this.isLoadingUsers = true;
    this.cdr.markForCheck();

    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.users;
        this.calculateStats();
        this.isLoadingUsers = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoadingUsers = false;
        this.cdr.markForCheck();
      },
    });
  }

  loadRoles(): void {
    this.isLoadingRoles = true;
    this.cdr.markForCheck();

    this.userService.getAllRoles().subscribe({
      next: (response) => {
        this.roles = response.roles;
        this.isLoadingRoles = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading roles:', error);
        this.isLoadingRoles = false;
        this.cdr.markForCheck();
      },
    });
  }

  calculateStats(): void {
    this.stats.totalUsers = this.users.length;
    this.stats.activeUsers = this.users.filter(
      (user) => user.status === 'Active'
    ).length;
    this.stats.adminUsers = this.users.filter(
      (user) => user.role === 'Admin'
    ).length;
    this.stats.editorUsers = this.users.filter(
      (user) => user.role === 'Editor'
    ).length;
    this.stats.viewerUsers = this.users.filter(
      (user) => user.role === 'Viewer'
    ).length;
  }

  onUserRoleUpdated(): void {
    this.loadUsers();
  }

  onUserDeactivated(): void {
    this.loadUsers();
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'Admin';
  }

  isEditor(): boolean {
    return this.currentUser?.role === 'Editor';
  }

  isViewer(): boolean {
    return this.currentUser?.role === 'Viewer';
  }
}
