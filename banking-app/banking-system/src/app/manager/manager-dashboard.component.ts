import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User, Account, Transaction } from '../app.component';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="manager-container">
      <!-- Шапка панели менеджера -->
      <div class="manager-header">
        <div class="header-content">
          <div class="header-left">
            <div class="manager-icon">👔</div>
            <div>
              <h1>Панель менеджера</h1>
              <p class="subtitle">Управление банковскими операциями</p>
            </div>
          </div>
          <div class="header-right">
            <div class="time-display">
              <span class="time-icon">🕒</span>
              {{currentTime | date:'HH:mm'}}
            </div>
            <button class="btn-logout" (click)="goToHome()">
              <span>На главную</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Навигационные вкладки -->
      <div class="tabs-container">
        <div class="tabs">
          <button 
            class="tab-btn" 
            [class.active]="activeView === 'customers'"
            (click)="setActiveView('customers')">
            <span class="tab-icon">👥</span>
            <span>Клиенты</span>
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeView === 'addCustomer'"
            (click)="setActiveView('addCustomer')">
            <span class="tab-icon">➕</span>
            <span>Добавить клиента</span>
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeView === 'addAccount'"
            (click)="setActiveView('addAccount')">
            <span class="tab-icon">🏦</span>
            <span>Открыть счёт</span>
          </button>
        </div>
      </div>
      
      <!-- Контент вкладок -->
      <div class="content-area">
        <!-- Вкладка клиентов -->
        <div *ngIf="activeView === 'customers'" class="view-content">
          <div class="view-header">
            <h2>👥 Управление клиентами</h2>
            <div class="view-controls">
              <div class="search-box">
                <span class="search-icon">🔍</span>
                <input 
                  type="text" 
                  [(ngModel)]="searchQuery"
                  placeholder="Поиск клиентов..."
                  class="search-input"
                  (input)="filterCustomers()">
              </div>
              <button class="btn-action" (click)="loadCustomers()">
                <span class="btn-icon">🔄</span>
                <span>Обновить</span>
              </button>
            </div>
          </div>
          
          <div *ngIf="filteredCustomers.length === 0" class="empty-state">
            <div class="empty-icon">📭</div>
            <h3>Клиенты не найдены</h3>
            <p>Попробуйте изменить параметры поиска</p>
          </div>
          
          <div *ngIf="filteredCustomers.length > 0" class="customers-grid">
            <div *ngFor="let customer of filteredCustomers" class="customer-card">
              <div class="customer-card-header">
                <div class="customer-avatar">{{customer.name.charAt(0)}}</div>
                <div class="customer-info">
                  <h4>{{customer.name}}</h4>
                  <div class="customer-id">ID: {{customer.id}}</div>
                </div>
                <div class="customer-status active">Активен</div>
              </div>
              
              <div class="customer-accounts">
                <h5>💳 Счета клиента:</h5>
                <div *ngFor="let account of customer.accounts" class="account-card">
                  <div class="account-header">
                    <strong>{{account.accountNumber}}</strong>
                    <span class="account-balance">{{account.balance}} ₽</span>
                  </div>
                  <div class="account-details">
                    <span class="detail">Операций: {{account.transactions.length}}</span>
                    <span class="detail">Валюта: {{account.currency}}</span>
                  </div>
                </div>
              </div>
              
              <div class="customer-stats">
                <div class="stat">
                  <div class="stat-label">Всего счетов:</div>
                  <div class="stat-value">{{customer.accounts.length}}</div>
                </div>
                <div class="stat">
                  <div class="stat-label">Общий баланс:</div>
                  <div class="stat-value">{{getTotalBalance(customer)}} ₽</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Вкладка добавления клиента -->
        <div *ngIf="activeView === 'addCustomer'" class="view-content">
          <div class="view-header">
            <h2>➕ Добавить нового клиента</h2>
            <p class="view-subtitle">Заполните информацию о новом клиенте</p>
          </div>
          
          <form (ngSubmit)="addNewCustomer()" class="form-card">
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">👤</span>
                ФИО клиента:
              </label>
              <input 
                type="text" 
                [(ngModel)]="newCustomer.name"
                name="customerName"
                required
                class="form-input"
                placeholder="Введите полное имя">
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">💰</span>
                  Начальный депозит:
                </label>
                <input 
                  type="number"
                  [(ngModel)]="newCustomer.initialBalance"
                  name="initialBalance"
                  min="0"
                  step="100"
                  class="form-input"
                  placeholder="Сумма в рублях">
              </div>
              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">🌐</span>
                  Валюта счёта:
                </label>
                <select 
                  [(ngModel)]="newCustomer.currency"
                  name="currency"
                  class="form-select">
                  <option value="₽">Рубли (₽)</option>
                  <option value="$">Доллары ($)</option>
                  <option value="€">Евро (€)</option>
                </select>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn-submit" [disabled]="!newCustomer.name">
                <span class="btn-icon">✅</span>
                <span>Создать клиента</span>
              </button>
              <button type="button" class="btn-cancel" (click)="resetNewCustomerForm()">
                <span class="btn-icon">↩️</span>
                <span>Очистить форму</span>
              </button>
            </div>
            
            <div *ngIf="customerMessage" class="message" [class.success]="customerSuccess" [class.error]="!customerSuccess">
              <span class="message-icon">{{customerSuccess ? '✅' : '❌'}}</span>
              {{customerMessage}}
            </div>
          </form>
          
          <div class="info-card">
            <div class="info-icon">💡</div>
            <div class="info-content">
              <h4>Информация:</h4>
              <p>Новый клиент будет создан с начальным счётом. Номер счёта будет сгенерирован автоматически.</p>
            </div>
          </div>
        </div>
        
        <!-- Вкладка открытия счёта -->
        <div *ngIf="activeView === 'addAccount'" class="view-content">
          <div class="view-header">
            <h2>🏦 Открыть новый счёт</h2>
            <p class="view-subtitle">Выберите клиента и параметры нового счёта</p>
          </div>
          
          <form (ngSubmit)="addNewAccount()" class="form-card">
            <div class="form-group">
              <label class="form-label">
                <span class="label-icon">👥</span>
                Выберите клиента:
              </label>
              <select 
                [(ngModel)]="selectedCustomerId"
                name="selectCustomer"
                required
                class="form-select"
                (change)="onCustomerSelect()">
                <option value="">-- Выберите клиента --</option>
                <option *ngFor="let customer of customers" [value]="customer.id">
                  {{customer.name}} (ID: {{customer.id}})
                </option>
              </select>
            </div>
            
            <div *ngIf="selectedCustomer" class="customer-preview">
              <div class="preview-header">
                <h4>📋 Информация о клиенте</h4>
              </div>
              <div class="preview-content">
                <div class="preview-row">
                  <span class="preview-label">Имя:</span>
                  <span class="preview-value">{{selectedCustomer.name}}</span>
                </div>
                <div class="preview-row">
                  <span class="preview-label">Текущие счета:</span>
                  <span class="preview-value">{{selectedCustomer.accounts.length}}</span>
                </div>
                <div class="preview-row">
                  <span class="preview-label">Общий баланс:</span>
                  <span class="preview-value total">{{getTotalBalance(selectedCustomer)}} ₽</span>
                </div>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">💰</span>
                  Начальный взнос:
                </label>
                <input 
                  type="number"
                  [(ngModel)]="newAccount.initialDeposit"
                  name="initialDeposit"
                  min="0"
                  step="100"
                  class="form-input"
                  placeholder="Сумма в рублях">
              </div>
              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">🌐</span>
                  Валюта счёта:
                </label>
                <select 
                  [(ngModel)]="newAccount.currency"
                  name="accountCurrency"
                  class="form-select">
                  <option value="₽">Рубли (₽)</option>
                  <option value="$">Доллары ($)</option>
                  <option value="€">Евро (€)</option>
                </select>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn-submit" [disabled]="!selectedCustomerId || newAccount.initialDeposit < 0">
                <span class="btn-icon">✅</span>
                <span>Открыть счёт</span>
              </button>
              <button type="button" class="btn-cancel" (click)="resetNewAccountForm()">
                <span class="btn-icon">↩️</span>
                <span>Очистить форму</span>
              </button>
            </div>
            
            <div *ngIf="accountMessage" class="message" [class.success]="accountSuccess" [class.error]="!accountSuccess">
              <span class="message-icon">{{accountSuccess ? '✅' : '❌'}}</span>
              {{accountMessage}}
            </div>
          </form>
        </div>
      </div>
      
      <!-- Статистика -->
      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>Всего клиентов</h3>
            <div class="stat-number">{{customers.length}}</div>
            <p class="stat-trend">+2 за месяц</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🏦</div>
          <div class="stat-content">
            <h3>Всего счетов</h3>
            <div class="stat-number">{{getTotalAccounts()}}</div>
            <p class="stat-trend">+5 за месяц</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <h3>Общие активы</h3>
            <div class="stat-number">{{getTotalAssets()}} ₽</div>
            <p class="stat-trend">+250,000 ₽</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .manager-container {
      max-width: 1400px;
      margin: 0 auto;
    }
    
    /* Шапка */
    .manager-header {
      background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
      border-radius: 24px;
      padding: 2.5rem;
      margin-bottom: 2rem;
      color: white;
      box-shadow: 0 20px 60px rgba(0,0,0,0.1);
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    
    .manager-icon {
      width: 80px;
      height: 80px;
      background: rgba(255,255,255,0.2);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      backdrop-filter: blur(10px);
    }
    
    .header-left h1 {
      margin: 0 0 0.5rem 0;
      font-size: 2.5rem;
      font-weight: 800;
    }
    
    .subtitle {
      margin: 0;
      opacity: 0.9;
      font-size: 1.2rem;
    }
    
    .header-right {
      display: flex;
      align-items: center;
      gap: 2rem;
    }
    
    .time-display {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      padding: 0.8rem 1.5rem;
      background: rgba(255,255,255,0.1);
      border-radius: 16px;
      font-size: 1.3rem;
      font-weight: 600;
      backdrop-filter: blur(10px);
    }
    
    .time-icon {
      font-size: 1.5rem;
    }
    
    .btn-logout {
      padding: 0.8rem 2rem;
      background: rgba(255,255,255,0.2);
      border: 2px solid rgba(255,255,255,0.3);
      color: white;
      border-radius: 16px;
      cursor: pointer;
      font-size: 1.1rem;
      font-weight: 600;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }
    
    .btn-logout:hover {
      background: rgba(255,255,255,0.3);
      transform: translateY(-2px);
    }
    
    /* Вкладки */
    .tabs-container {
      background: white;
      border-radius: 20px;
      padding: 0;
      margin-bottom: 2rem;
      box-shadow: 0 10px 40px rgba(0,0,0,0.05);
    }
    
    .tabs {
      display: flex;
      border-bottom: 2px solid #f8f9fa;
    }
    
    .tab-btn {
      flex: 1;
      padding: 1.5rem 2rem;
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      font-size: 1.2rem;
      font-weight: 600;
      color: #7f8c8d;
      transition: all 0.3s ease;
      position: relative;
    }
    
    .tab-btn:hover {
      color: #3498db;
      background: #f8f9fa;
    }
    
    .tab-btn.active {
      color: #3498db;
    }
    
    .tab-btn.active::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
      border-radius: 3px 3px 0 0;
    }
    
    .tab-icon {
      font-size: 1.5rem;
    }
    
    /* Область контента */
    .content-area {
      background: white;
      border-radius: 24px;
      padding: 2.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 15px 50px rgba(0,0,0,0.08);
    }
    
    .view-header {
      margin-bottom: 2.5rem;
    }
    
    .view-header h2 {
      font-size: 2.2rem;
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      font-weight: 700;
    }
    
    .view-subtitle {
      color: #7f8c8d;
      margin: 0;
      font-size: 1.1rem;
    }
    
    .view-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
    }
    
    .search-box {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.8rem 1.5rem;
      background: #f8f9fa;
      border-radius: 16px;
      border: 2px solid #e9ecef;
      flex: 1;
      max-width: 400px;
    }
    
    .search-icon {
      font-size: 1.3rem;
      color: #7f8c8d;
    }
    
    .search-input {
      flex: 1;
      border: none;
      background: none;
      font-size: 1.1rem;
      color: #2c3e50;
    }
    
    .search-input:focus {
      outline: none;
    }
    
    .btn-action {
      padding: 0.8rem 1.5rem;
      background: #f8f9fa;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      font-weight: 600;
      color: #2c3e50;
      transition: all 0.3s ease;
    }
    
    .btn-action:hover {
      background: #e9ecef;
      transform: translateY(-2px);
    }
    
    .btn-icon {
      font-size: 1.2rem;
    }
    
    /* Сетка клиентов */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }
    
    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.5;
    }
    
    .empty-state h3 {
      font-size: 1.8rem;
      color: #2c3e50;
      margin: 0 0 0.8rem 0;
    }
    
    .empty-state p {
      color: #7f8c8d;
      margin: 0;
      font-size: 1.1rem;
    }
    
    .customers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 1.5rem;
    }
    
    .customer-card {
      background: #f8f9fa;
      border-radius: 20px;
      padding: 1.8rem;
      border: 2px solid #e9ecef;
      transition: all 0.3s ease;
    }
    
    .customer-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 40px rgba(0,0,0,0.1);
      border-color: #3498db;
    }
    
    .customer-card-header {
      display: flex;
      align-items: center;
      gap: 1.2rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 2px solid #e9ecef;
    }
    
    .customer-avatar {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #3498db 0%, #2ecc71 100%);
      color: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
    }
    
    .customer-info h4 {
      margin: 0 0 0.3rem 0;
      font-size: 1.4rem;
      color: #2c3e50;
    }
    
    .customer-id {
      color: #7f8c8d;
      font-size: 0.9rem;
    }
    
    .customer-status {
      margin-left: auto;
      padding: 0.3rem 1rem;
      background: #d4edda;
      color: #155724;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    
    .customer-status.active {
      background: #d4edda;
      color: #155724;
    }
    
    .customer-accounts {
      margin-bottom: 1.5rem;
    }
    
    .customer-accounts h5 {
      margin: 0 0 1rem 0;
      color: #2c3e50;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .account-card {
      background: white;
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 0.8rem;
      border: 1px solid #e9ecef;
    }
    
    .account-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    
    .account-header strong {
      color: #2c3e50;
      font-size: 1.1rem;
    }
    
    .account-balance {
      color: #2ecc71;
      font-weight: 700;
      font-size: 1.2rem;
    }
    
    .account-details {
      display: flex;
      gap: 1.5rem;
      color: #7f8c8d;
      font-size: 0.9rem;
    }
    
    .customer-stats {
      display: flex;
      gap: 1.5rem;
      padding-top: 1.5rem;
      border-top: 2px solid #e9ecef;
    }
    
    .stat {
      flex: 1;
      text-align: center;
    }
    
    .stat-label {
      display: block;
      color: #7f8c8d;
      font-size: 0.9rem;
      margin-bottom: 0.3rem;
    }
    
    .stat-value {
      display: block;
      font-weight: 700;
      color: #2c3e50;
      font-size: 1.2rem;
    }
    
    /* Формы */
    .form-card {
      background: #f8f9fa;
      border-radius: 20px;
      padding: 2.5rem;
      margin-bottom: 2rem;
      border: 2px solid #e9ecef;
    }
    
    .form-group {
      margin-bottom: 1.8rem;
    }
    
    .form-label {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      font-size: 1.1rem;
      color: #2c3e50;
      margin-bottom: 0.8rem;
      font-weight: 600;
    }
    
    .label-icon {
      font-size: 1.3rem;
    }
    
    .form-input, .form-select {
      width: 100%;
      padding: 1rem 1.5rem;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      font-size: 1.1rem;
      transition: all 0.3s ease;
      background: white;
    }
    
    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    
    .customer-preview {
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      margin: 1.5rem 0;
      border: 2px solid #e9ecef;
    }
    
    .preview-header {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      margin-bottom: 1.2rem;
    }
    
    .preview-header h4 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.3rem;
    }
    
    .preview-content {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }
    
    .preview-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.8rem 0;
      border-bottom: 1px solid #f8f9fa;
    }
    
    .preview-row:last-child {
      border-bottom: none;
    }
    
    .preview-label {
      color: #7f8c8d;
      font-weight: 500;
    }
    
    .preview-value {
      font-weight: 600;
      color: #2c3e50;
    }
    
    .preview-value.total {
      color: #2ecc71;
      font-size: 1.2rem;
    }
    
    .form-actions {
      display: flex;
      gap: 1.5rem;
      margin-top: 2.5rem;
    }
    
    .btn-submit, .btn-cancel {
      flex: 1;
      padding: 1.2rem;
      border: none;
      border-radius: 16px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      transition: all 0.3s ease;
    }
    
    .btn-submit {
      background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
      color: white;
      box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
    }
    
    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(52, 152, 219, 0.4);
      background: linear-gradient(135deg, #2980b9 0%, #1f639c 100%);
    }
    
    .btn-submit:disabled {
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
      padding: 1.2rem 1.5rem;
      border-radius: 12px;
      margin-top: 1.5rem;
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
    
    .info-card {
      display: flex;
      gap: 1.5rem;
      padding: 1.5rem;
      background: linear-gradient(135deg, #fff8e1 0%, #ffeaa7 100%);
      border-radius: 16px;
      border: 2px solid #ffd54f;
    }
    
    .info-icon {
      font-size: 2.5rem;
    }
    
    .info-content h4 {
      margin: 0 0 0.5rem 0;
      color: #d35400;
      font-size: 1.3rem;
    }
    
    .info-content p {
      margin: 0;
      color: #7d6608;
      line-height: 1.6;
    }
    
    /* Статистика */
    .stats-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    
    .stat-card {
      background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
      border-radius: 20px;
      padding: 2rem;
      color: white;
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }
    
    .stat-icon {
      font-size: 3rem;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.2);
      border-radius: 18px;
      backdrop-filter: blur(10px);
    }
    
    .stat-content h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      opacity: 0.9;
      font-weight: 500;
    }
    
    .stat-number {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0 0 0.3rem 0;
    }
    
    .stat-trend {
      margin: 0;
      opacity: 0.8;
      font-size: 0.95rem;
    }
    
    @media (max-width: 1024px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .customers-grid {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      }
    }
    
    @media (max-width: 768px) {
      .manager-header {
        padding: 1.5rem;
      }
      
      .header-content {
        flex-direction: column;
        gap: 1.5rem;
        align-items: flex-start;
      }
      
      .header-right {
        width: 100%;
        justify-content: space-between;
      }
      
      .tabs {
        flex-direction: column;
      }
      
      .tab-btn {
        padding: 1.2rem;
      }
      
      .content-area {
        padding: 1.5rem;
      }
      
      .view-controls {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }
      
      .search-box {
        width: 100%;
        max-width: none;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .stats-section {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ManagerDashboardComponent implements OnInit {
  customers: User[] = [];
  filteredCustomers: User[] = [];
  searchQuery: string = '';
  
  activeView: 'customers' | 'addCustomer' | 'addAccount' = 'customers';
  
  newCustomer: any = {
    name: '',
    initialBalance: 0,
    currency: '₽'
  };
  
  newAccount: any = {
    initialDeposit: 0,
    currency: '₽'
  };
  
  selectedCustomerId: number | null = null;
  selectedCustomer: User | null = null;
  
  customerMessage: string = '';
  customerSuccess: boolean = false;
  accountMessage: string = '';
  accountSuccess: boolean = false;
  
  currentTime: Date = new Date();
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    this.loadCustomers();
    // Обновляем время каждую секунду
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }
  
  loadCustomers() {
    this.customers = [
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
    
    this.filterCustomers();
  }
  
  filterCustomers() {
    if (!this.searchQuery.trim()) {
      this.filteredCustomers = this.customers;
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredCustomers = this.customers.filter(customer =>
        customer.name.toLowerCase().includes(query) ||
        customer.id.toString().includes(query) ||
        customer.accounts.some(acc => acc.accountNumber.toLowerCase().includes(query))
      );
    }
  }
  
  setActiveView(view: 'customers' | 'addCustomer' | 'addAccount') {
    this.activeView = view;
    this.searchQuery = '';
    this.filterCustomers();
  }
  
  getTotalBalance(customer: User): number {
    return customer.accounts.reduce((sum, acc) => sum + acc.balance, 0);
  }
  
  getTotalAccounts(): number {
    return this.customers.reduce((sum, customer) => sum + customer.accounts.length, 0);
  }
  
  getTotalAssets(): number {
    return this.customers.reduce((sum, customer) => 
      sum + this.getTotalBalance(customer), 0
    );
  }
  
  goToHome() {
    this.router.navigate(['/']);
  }
  
  onCustomerSelect() {
    this.selectedCustomer = this.customers.find(c => c.id === Number(this.selectedCustomerId)) || null;
  }
  
  addNewCustomer() {
    if (this.newCustomer.name.trim()) {
      const newId = Math.max(...this.customers.map(c => c.id)) + 1;
      const newAccountNumber = `ACC${String(newId).padStart(3, '0')}`;
      
      const newUser: User = {
        id: newId,
        name: this.newCustomer.name,
        accounts: [
          {
            id: Date.now(),
            accountNumber: newAccountNumber,
            balance: this.newCustomer.initialBalance || 0,
            currency: this.newCustomer.currency,
            transactions: this.newCustomer.initialBalance > 0 ? [{
              id: Date.now(),
              type: 'deposit',
              amount: this.newCustomer.initialBalance,
              date: new Date(),
              description: 'Начальный депозит'
            }] : []
          }
        ]
      };
      
      this.customers.push(newUser);
      this.filterCustomers();
      
      this.customerMessage = `✅ Клиент "${this.newCustomer.name}" успешно создан. Счёт: ${newAccountNumber}`;
      this.customerSuccess = true;
      
      setTimeout(() => {
        this.resetNewCustomerForm();
        this.customerMessage = '';
        this.activeView = 'customers';
      }, 3000);
    } else {
      this.customerMessage = '❌ Пожалуйста, введите имя клиента';
      this.customerSuccess = false;
    }
  }
  
  resetNewCustomerForm() {
    this.newCustomer = {
      name: '',
      initialBalance: 0,
      currency: '₽'
    };
  }
  
  addNewAccount() {
    if (this.selectedCustomerId && this.newAccount.initialDeposit >= 0 && this.selectedCustomer) {
      const newAccountId = Date.now();
      const accountNumber = `ACC${String(newAccountId).slice(-6)}`;
      
      const newAccountObj: Account = {
        id: newAccountId,
        accountNumber: accountNumber,
        balance: this.newAccount.initialDeposit,
        currency: this.newAccount.currency,
        transactions: this.newAccount.initialDeposit > 0 ? [{
          id: Date.now(),
          type: 'deposit',
          amount: this.newAccount.initialDeposit,
          date: new Date(),
          description: 'Открытие счёта'
        }] : []
      };
      
      this.selectedCustomer.accounts.push(newAccountObj);
      this.filterCustomers();
      
      this.accountMessage = `✅ Счёт ${accountNumber} успешно открыт для ${this.selectedCustomer.name}`;
      this.accountSuccess = true;
      
      setTimeout(() => {
        this.resetNewAccountForm();
        this.accountMessage = '';
        this.activeView = 'customers';
      }, 3000);
    } else {
      this.accountMessage = '❌ Пожалуйста, заполните все поля корректно';
      this.accountSuccess = false;
    }
  }
  
  resetNewAccountForm() {
    this.newAccount = {
      initialDeposit: 0,
      currency: '₽'
    };
    this.selectedCustomerId = null;
    this.selectedCustomer = null;
  }
}