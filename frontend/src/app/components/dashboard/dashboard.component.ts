import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  users: any[] = [];
  roles: any[] = [];
  isLoadingUsers = false;
  isLoadingRoles = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    public themeService: ThemeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

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

  updateUserRole(userId: string, newRole: string): void {
    this.userService.updateUserRole(userId, newRole).subscribe({
      next: (response) => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error updating user role:', error);
      },
    });
  }

  onRoleChange(event: Event, userId: string): void {
    const target = event.target as HTMLSelectElement;
    this.updateUserRole(userId, target.value);
  }

  deactivateUser(userId: string): void {
    if (confirm('Are you sure you want to deactivate this user?')) {
      this.userService.deactivateUser(userId).subscribe({
        next: (response) => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deactivating user:', error);
        },
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
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

  getRoleClass(role: string): string {
    switch (role) {
      case 'Admin':
        return 'role-admin';
      case 'Editor':
        return 'role-editor';
      case 'Viewer':
        return 'role-viewer';
      default:
        return '';
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
