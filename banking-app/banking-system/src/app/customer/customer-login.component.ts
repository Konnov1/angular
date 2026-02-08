import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../app.component';

@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-container">
        <div class="login-header">
          <button class="btn-back" (click)="goBack()">
            <span class="back-icon">←</span>
            <span>На главную</span>
          </button>
          <div class="header-content">
            <div class="header-icon">👤</div>
            <div>
              <h2>Вход для клиентов</h2>
              <p class="subtitle">Выберите свой счёт для входа в личный кабинет</p>
            </div>
          </div>
        </div>
        
        <div class="login-card">
          <div class="form-section">
            <div class="form-group">
              <label for="customerSelect" class="form-label">
                <span class="label-icon">🔍</span>
                Выберите клиента:
              </label>
              <select 
                id="customerSelect" 
                [(ngModel)]="selectedCustomerId" 
                class="form-select"
                (change)="onCustomerSelect()">
                <option value="">-- Выберите клиента из списка --</option>
                <option *ngFor="let user of users" [value]="user.id">
                  👤 {{user.name}} (Счёт: {{user.accounts[0]?.accountNumber}})
                </option>
              </select>
              <div class="form-hint">
                <span class="hint-icon">💡</span>
                Для демо-тестирования выберите "Рон Уизли"
              </div>
            </div>
            
            <div *ngIf="selectedCustomer" class="account-preview">
              <div class="preview-header">
                <h4>📋 Выбранный счёт</h4>
                <div class="preview-badge">Готов к входу</div>
              </div>
              <div class="preview-content">
                <div class="preview-item">
                  <span class="item-label">Владелец:</span>
                  <span class="item-value">{{selectedCustomer.name}}</span>
                </div>
                <div class="preview-item">
                  <span class="item-label">Номер счёта:</span>
                  <span class="item-value account-number">{{selectedCustomer.accounts[0]?.accountNumber}}</span>
                </div>
                <div class="preview-item">
                  <span class="item-label">Баланс:</span>
                  <span class="item-value balance">{{selectedCustomer.accounts[0]?.balance}} ₽</span>
                </div>
              </div>
            </div>
            
            <button 
              class="btn-login" 
              (click)="login()"
              [disabled]="!selectedCustomerId">
              <span class="btn-icon">🔐</span>
              <span>Войти в систему</span>
              <span class="btn-arrow">→</span>
            </button>
            
            <div *ngIf="errorMessage" class="error-message">
              <span class="error-icon">⚠️</span>
              {{errorMessage}}
            </div>
          </div>
          
          <div class="info-section">
            <div class="info-card">
              <h4>📱 Банк в вашем телефоне</h4>
              <p>Скачайте мобильное приложение для доступа к счетам 24/7</p>
            </div>
            <div class="info-card">
              <h4>🛡️ Безопасность</h4>
              <p>Ваши данные защищены современными технологиями шифрования</p>
            </div>
            <div class="info-card">
              <h4>⏱️ Круглосуточная поддержка</h4>
              <p>Наша служба поддержки готова помочь в любое время</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    
    .login-container {
      width: 100%;
      max-width: 1200px;
    }
    
    .login-header {
      margin-bottom: 2.5rem;
    }
    
    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      color: #7f8c8d;
      cursor: pointer;
      padding: 0.8rem 1rem;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.3s ease;
      margin-bottom: 1.5rem;
    }
    
    .btn-back:hover {
      background: rgba(52, 152, 219, 0.1);
      color: #3498db;
      transform: translateX(-5px);
    }
    
    .back-icon {
      font-size: 1.2rem;
      font-weight: bold;
    }
    
    .header-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    
    .header-icon {
      font-size: 4rem;
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #3498db15 0%, #2ecc7115 100%);
      border-radius: 24px;
      color: #3498db;
    }
    
    .header-content h2 {
      font-size: 2.5rem;
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      font-weight: 700;
    }
    
    .subtitle {
      font-size: 1.2rem;
      color: #7f8c8d;
      margin: 0;
    }
    
    .login-card {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      background: white;
      border-radius: 28px;
      padding: 3rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.08);
      border: 1px solid rgba(0,0,0,0.05);
    }
    
    .form-section {
      padding-right: 2rem;
      border-right: 2px solid #f8f9fa;
    }
    
    .form-group {
      margin-bottom: 2.5rem;
    }
    
    .form-label {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      font-size: 1.1rem;
      color: #2c3e50;
      margin-bottom: 1rem;
      font-weight: 600;
    }
    
    .label-icon {
      font-size: 1.3rem;
    }
    
    .form-select {
      width: 100%;
      padding: 1.2rem 1.5rem;
      border: 2px solid #e9ecef;
      border-radius: 16px;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      background: white;
      appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237f8c8d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 1.5rem center;
      background-size: 1.2em;
    }
    
    .form-select:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }
    
    .form-hint {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-top: 1rem;
      padding: 1rem 1.2rem;
      background: linear-gradient(135deg, #fff8e1 0%, #ffeaa7 100%);
      border-radius: 12px;
      color: #d35400;
      font-size: 0.95rem;
    }
    
    .hint-icon {
      font-size: 1.2rem;
    }
    
    .account-preview {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 20px;
      padding: 2rem;
      margin-bottom: 2.5rem;
      border: 2px solid #e9ecef;
    }
    
    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .preview-header h4 {
      font-size: 1.4rem;
      color: #2c3e50;
      margin: 0;
      font-weight: 600;
    }
    
    .preview-badge {
      padding: 0.5rem 1.2rem;
      background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
      color: white;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
    }
    
    .preview-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .preview-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: white;
      border-radius: 12px;
    }
    
    .item-label {
      color: #7f8c8d;
      font-weight: 500;
    }
    
    .item-value {
      font-weight: 600;
      color: #2c3e50;
    }
    
    .account-number {
      color: #3498db;
      font-family: 'Courier New', monospace;
      font-size: 1.1rem;
    }
    
    .balance {
      color: #2ecc71;
      font-size: 1.2rem;
    }
    
    .btn-login {
      width: 100%;
      padding: 1.4rem;
      background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
      color: white;
      border: none;
      border-radius: 16px;
      font-size: 1.2rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      transition: all 0.3s ease;
      box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
    }
    
    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(52, 152, 219, 0.4);
      background: linear-gradient(135deg, #2980b9 0%, #1f639c 100%);
    }
    
    .btn-login:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }
    
    .btn-icon {
      font-size: 1.5rem;
    }
    
    .btn-arrow {
      font-size: 1.5rem;
      transition: transform 0.3s ease;
    }
    
    .btn-login:hover:not(:disabled) .btn-arrow {
      transform: translateX(5px);
    }
    
    .error-message {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 1.5rem;
      padding: 1.2rem 1.5rem;
      background: linear-gradient(135deg, #ff6b6b15 0%, #ee5a5215 100%);
      border: 2px solid #ff6b6b30;
      border-radius: 16px;
      color: #d32f2f;
      font-weight: 500;
    }
    
    .error-icon {
      font-size: 1.5rem;
    }
    
    .info-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .info-card {
      padding: 2rem;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 20px;
      border: 2px solid #e9ecef;
    }
    
    .info-card h4 {
      font-size: 1.3rem;
      color: #2c3e50;
      margin: 0 0 1rem 0;
      font-weight: 600;
    }
    
    .info-card p {
      color: #7f8c8d;
      margin: 0;
      line-height: 1.6;
    }
    
    @media (max-width: 1024px) {
      .login-card {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      
      .form-section {
        padding-right: 0;
        border-right: none;
        border-bottom: 2px solid #f8f9fa;
        padding-bottom: 2rem;
      }
    }
    
    @media (max-width: 768px) {
      .login-container {
        padding: 1rem;
      }
      
      .login-card {
        padding: 2rem;
      }
      
      .header-content {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }
      
      .header-content h2 {
        font-size: 2rem;
      }
      
      .header-icon {
        width: 80px;
        height: 80px;
        font-size: 3rem;
      }
    }
  `]
})
export class CustomerLoginComponent implements OnInit {
  users: User[] = [];
  selectedCustomerId: number | null = null;
  selectedCustomer: User | null = null;
  errorMessage: string = '';
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    this.loadUsers();
  }
  
  loadUsers() {
    this.users = [
      {
        id: 1,
        name: 'Рон Уизли',
        accounts: [
          {
            id: 1,
            accountNumber: 'ACC001',
            balance: 1000,
            currency: '₽',
            transactions: [
              { id: 1, type: 'deposit', amount: 500, date: new Date('2024-01-01'), description: 'Начальный депозит' },
              { id: 2, type: 'withdrawal', amount: 200, date: new Date('2024-01-05'), description: 'Снятие в банкомате' }
            ]
          }
        ]
      },
      {
        id: 2,
        name: 'Гарри Поттер',
        accounts: [
          {
            id: 2,
            accountNumber: 'ACC002',
            balance: 2500,
            currency: '₽',
            transactions: [
              { id: 3, type: 'deposit', amount: 1000, date: new Date('2024-01-10'), description: 'Зарплата' }
            ]
          }
        ]
      },
      {
        id: 3,
        name: 'Гермиона Грейнджер',
        accounts: [
          {
            id: 3,
            accountNumber: 'ACC003',
            balance: 3000,
            currency: '₽',
            transactions: [
              { id: 4, type: 'deposit', amount: 500, date: new Date('2024-01-15'), description: 'Перевод' }
            ]
          }
        ]
      }
    ];
    
    this.selectedCustomerId = 1;
    this.onCustomerSelect();
  }
  
  onCustomerSelect() {
    if (this.selectedCustomerId) {
      this.selectedCustomer = this.users.find(u => u.id === Number(this.selectedCustomerId)) || null;
    } else {
      this.selectedCustomer = null;
    }
  }
  
  goBack() {
    this.router.navigate(['/']);
  }
  
  login() {
    if (this.selectedCustomerId) {
      const user = this.users.find(u => u.id === Number(this.selectedCustomerId));
      
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.router.navigate(['/customer-dashboard']);
      } else {
        this.errorMessage = '❌ Клиент не найден. Пожалуйста, выберите клиента из списка.';
      }
    } else {
      this.errorMessage = '⚠️ Пожалуйста, выберите клиента';
    }
  }
}