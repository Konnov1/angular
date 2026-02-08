import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';

// Интерфейсы данных
export interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal';
  amount: number;
  date: Date;
  description: string;
}

export interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  currency: string;
  transactions: Transaction[];
}

export interface User {
  id: number;
  name: string;
  password?: string;
  accounts: Account[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1>🏦 Global Bank</h1>
        <nav *ngIf="currentUser" class="user-nav">
          <span>Welcome, {{currentUser.name}}!</span>
          <button (click)="logout()" class="btn-logout">Logout</button>
        </nav>
      </header>
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
      <footer class="app-footer">
        <p>Banking System v1.0 | Demo Project</p>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .app-header {
      background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
      color: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .app-header h1 {
      margin: 0;
      font-size: 1.8rem;
    }
    
    .user-nav {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .user-nav span {
      font-weight: 500;
    }
    
    .btn-logout {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }
    
    .btn-logout:hover {
      background: #c0392b;
    }
    
    .app-main {
      flex: 1;
      padding: 2rem;
      background: #f5f7fa;
    }
    
    .app-footer {
      background: #2c3e50;
      color: #ecf0f1;
      text-align: center;
      padding: 1rem;
      font-size: 0.9rem;
    }
  `]
})
export class AppComponent implements OnInit {
  currentUser: User | null = null;
  
  ngOnInit() {
    // Проверяем сохраненного пользователя
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (e) {
        console.error('Error parsing user data:', e);
        localStorage.removeItem('currentUser');
      }
    }
  }
  
  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  }
}