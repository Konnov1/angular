import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Интерфейсы
interface Transaction {
  id: number;
  type: 'deposit' | 'withdrawal';
  amount: number;
  date: Date;
  description: string;
}

interface Account {
  id: number;
  accountNumber: string;
  balance: number;
  currency: string;
  transactions: Transaction[];
}

interface User {
  id: number;
  name: string;
  accounts: Account[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="banking-app">
      <!-- Главная страница -->
      <div *ngIf="currentPage === 'home'" class="home-page">
        <header class="header">
          <h1>Global Bank</h1>
          <p>Добро пожаловать в систему онлайн-банкинга</p>
        </header>
        
        <div class="login-options">
          <div class="login-card customer-login" (click)="goToCustomerLogin()">
            <div class="login-icon">👤</div>
            <h3>Customer Login</h3>
            <p>Вход для клиентов</p>
            <button class="btn-login">Login</button>
          </div>
          
          <div class="login-card manager-login" (click)="goToManagerLogin()">
            <div class="login-icon">👔</div>
            <h3>Bank Manager Login</h3>
            <p>Вход для менеджеров</p>
            <button class="btn-login">Login</button>
          </div>
        </div>
        
        <footer class="footer">
          <p>Тестовый банковский проект</p>
          <p>https://www.globalsqa.com/angularJs-protractor/BankingProject</p>
        </footer>
      </div>

      <!-- Страница входа для клиентов -->
      <div *ngIf="currentPage === 'customer-login'" class="login-page">
        <div class="login-container">
          <button class="btn-back" (click)="goToHome()">← Назад</button>
          <h2>Customer Login</h2>
          
          <div class="user-selection">
            <label for="userSelect">Выберите пользователя:</label>
            <select id="userSelect" [(ngModel)]="selectedUserId" class="form-select">
              <option *ngFor="let user of users" [value]="user.id">{{user.name}}</option>
            </select>
          </div>
          
          <button class="btn-primary" (click)="customerLogin()" [disabled]="!selectedUserId">
            Login
          </button>
        </div>
      </div>

      <!-- Личный кабинет клиента -->
      <div *ngIf="currentPage === 'customer-dashboard'" class="customer-dashboard">
        <header class="dashboard-header">
          <button class="btn-back" (click)="logout()">← Logout</button>
          <h2>Welcome {{currentUser?.name}}!</h2>
          <div class="account-info">
            <p>Account: {{currentAccount?.accountNumber}}</p>
            <p class="balance">Balance: {{currentAccount?.balance}} {{currentAccount?.currency}}</p>
          </div>
        </header>

        <div class="dashboard-content">
          <div class="action-buttons">
            <button class="btn-action deposit" (click)="showDeposit = true; showWithdraw = false; showTransactions = false">
              Deposit
            </button>
            <button class="btn-action withdraw" (click)="showWithdraw = true; showDeposit = false; showTransactions = false">
              Withdraw
            </button>
            <button class="btn-action transactions" (click)="showTransactions = true; showDeposit = false; showWithdraw = false">
              Transactions
            </button>
          </div>

          <!-- Форма пополнения -->
          <div *ngIf="showDeposit" class="action-form">
            <h3>Deposit</h3>
            <div class="form-group">
              <label>Amount:</label>
              <input type="number" [(ngModel)]="depositAmount" min="0" class="form-input">
            </div>
            <div class="form-buttons">
              <button class="btn-submit" (click)="makeDeposit()" [disabled]="depositAmount <= 0">
                Deposit
              </button>
              <button class="btn-cancel" (click)="showDeposit = false">Cancel</button>
            </div>
            <div *ngIf="depositMessage" class="message" [class.success]="depositSuccess" [class.error]="!depositSuccess">
              {{depositMessage}}
            </div>
          </div>

          <!-- Форма снятия -->
          <div *ngIf="showWithdraw" class="action-form">
            <h3>Withdraw</h3>
            <div class="form-group">
              <label>Amount:</label>
              <input type="number" [(ngModel)]="withdrawAmount" min="0" class="form-input">
            </div>
            <div class="form-buttons">
              <button class="btn-submit" (click)="makeWithdrawal()" [disabled]="withdrawAmount <= 0 || withdrawAmount > (currentAccount?.balance || 0)">
                Withdraw
              </button>
              <button class="btn-cancel" (click)="showWithdraw = false">Cancel</button>
            </div>
            <div *ngIf="withdrawMessage" class="message" [class.success]="withdrawSuccess" [class.error]="!withdrawSuccess">
              {{withdrawMessage}}
            </div>
          </div>

          <!-- История транзакций -->
          <div *ngIf="showTransactions" class="transactions-history">
            <h3>Transaction History</h3>
            <table class="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let transaction of currentAccount?.transactions">
                  <td>{{transaction.date | date:'short'}}</td>
                  <td>
                    <span [class]="'transaction-type ' + transaction.type">
                      {{transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}}
                    </span>
                  </td>
                  <td [class]="transaction.type === 'deposit' ? 'positive' : 'negative'">
                    {{transaction.type === 'deposit' ? '+' : '-'}}{{transaction.amount}}
                  </td>
                  <td>{{transaction.description}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Панель менеджера -->
      <div *ngIf="currentPage === 'manager-dashboard'" class="manager-dashboard">
        <header class="dashboard-header">
          <button class="btn-back" (click)="logout()">← Logout</button>
          <h2>Bank Manager Dashboard</h2>
        </header>

        <div class="manager-actions">
          <div class="action-card" (click)="showAddCustomer = true">
            <div class="action-icon">➕</div>
            <h3>Add Customer</h3>
            <p>Добавить нового клиента</p>
          </div>
          
          <div class="action-card" (click)="showOpenAccount = true">
            <div class="action-icon">🏦</div>
            <h3>Open Account</h3>
            <p>Открыть счет клиенту</p>
          </div>
          
          <div class="action-card" (click)="showCustomers = true">
            <div class="action-icon">👥</div>
            <h3>Customers</h3>
            <p>Просмотр всех клиентов</p>
          </div>
        </div>

        <!-- Добавление клиента -->
        <div *ngIf="showAddCustomer" class="modal">
          <div class="modal-content">
            <h3>Add New Customer</h3>
            <div class="form-group">
              <label>Customer Name:</label>
              <input type="text" [(ngModel)]="newCustomerName" class="form-input" placeholder="Enter full name">
            </div>
            <div class="modal-buttons">
              <button class="btn-submit" (click)="addCustomer()">Add Customer</button>
              <button class="btn-cancel" (click)="showAddCustomer = false">Cancel</button>
            </div>
            <div *ngIf="customerMessage" class="message">{{customerMessage}}</div>
          </div>
        </div>

        <!-- Открытие счета -->
        <div *ngIf="showOpenAccount" class="modal">
          <div class="modal-content">
            <h3>Open Account for Customer</h3>
            <div class="form-group">
              <label>Select Customer:</label>
              <select [(ngModel)]="selectedCustomerForAccount" class="form-select">
                <option *ngFor="let user of users" [value]="user.id">{{user.name}}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Initial Deposit:</label>
              <input type="number" [(ngModel)]="initialDeposit" min="0" class="form-input">
            </div>
            <div class="modal-buttons">
              <button class="btn-submit" (click)="openAccount()">Open Account</button>
              <button class="btn-cancel" (click)="showOpenAccount = false">Cancel</button>
            </div>
          </div>
        </div>

        <!-- Список клиентов -->
        <div *ngIf="showCustomers" class="modal">
          <div class="modal-content large">
            <h3>Customers List</h3>
            <table class="customers-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Accounts</th>
                  <th>Total Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let user of users">
                  <td>{{user.id}}</td>
                  <td>{{user.name}}</td>
                  <td>
                    <div *ngFor="let account of user.accounts">
                      {{account.accountNumber}} ({{account.balance}} {{account.currency}})
                    </div>
                  </td>
                  <td>{{getTotalBalance(user)}} USD</td>
                </tr>
              </tbody>
            </table>
            <button class="btn-cancel close-btn" (click)="showCustomers = false">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Основные стили */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .banking-app {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    /* Главная страница */
    .home-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      color: white;
    }

    .header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .header h1 {
      font-size: 3.5rem;
      margin-bottom: 1rem;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }

    .header p {
      font-size: 1.2rem;
      opacity: 0.9;
    }

    .login-options {
      display: flex;
      justify-content: center;
      gap: 3rem;
      margin-bottom: 4rem;
    }

    .login-card {
      background: white;
      border-radius: 15px;
      padding: 2rem;
      width: 300px;
      text-align: center;
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      color: #333;
    }

    .login-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }

    .customer-login {
      border-top: 5px solid #4CAF50;
    }

    .manager-login {
      border-top: 5px solid #2196F3;
    }

    .login-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .login-card h3 {
      margin-bottom: 0.5rem;
      color: #333;
    }

    .login-card p {
      color: #666;
      margin-bottom: 1.5rem;
    }

    .btn-login {
      background: #667eea;
      color: white;
      border: none;
      padding: 0.8rem 2rem;
      border-radius: 25px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .btn-login:hover {
      background: #5a67d8;
    }

    .footer {
      text-align: center;
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255,255,255,0.2);
      opacity: 0.8;
    }

    /* Страницы входа */
    .login-page {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }

    .login-container {
      background: white;
      border-radius: 15px;
      padding: 2.5rem;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }

    .btn-back {
      background: none;
      border: none;
      color: #667eea;
      cursor: pointer;
      font-size: 1rem;
      margin-bottom: 1.5rem;
      padding: 0.5rem 1rem;
      border-radius: 5px;
      transition: background 0.3s ease;
    }

    .btn-back:hover {
      background: #f0f0f0;
    }

    .login-container h2 {
      color: #333;
      margin-bottom: 2rem;
      text-align: center;
    }

    .user-selection {
      margin-bottom: 2rem;
    }

    .form-select, .form-input {
      width: 100%;
      padding: 0.8rem;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      margin-top: 0.5rem;
    }

    .form-select:focus, .form-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .btn-primary {
      width: 100%;
      background: #667eea;
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 8px;
      font-size: 1.1rem;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .btn-primary:hover:not(:disabled) {
      background: #5a67d8;
    }

    .btn-primary:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    /* Личный кабинет клиента */
    .customer-dashboard, .manager-dashboard {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      min-height: 100vh;
      background: white;
    }

    .dashboard-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 15px;
      margin-bottom: 2rem;
    }

    .account-info {
      background: rgba(255,255,255,0.1);
      padding: 1rem;
      border-radius: 10px;
      margin-top: 1rem;
    }

    .balance {
      font-size: 1.5rem;
      font-weight: bold;
      margin-top: 0.5rem;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .btn-action {
      flex: 1;
      padding: 1.2rem;
      border: none;
      border-radius: 10px;
      font-size: 1.1rem;
      cursor: pointer;
      transition: transform 0.3s ease;
      color: white;
    }

    .btn-action:hover {
      transform: translateY(-3px);
    }

    .deposit {
      background: #4CAF50;
    }

    .withdraw {
      background: #f44336;
    }

    .transactions {
      background: #2196F3;
    }

    .action-form {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 10px;
      margin-bottom: 2rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
    }

    .form-buttons {
      display: flex;
      gap: 1rem;
    }

    .btn-submit {
      background: #4CAF50;
      color: white;
      border: none;
      padding: 0.8rem 2rem;
      border-radius: 8px;
      cursor: pointer;
      flex: 1;
    }

    .btn-cancel {
      background: #9e9e9e;
      color: white;
      border: none;
      padding: 0.8rem 2rem;
      border-radius: 8px;
      cursor: pointer;
      flex: 1;
    }

    .message {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
    }

    .success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    /* История транзакций */
    .transactions-history {
      background: #f8f9fa;
      padding: 2rem;
      border-radius: 10px;
    }

    .transactions-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .transactions-table th,
    .transactions-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .transactions-table th {
      background: #667eea;
      color: white;
    }

    .transaction-type {
      padding: 0.3rem 0.8rem;
      border-radius: 15px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .transaction-type.deposit {
      background: #d4edda;
      color: #155724;
    }

    .transaction-type.withdrawal {
      background: #f8d7da;
      color: #721c24;
    }

    .positive {
      color: #4CAF50;
      font-weight: bold;
    }

    .negative {
      color: #f44336;
      font-weight: bold;
    }

    /* Панель менеджера */
    .manager-actions {
      display: flex;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .action-card {
      flex: 1;
      background: white;
      border: 2px solid #667eea;
      border-radius: 15px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
    }

    .action-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    /* Модальные окна */
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      padding: 2.5rem;
      border-radius: 15px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-content.large {
      max-width: 800px;
    }

    .modal-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .close-btn {
      margin-top: 1rem;
      width: 100%;
    }

    /* Таблица клиентов */
    .customers-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .customers-table th,
    .customers-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    .customers-table th {
      background: #667eea;
      color: white;
    }

    /* Адаптивность */
    @media (max-width: 768px) {
      .login-options,
      .manager-actions {
        flex-direction: column;
      }
      
      .login-card,
      .action-card {
        width: 100%;
      }
      
      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  // Навигация
  currentPage: 'home' | 'customer-login' | 'customer-dashboard' | 'manager-dashboard' = 'home';
  
  // Данные
  users: User[] = [
    {
      id: 1,
      name: 'Ron Weasly',
      accounts: [
        {
          id: 1,
          accountNumber: 'ACC001',
          balance: 1000,
          currency: 'USD',
          transactions: [
            { id: 1, type: 'deposit', amount: 500, date: new Date('2024-01-01'), description: 'Initial deposit' },
            { id: 2, type: 'withdrawal', amount: 200, date: new Date('2024-01-05'), description: 'ATM withdrawal' }
          ]
        }
      ]
    },
    {
      id: 2,
      name: 'Harry Potter',
      accounts: [
        {
          id: 2,
          accountNumber: 'ACC002',
          balance: 2500,
          currency: 'USD',
          transactions: [
            { id: 3, type: 'deposit', amount: 1000, date: new Date('2024-01-10'), description: 'Salary' }
          ]
        }
      ]
    },
    {
      id: 3,
      name: 'Hermione Granger',
      accounts: [
        {
          id: 3,
          accountNumber: 'ACC003',
          balance: 3000,
          currency: 'USD',
          transactions: [
            { id: 4, type: 'deposit', amount: 500, date: new Date('2024-01-15'), description: 'Transfer' }
          ]
        }
      ]
    }
  ];
  
  // Текущий пользователь
  currentUser: User | null = null;
  currentAccount: Account | null = null;
  
  // Выбор пользователя
  selectedUserId: number | null = 1;
  
  // Формы клиента
  showDeposit = false;
  showWithdraw = false;
  showTransactions = false;
  
  depositAmount = 100;
  withdrawAmount = 50;
  
  depositMessage = '';
  depositSuccess = false;
  withdrawMessage = '';
  withdrawSuccess = false;
  
  // Формы менеджера
  showAddCustomer = false;
  showOpenAccount = false;
  showCustomers = false;
  
  newCustomerName = '';
  selectedCustomerForAccount: number | null = null;
  initialDeposit = 0;
  customerMessage = '';
  
  ngOnInit() {
    // Инициализация
    this.currentAccount = this.users[0].accounts[0];
  }
  
  // Навигация
  goToHome() {
    this.currentPage = 'home';
    this.resetForms();
  }
  
  goToCustomerLogin() {
    this.currentPage = 'customer-login';
  }
  
  goToManagerLogin() {
    this.currentPage = 'manager-dashboard';
  }
  
  // Авторизация клиента
  customerLogin() {
    const user = this.users.find(u => u.id === this.selectedUserId);
    if (user) {
      this.currentUser = user;
      this.currentAccount = user.accounts[0] || null;
      this.currentPage = 'customer-dashboard';
      this.resetForms();
    }
  }
  
  // Выход
  logout() {
    this.currentUser = null;
    this.currentAccount = null;
    this.currentPage = 'home';
    this.resetForms();
  }
  
  // Операции со счетом
  makeDeposit() {
    if (this.depositAmount > 0 && this.currentAccount) {
      const transaction: Transaction = {
        id: Date.now(),
        type: 'deposit',
        amount: this.depositAmount,
        date: new Date(),
        description: 'Deposit'
      };
      
      this.currentAccount.balance += this.depositAmount;
      this.currentAccount.transactions.unshift(transaction);
      
      this.depositMessage = `Successfully deposited ${this.depositAmount} ${this.currentAccount.currency}`;
      this.depositSuccess = true;
      
      // Сброс формы
      setTimeout(() => {
        this.depositMessage = '';
        this.depositAmount = 100;
        this.showDeposit = false;
      }, 2000);
    } else {
      this.depositMessage = 'Please enter a valid amount';
      this.depositSuccess = false;
    }
  }
  
  makeWithdrawal() {
    if (this.withdrawAmount > 0 && this.currentAccount) {
      if (this.withdrawAmount <= this.currentAccount.balance) {
        const transaction: Transaction = {
          id: Date.now(),
          type: 'withdrawal',
          amount: this.withdrawAmount,
          date: new Date(),
          description: 'Withdrawal'
        };
        
        this.currentAccount.balance -= this.withdrawAmount;
        this.currentAccount.transactions.unshift(transaction);
        
        this.withdrawMessage = `Successfully withdrew ${this.withdrawAmount} ${this.currentAccount.currency}`;
        this.withdrawSuccess = true;
        
        // Сброс формы
        setTimeout(() => {
          this.withdrawMessage = '';
          this.withdrawAmount = 50;
          this.showWithdraw = false;
        }, 2000);
      } else {
        this.withdrawMessage = 'Insufficient funds';
        this.withdrawSuccess = false;
      }
    } else {
      this.withdrawMessage = 'Please enter a valid amount';
      this.withdrawSuccess = false;
    }
  }
  
  // Операции менеджера
  addCustomer() {
    if (this.newCustomerName.trim()) {
      const newCustomer: User = {
        id: this.users.length + 1,
        name: this.newCustomerName,
        accounts: []
      };
      
      this.users.push(newCustomer);
      this.customerMessage = `Customer "${this.newCustomerName}" added successfully`;
      
      setTimeout(() => {
        this.showAddCustomer = false;
        this.newCustomerName = '';
        this.customerMessage = '';
      }, 1500);
    }
  }
  
  openAccount() {
    if (this.selectedCustomerForAccount && this.initialDeposit >= 0) {
      const user = this.users.find(u => u.id === this.selectedCustomerForAccount);
      if (user) {
        const newAccount: Account = {
          id: Date.now(),
          accountNumber: `ACC${String(Date.now()).slice(-6)}`,
          balance: this.initialDeposit,
          currency: 'USD',
          transactions: this.initialDeposit > 0 ? [{
            id: Date.now(),
            type: 'deposit',
            amount: this.initialDeposit,
            date: new Date(),
            description: 'Initial deposit'
          }] : []
        };
        
        user.accounts.push(newAccount);
        
        // Сброс формы
        this.showOpenAccount = false;
        this.selectedCustomerForAccount = null;
        this.initialDeposit = 0;
      }
    }
  }
  
  // Вспомогательные методы
  getTotalBalance(user: User): number {
    return user.accounts.reduce((total, account) => total + account.balance, 0);
  }
  
  resetForms() {
    this.showDeposit = false;
    this.showWithdraw = false;
    this.showTransactions = false;
    this.showAddCustomer = false;
    this.showOpenAccount = false;
    this.showCustomers = false;
    
    this.depositAmount = 100;
    this.withdrawAmount = 50;
    this.newCustomerName = '';
    this.initialDeposit = 0;
    
    this.depositMessage = '';
    this.withdrawMessage = '';
    this.customerMessage = '';
  }
}