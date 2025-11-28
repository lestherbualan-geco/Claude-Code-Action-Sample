import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  name: string;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users = signal<User[]>([]);
  private currentUser = signal<User | null>(null);
  private isAuthenticated = signal<boolean>(false);

  constructor(private router: Router) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const storedUsers = localStorage.getItem('users');
    const storedCurrentUser = localStorage.getItem('currentUser');

    if (storedUsers) {
      this.users.set(JSON.parse(storedUsers));
    }

    if (storedCurrentUser) {
      this.currentUser.set(JSON.parse(storedCurrentUser));
      this.isAuthenticated.set(true);
    }
  }

  register(name: string, username: string, password: string): { success: boolean; message: string } {
    const existingUser = this.users().find(u => u.username === username);

    if (existingUser) {
      return { success: false, message: 'Username already exists' };
    }

    const newUser: User = { name, username, password };
    const updatedUsers = [...this.users(), newUser];
    this.users.set(updatedUsers);

    localStorage.setItem('users', JSON.stringify(updatedUsers));

    return { success: true, message: 'Registration successful' };
  }

  login(username: string, password: string): { success: boolean; message: string } {
    const user = this.users().find(u => u.username === username && u.password === password);

    if (user) {
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, message: 'Login successful' };
    }

    return { success: false, message: 'Invalid username or password' };
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }
}
