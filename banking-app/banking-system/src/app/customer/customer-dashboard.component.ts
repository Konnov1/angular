import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, Account, Transaction } from '../app.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard-container">
      <!-- Шапка дашборда -->
      <div class="dashboard-header">
        <div class="header-top">
          <div class="user-info">
            <div class="user-avatar">👤</div>
            <div>
              <h2>Личный кабинет</h2>
              <p class="user-greeting">Добро пожаловать, {{currentUser?.name}}!</p>
            </div>
          </div>
          <div class="header-actions">
            <button class="btn-support">
              <span class="btn-icon">💬</span>
              <span>Поддержка</span>
            </button>
            <button class="btn-notifications">
              <span class="btn-icon">🔔</span>
              <span class="badge">3</span>
            </button>
          </div>
        </div>
        
        <!-- Карточки с балансом -->
        <div class="balance-cards">
          <div class="balance-card">
            <div class="card-icon">💰</div>
            <div class="card-content">
              <h4>Текущий баланс</h4>
              <div class="balance-amount">{{currentAccount?.balance}} ₽</div>
              <p class="card-subtitle">Доступно для операций</p>
            </div>
          </div>
          <div class="balance-card secondary">
            <div class="card-icon">💳</div>
            <div class="card-content">
              <h4>Номер счёта</h4>
              <div class="account-number">{{currentAccount?.accountNumber}}</div>
              <p class="card-subtitle">Основной счёт</p>
            </div>
          </div>
          <div class="balance-card accent">
            <div class="card-icon">📈</div>
            <div class="card-content">
              <h4>История операций</h4>
              <div class="transactions-count">{{currentAccount?.transactions?.length || 0}} операций</div>
              <p class="card-subtitle">За всё время</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Основной контент -->
      <div class="dashboard-content">
        <!-- Боковая панель -->
        <div class="sidebar">
          <div class="nav-section">
            <h4 class="nav-title">💼 Операции</h4>
            <button 
              class="nav-btn" 
              [class.active]="activeTab === 'deposit'"
              (click)="setActiveTab('deposit')">
              <span class="nav-icon">⬇️</span>
              <span>Пополнение</span>
            </button>
            <button 
              class="nav-btn" 
              [class.active]="activeTab === 'withdraw'"
              (click)="setActiveTab('withdraw')">
              <span class="nav-icon">⬆️</span>
              <span>Снятие</span>
            </button>
            <button 
              class="nav-btn" 
              [class.active]="activeTab === 'transactions'"
              (click)="setActiveTab('transactions')">
              <span class="nav-icon">📋</span>
              <span>История</span>
            </button>
          </div>
          
          <div class="quick-actions">
            <h4 class="nav-title">⚡ Быстрые действия</h4>
            <button class="quick-btn" (click)="depositAmount = 1000; setActiveTab('deposit')">
              <span>+1,000 ₽</span>
            </button>
            <button class="quick-btn" (click)="withdrawAmount = 500; setActiveTab('withdraw')">
              <span>-500 ₽</span>
            </button>
          </div>
          
          <div class="security-card">
            <div class="security-icon">🛡️</div>
            <h5>Безопасный сеанс</h5>
            <p>Ваш сеанс защищён</p>
            <div class="security-status active"></div>
          </div>
        </div>
        
        <!-- Основная область -->
        <div class="main-area">
          <!-- Пополнение -->
          <div *ngIf="activeTab === 'deposit'" class="operation-card">
            <div class="operation-header">
              <h3>💵 Пополнение счёта</h3>
              <p class="operation-subtitle">Внесите средства на ваш счёт</p>
            </div>
            
            <div class="amount-input">
              <div class="input-label">
                <span class="label-icon">💎</span>
                Сумма пополнения:
              </div>
              <div class="input-wrapper">
                <span class="currency-symbol">₽</span>
                <input 
                  type="number" 
                  [(ngModel)]="depositAmount"
                  min="0"
                  step="100"
                  class="amount-field"
                  placeholder="Введите сумму">
              </div>
              
              <div class="quick-amounts">
                <button class="amount-btn" (click)="depositAmount = 500">500 ₽</button>
                <button class="amount-btn" (click)="depositAmount = 1000">1,000 ₽</button>
                <button class="amount-btn" (click)="depositAmount = 5000">5,000 ₽</button>
                <button class="amount-btn" (click)="depositAmount = 10000">10,000 ₽</button>
              </div>
            </div>
            
            <div class="operation-info">
              <div class="info-item">
                <span class="info-label">Комиссия:</span>
                <span class="info-value">0 ₽</span>
              </div>
              <div class="info-item">
                <span class="info-label">Итого к зачислению:</span>
                <span class="info-value total">{{depositAmount}} ₽</span>
              </div>
            </div>
            
            <div class="operation-actions">
              <button 
                class="btn-confirm"
                (click)="makeDeposit()"
                [disabled]="depositAmount <= 0">
                <span class="btn-icon">✅</span>
                <span>Подтвердить пополнение</span>
              </button>
              <button class="btn-cancel" (click)="resetForm()">
                <span class="btn-icon">↩️</span>
                <span>Отмена</span>
              </button>
            </div>
            
            <div *ngIf="depositMessage" class="message" [class.success]="depositSuccess" [class.error]="!depositSuccess">
              <span class="message-icon">{{depositSuccess ? '✅' : '❌'}}</span>
              {{depositMessage}}
            </div>
          </div>
          
          <!-- Снятие -->
          <div *ngIf="activeTab === 'withdraw'" class="operation-card">
            <div class="operation-header">
              <h3>💸 Снятие средств</h3>
              <p class="operation-subtitle">Выведите средства с вашего счёта</p>
            </div>
            
            <div class="amount-input">
              <div class="input-label">
                <span class="label-icon">💎</span>
                Сумма снятия:
              </div>
              <div class="input-wrapper">
                <span class="currency-symbol">₽</span>
                <input 
                  type="number" 
                  [(ngModel)]="withdrawAmount"
                  min="0"
                  step="100"
                  class="amount-field"
                  placeholder="Введите сумму"
                  [attr.max]="currentAccount?.balance || 0">
              </div>
              
              <div class="balance-info">
                <p>Доступно для снятия: <strong>{{currentAccount?.balance}} ₽</strong></p>
                <div class="balance-bar">
                  <div class="balance-fill" [style.width.%]="getWithdrawPercentage()"></div>
                </div>
              </div>
            </div>
            
            <div class="operation-info">
              <div class="info-item">
                <span class="info-label">Комиссия:</span>
                <span class="info-value">0 ₽</span>
              </div>
              <div class="info-item">
                <span class="info-label">Итого к снятию:</span>
                <span class="info-value total">{{withdrawAmount}} ₽</span>
              </div>
              <div class="info-item warning" *ngIf="withdrawAmount > (currentAccount?.balance || 0)">
                <span class="info-label">⚠️ Недостаточно средств:</span>
                <span class="info-value">не хватает {{withdrawAmount - (currentAccount?.balance || 0)}} ₽</span>
              </div>
            </div>
            
            <div class="operation-actions">
              <button 
                class="btn-confirm"
                (click)="makeWithdrawal()"
                [disabled]="withdrawAmount <= 0 || withdrawAmount > (currentAccount?.balance || 0)">
                <span class="btn-icon">✅</span>
                <span>Подтвердить снятие</span>
              </button>
              <button class="btn-cancel" (click)="resetForm()">
                <span class="btn-icon">↩️</span>
                <span>Отмена</span>
              </button>
            </div>
            
            <div *ngIf="withdrawMessage" class="message" [class.success]="withdrawSuccess" [class.error]="!withdrawSuccess">
              <span class="message-icon">{{withdrawSuccess ? '✅' : '❌'}}</span>
              {{withdrawMessage}}
            </div>
          </div>
          
          <!-- История -->
          <div *ngIf="activeTab === 'transactions'" class="history-card">
            <div class="history-header">
              <h3>📊 История операций</h3>
              <div class="history-controls">
                <select [(ngModel)]="filterType" class="filter-select">
                  <option value="all">Все операции</option>
                  <option value="deposit">Только пополнения</option>
                  <option value="withdrawal">Только снятия</option>
                </select>
                <button class="btn-refresh" (click)="refreshTransactions()">
                  <span class="refresh-icon">🔄</span>
                  Обновить
                </button>
              </div>
            </div>
            
            <div *ngIf="filteredTransactions.length === 0" class="no-transactions">
              <div class="empty-state">
                <div class="empty-icon">📭</div>
                <h4>Операций не найдено</h4>
                <p>Здесь будет отображаться история ваших операций</p>
              </div>
            </div>
            
            <div *ngIf="filteredTransactions.length > 0" class="transactions-list">
              <div class="transaction-item" *ngFor="let transaction of filteredTransactions">
                <div class="transaction-icon" [class.deposit]="transaction.type === 'deposit'" [class.withdrawal]="transaction.type === 'withdrawal'">
                  {{transaction.type === 'deposit' ? '⬇️' : '⬆️'}}
                </div>
                <div class="transaction-details">
                  <div class="transaction-main">
                    <h5>{{transaction.description}}</h5>
                    <div class="transaction-meta">
                      <span class="transaction-date">{{transaction.date | date:'dd.MM.yyyy HH:mm'}}</span>
                      <span class="transaction-id">#{{transaction.id}}</span>
                    </div>
                  </div>
                  <div class="transaction-amount" [class.deposit]="transaction.type === 'deposit'" [class.withdrawal]="transaction.type === 'withdrawal'">
                    {{transaction.type === 'deposit' ? '+' : '-'}}{{transaction.amount}} ₽
                  </div>
                </div>
              </div>
            </div>
            
            <div class="history-summary">
              <div class="summary-card">
                <h5>Общие пополнения</h5>
                <div class="summary-amount positive">{{totalDeposits}} ₽</div>
              </div>
              <div class="summary-card">
                <h5>Общие снятия</h5>
                <div class="summary-amount negative">{{totalWithdrawals}} ₽</div>
              </div>
              <div class="summary-card">
                <h5>Изменение баланса</h5>
                <div class="summary-amount" [class.positive]="netChange >= 0" [class.negative]="netChange < 0">
                  {{netChange >= 0 ? '+' : ''}}{{netChange}} ₽
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
    }
    
    /* Шапка дашборда */
    .dashboard-header {
      background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
      border-radius: 24px;
      padding: 2.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 20px 60px rgba(0,0,0,0.1);
      color: white;
    }
    
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 3rem;
    }
    
    .user-info {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }
    
    .user-avatar {
      width: 80px;
      height: 80px;
      background: rgba(255,255,255,0.2);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      backdrop-filter: blur(10px);
    }
    
    .user-info h2 {
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 700;
    }
    
    .user-greeting {
      margin: 0;
      opacity: 0.9;
      font-size: 1.1rem;
    }
    
    .header-actions {
      display: flex;
      gap: 1rem;
    }
    
    .btn-support, .btn-notifications {
      padding: 0.8rem 1.5rem;
      background: rgba(255,255,255,0.1);
      border: 2px solid rgba(255,255,255,0.2);
      color: white;
      border-radius: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      font-weight: 500;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }
    
    .btn-support:hover {
      background: rgba(255,255,255,0.2);
      transform: translateY(-2px);
    }
    
    .btn-notifications {
      position: relative;
      padding: 0.8rem;
    }
    
    .badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: #ff6b6b;
      color: white;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
    
    /* Карточки баланса */
    .balance-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    
    .balance-card {
      background: rgba(255,255,255,0.1);
      border-radius: 20px;
      padding: 1.8rem;
      display: flex;
      gap: 1.5rem;
      align-items: center;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
    }
    
    .balance-card.secondary {
      background: rgba(46, 204, 113, 0.2);
      border-color: rgba(46, 204, 113, 0.3);
    }
    
    .balance-card.accent {
      background: rgba(155, 89, 182, 0.2);
      border-color: rgba(155, 89, 182, 0.3);
    }
    
    .card-icon {
      width: 70px;
      height: 70px;
      background: rgba(255,255,255,0.2);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
    }
    
    .card-content h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      opacity: 0.9;
      font-weight: 500;
    }
    
    .balance-amount {
      font-size: 2.2rem;
      font-weight: 800;
      margin: 0 0 0.3rem 0;
    }
    
    .account-number {
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0 0 0.3rem 0;
      font-family: 'Courier New', monospace;
    }
    
    .transactions-count {
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0 0 0.3rem 0;
    }
    
    .card-subtitle {
      margin: 0;
      opacity: 0.8;
      font-size: 0.95rem;
    }
    
    /* Основной контент */
    .dashboard-content {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 2rem;
    }
    
    /* Боковая панель */
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .nav-section {
      background: white;
      border-radius: 20px;
      padding: 1.8rem;
      box-shadow: 0 10px 40px rgba(0,0,0,0.05);
    }
    
    .nav-title {
      font-size: 1.1rem;
      color: #7f8c8d;
      margin: 0 0 1.2rem 0;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .nav-btn {
      width: 100%;
      padding: 1.2rem 1.5rem;
      background: none;
      border: none;
      border-radius: 16px;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 1.1rem;
      color: #2c3e50;
      font-weight: 500;
      transition: all 0.3s ease;
      margin-bottom: 0.5rem;
    }
    
    .nav-btn:hover {
      background: #f8f9fa;
      transform: translateX(5px);
    }
    
    .nav-btn.active {
      background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
      color: white;
      box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
    }
    
    .nav-icon {
      font-size: 1.3rem;
    }
    
    .quick-actions {
      background: white;
      border-radius: 20px;
      padding: 1.8rem;
      box-shadow: 0 10px 40px rgba(0,0,0,0.05);
    }
    
    .quick-btn {
      width: 100%;
      padding: 1rem;
      background: #f8f9fa;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      cursor: pointer;
      font-size: 1.1rem;
      font-weight: 600;
      color: #2c3e50;
      transition: all 0.3s ease;
      margin-bottom: 0.8rem;
    }
    
    .quick-btn:hover {
      background: #e9ecef;
      transform: translateY(-2px);
      border-color: #3498db;
    }
    
    .security-card {
      background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
      border-radius: 20px;
      padding: 1.8rem;
      color: white;
      position: relative;
    }
    
    .security-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .security-card h5 {
      margin: 0 0 0.5rem 0;
      font-size: 1.3rem;
    }
    
    .security-card p {
      margin: 0 0 1rem 0;
      opacity: 0.9;
    }
    
    .security-status {
      width: 12px;
      height: 12px;
      background: #2ecc71;
      border-radius: 50%;
      position: absolute;
      top: 1.8rem;
      right: 1.8rem;
    }
    
    .security-status.active {
      background: #2ecc71;
      box-shadow: 0 0 0 4px rgba(46, 204, 113, 0.3);
    }
    
    /* Основная область */
    .main-area {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .operation-card, .history-card {
      background: white;
      border-radius: 24px;
      padding: 2.5rem;
      box-shadow: 0 15px 50px rgba(0,0,0,0.08);
    }
    
    .operation-header {
      margin-bottom: 2.5rem;
    }
    
    .operation-header h3 {
      font-size: 2rem;
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      font-weight: 700;
    }
    
    .operation-subtitle {
      color: #7f8c8d;
      margin: 0;
      font-size: 1.1rem;
    }
    
    .amount-input {
      margin-bottom: 2.5rem;
    }
    
    .input-label {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      font-size: 1.2rem;
      color: #2c3e50;
      margin-bottom: 1.5rem;
      font-weight: 600;
    }
    
    .label-icon {
      font-size: 1.5rem;
    }
    
    .input-wrapper {
      display: flex;
      align-items: center;
      border: 2px solid #e9ecef;
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s ease;
      margin-bottom: 1.5rem;
    }
    
    .input-wrapper:focus-within {
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }
    
    .currency-symbol {
      padding: 0 1.5rem;
      font-size: 1.8rem;
      font-weight: 700;
      color: #3498db;
      background: #f8f9fa;
      height: 70px;
      display: flex;
      align-items: center;
    }
    
    .amount-field {
      flex: 1;
      padding: 0 1.5rem;
      border: none;
      font-size: 2.5rem;
      font-weight: 700;
      color: #2c3e50;
      min-height: 70px;
    }
    
    .amount-field:focus {
      outline: none;
    }
    
    .amount-field::placeholder {
      color: #bdc3c7;
    }
    
    .quick-amounts {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .amount-btn {
      padding: 0.8rem 1.5rem;
      background: #f8f9fa;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      cursor: pointer;
      font-size: 1.1rem;
      font-weight: 600;
      color: #2c3e50;
      transition: all 0.3s ease;
    }
    
    .amount-btn:hover {
      background: #3498db;
      color: white;
      border-color: #3498db;
      transform: translateY(-2px);
    }
    
    .balance-info {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 16px;
      margin-top: 1.5rem;
    }
    
    .balance-info p {
      margin: 0 0 1rem 0;
      color: #2c3e50;
      font-size: 1.1rem;
    }
    
    .balance-info strong {
      color: #2ecc71;
    }
    
    .balance-bar {
      height: 8px;
      background: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .balance-fill {
      height: 100%;
      background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
      border-radius: 4px;
      transition: width 0.5s ease;
    }
    
    .operation-info {
      background: #f8f9fa;
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 2.5rem;
    }
    
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #e9ecef;
    }
    
    .info-item:last-child {
      border-bottom: none;
    }
    
    .info-label {
      color: #7f8c8d;
      font-weight: 500;
    }
    
    .info-value {
      font-weight: 600;
      color: #2c3e50;
    }
    
    .info-value.total {
      font-size: 1.5rem;
      color: #2ecc71;
    }
    
    .info-item.warning {
      background: #ffeaa7;
      margin: -0.5rem -1.5rem 0;
      padding: 1rem 1.5rem;
      border-radius: 0 0 16px 16px;
    }
    
    .info-item.warning .info-label,
    .info-item.warning .info-value {
      color: #d35400;
    }
    
    .operation-actions {
      display: flex;
      gap: 1.5rem;
    }
    
    .btn-confirm, .btn-cancel {
      flex: 1;
      padding: 1.5rem;
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
    }
    
    .btn-confirm {
      background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
      color: white;
      box-shadow: 0 10px 30px rgba(46, 204, 113, 0.3);
    }
    
    .btn-confirm:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 15px 40px rgba(46, 204, 113, 0.4);
      background: linear-gradient(135deg, #27ae60 0%, #219653 100%);
    }
    
    .btn-confirm:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }
    
    .btn-cancel {
      background: #f8f9fa;
      color: #7f8c8d;
      border: 2px solid #e9ecef;
    }
    
    .btn-cancel:hover {
      background: #e9ecef;
      transform: translateY(-2px);
    }
    
    .message {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      border-radius: 16px;
      margin-top: 2rem;
      font-weight: 500;
      font-size: 1.1rem;
    }
    
    .message.success {
      background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
      color: #155724;
      border: 2px solid #c3e6cb;
    }
    
    .message.error {
      background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
      color: #721c24;
      border: 2px solid #f5c6cb;
    }
    
    .message-icon {
      font-size: 1.5rem;
    }
    
    /* История операций */
    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
    }
    
    .history-header h3 {
      font-size: 2rem;
      color: #2c3e50;
      margin: 0;
      font-weight: 700;
    }
    
    .history-controls {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    
    .filter-select {
      padding: 0.8rem 1.5rem;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      font-size: 1rem;
      background: white;
      cursor: pointer;
    }
    
    .btn-refresh {
      padding: 0.8rem 1.5rem;
      background: #f8f9fa;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      font-weight: 500;
      color: #2c3e50;
      transition: all 0.3s ease;
    }
    
    .btn-refresh:hover {
      background: #e9ecef;
      transform: rotate(45deg);
    }
    
    .refresh-icon {
      transition: transform 0.3s ease;
    }
    
    .btn-refresh:hover .refresh-icon {
      transform: rotate(180deg);
    }
    
    .no-transactions {
      padding: 4rem 2rem;
      text-align: center;
    }
    
    .empty-state {
      max-width: 400px;
      margin: 0 auto;
    }
    
    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.5;
    }
    
    .empty-state h4 {
      font-size: 1.8rem;
      color: #2c3e50;
      margin: 0 0 0.8rem 0;
    }
    
    .empty-state p {
      color: #7f8c8d;
      margin: 0;
      font-size: 1.1rem;
    }
    
    .transactions-list {
      max-height: 500px;
      overflow-y: auto;
      margin-bottom: 2.5rem;
    }
    
    .transaction-item {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem;
      border-bottom: 1px solid #f8f9fa;
      transition: all 0.3s ease;
    }
    
    .transaction-item:hover {
      background: #f8f9fa;
      border-radius: 12px;
    }
    
    .transaction-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.8rem;
    }
    
    .transaction-icon.deposit {
      background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
      color: #155724;
    }
    
    .transaction-icon.withdrawal {
      background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
      color: #721c24;
    }
    
    .transaction-details {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .transaction-main h5 {
      margin: 0 0 0.5rem 0;
      font-size: 1.2rem;
      color: #2c3e50;
    }
    
    .transaction-meta {
      display: flex;
      gap: 1.5rem;
      color: #7f8c8d;
      font-size: 0.95rem;
    }
    
    .transaction-amount {
      font-size: 1.5rem;
      font-weight: 700;
      padding: 0.5rem 1rem;
      border-radius: 8px;
    }
    
    .transaction-amount.deposit {
      color: #2ecc71;
      background: rgba(46, 204, 113, 0.1);
    }
    
    .transaction-amount.withdrawal {
      color: #e74c3c;
      background: rgba(231, 76, 60, 0.1);
    }
    
    .history-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      padding-top: 2rem;
      border-top: 2px solid #f8f9fa;
    }
    
    .summary-card {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 16px;
      text-align: center;
    }
    
    .summary-card h5 {
      margin: 0 0 0.8rem 0;
      color: #7f8c8d;
      font-size: 1rem;
      font-weight: 600;
    }
    
    .summary-amount {
      font-size: 1.8rem;
      font-weight: 800;
    }
    
    .summary-amount.positive {
      color: #2ecc71;
    }
    
    .summary-amount.negative {
      color: #e74c3c;
    }
    
    @media (max-width: 1200px) {
      .dashboard-content {
        grid-template-columns: 1fr;
      }
      
      .sidebar {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      }
      
      .nav-section, .quick-actions {
        margin-bottom: 0;
      }
    }
    
    @media (max-width: 768px) {
      .dashboard-header {
        padding: 1.5rem;
      }
      
      .header-top {
        flex-direction: column;
        gap: 1.5rem;
      }
      
      .balance-cards {
        grid-template-columns: 1fr;
      }
      
      .operation-card, .history-card {
        padding: 1.5rem;
      }
      
      .operation-actions {
        flex-direction: column;
      }
      
      .history-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }
      
      .history-controls {
        width: 100%;
        flex-direction: column;
      }
    }
  `]
})
export class CustomerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  currentAccount: Account | null = null;
  
  activeTab: 'deposit' | 'withdraw' | 'transactions' = 'deposit';
  
  depositAmount: number = 1000;
  withdrawAmount: number = 500;
  
  depositMessage: string = '';
  depositSuccess: boolean = false;
  withdrawMessage: string = '';
  withdrawSuccess: boolean = false;
  
  filterType: string = 'all';
  filteredTransactions: Transaction[] = [];
  
  totalDeposits: number = 0;
  totalWithdrawals: number = 0;
  netChange: number = 0;
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    this.loadUserData();
  }
  
  loadUserData() {
    const savedUser = localStorage.getItem('currentUser');
    
    if (!savedUser) {
      this.router.navigate(['/customer-login']);
      return;
    }
    
    try {
      this.currentUser = JSON.parse(savedUser);
      
      if (!this.currentUser || !this.currentUser.accounts || this.currentUser.accounts.length === 0) {
        this.router.navigate(['/customer-login']);
        return;
      }
      
      this.currentAccount = this.currentUser.accounts[0];
      this.calculateTransactionSummary();
      
    } catch (error) {
      this.router.navigate(['/customer-login']);
    }
  }
  
  setActiveTab(tab: 'deposit' | 'withdraw' | 'transactions') {
    this.activeTab = tab;
    this.resetForm();
    
    if (tab === 'transactions') {
      this.calculateTransactionSummary();
    }
  }
  
  makeDeposit() {
    if (this.depositAmount > 0 && this.currentAccount && this.currentUser) {
      const transaction: Transaction = {
        id: Date.now(),
        type: 'deposit',
        amount: this.depositAmount,
        date: new Date(),
        description: 'Пополнение счёта'
      };
      
      this.currentAccount.balance += this.depositAmount;
      this.currentAccount.transactions.unshift(transaction);
      
      this.saveUserData();
      
      this.depositMessage = `✅ Успешно пополнено ${this.depositAmount} ₽`;
      this.depositSuccess = true;
      
      setTimeout(() => {
        this.depositMessage = '';
        this.depositAmount = 1000;
      }, 3000);
    } else {
      this.depositMessage = '❌ Пожалуйста, введите корректную сумму';
      this.depositSuccess = false;
    }
  }
  
  makeWithdrawal() {
    if (this.withdrawAmount > 0 && this.currentAccount && this.currentUser) {
      if (this.withdrawAmount <= this.currentAccount.balance) {
        const transaction: Transaction = {
          id: Date.now(),
          type: 'withdrawal',
          amount: this.withdrawAmount,
          date: new Date(),
          description: 'Снятие средств'
        };
        
        this.currentAccount.balance -= this.withdrawAmount;
        this.currentAccount.transactions.unshift(transaction);
        
        this.saveUserData();
        
        this.withdrawMessage = `✅ Успешно снято ${this.withdrawAmount} ₽`;
        this.withdrawSuccess = true;
        
        setTimeout(() => {
          this.withdrawMessage = '';
          this.withdrawAmount = 500;
        }, 3000);
      } else {
        this.withdrawMessage = '❌ Недостаточно средств на счёте';
        this.withdrawSuccess = false;
      }
    } else {
      this.withdrawMessage = '❌ Пожалуйста, введите корректную сумму';
      this.withdrawSuccess = false;
    }
  }
  
  getWithdrawPercentage(): number {
    if (!this.currentAccount || this.currentAccount.balance === 0) return 0;
    return Math.min((this.withdrawAmount / this.currentAccount.balance) * 100, 100);
  }
  
  calculateTransactionSummary() {
    if (!this.currentAccount) return;
    
    this.filteredTransactions = this.currentAccount.transactions.filter(t => {
      if (this.filterType === 'all') return true;
      return t.type === this.filterType;
    });
    
    this.totalDeposits = this.currentAccount.transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    this.totalWithdrawals = this.currentAccount.transactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0);
    
    this.netChange = this.totalDeposits - this.totalWithdrawals;
  }
  
  refreshTransactions() {
    this.calculateTransactionSummary();
  }
  
  saveUserData() {
    if (this.currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }
  }
  
  resetForm() {
    this.depositMessage = '';
    this.withdrawMessage = '';
  }
}