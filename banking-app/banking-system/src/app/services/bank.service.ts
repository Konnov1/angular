import { Injectable } from '@angular/core';
import { User, Account, Transaction } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private readonly STORAGE_KEY = 'banking_system_data';
  private users: User[] = [];
  
  constructor() {
    this.loadFromStorage();
    if (this.users.length === 0) {
      this.initializeDefaultData();
    }
  }
  
  private loadFromStorage() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        // Восстанавливаем даты для транзакций
        this.users = parsed.map((user: any) => ({
          ...user,
          accounts: user.accounts.map((account: any) => ({
            ...account,
            transactions: account.transactions.map((transaction: any) => ({
              ...transaction,
              date: new Date(transaction.date)
            }))
          }))
        }));
      } catch (e) {
        console.error('Error loading data from storage:', e);
        this.users = [];
      }
    }
  }
  
  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.users));
  }
  
  private initializeDefaultData() {
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
    this.saveToStorage();
  }
  
  // Получить всех пользователей
  getAllUsers(): User[] {
    return [...this.users];
  }
  
  // Получить пользователя по ID
  getUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }
  
  // Найти пользователя по имени
  findUserByName(name: string): User | undefined {
    return this.users.find(u => u.name.toLowerCase() === name.toLowerCase());
  }
  
  // Добавить нового пользователя
  addUser(name: string, initialBalance: number = 0, currency: string = '₽'): User {
    const newId = Math.max(...this.users.map(u => u.id), 0) + 1;
    const newAccountNumber = `ACC${String(newId).padStart(3, '0')}`;
    
    const newUser: User = {
      id: newId,
      name: name,
      accounts: [
        {
          id: Date.now(),
          accountNumber: newAccountNumber,
          balance: initialBalance,
          currency: currency,
          transactions: initialBalance > 0 ? [{
            id: Date.now(),
            type: 'deposit',
            amount: initialBalance,
            date: new Date(),
            description: 'Начальный депозит'
          }] : []
        }
      ]
    };
    
    this.users.push(newUser);
    this.saveToStorage();
    return newUser;
  }
  
  // Добавить счёт пользователю
  addAccountToUser(userId: number, initialDeposit: number = 0, currency: string = '₽'): Account {
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    
    const newAccountId = Date.now();
    const accountNumber = `ACC${String(newAccountId).slice(-6)}`;
    
    const newAccount: Account = {
      id: newAccountId,
      accountNumber: accountNumber,
      balance: initialDeposit,
      currency: currency,
      transactions: initialDeposit > 0 ? [{
        id: Date.now(),
        type: 'deposit',
        amount: initialDeposit,
        date: new Date(),
        description: 'Открытие счёта'
      }] : []
    };
    
    user.accounts.push(newAccount);
    this.saveToStorage();
    return newAccount;
  }
  
  // Внести депозит
  makeDeposit(userId: number, accountId: number, amount: number, description: string = 'Пополнение счёта'): Transaction {
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    
    const account = user.accounts.find(a => a.id === accountId);
    if (!account) {
      throw new Error('Счёт не найден');
    }
    
    if (amount <= 0) {
      throw new Error('Сумма должна быть больше нуля');
    }
    
    const transaction: Transaction = {
      id: Date.now(),
      type: 'deposit',
      amount: amount,
      date: new Date(),
      description: description
    };
    
    account.balance += amount;
    account.transactions.unshift(transaction);
    this.saveToStorage();
    
    return transaction;
  }
  
  // Снять средства
  makeWithdrawal(userId: number, accountId: number, amount: number, description: string = 'Снятие средств'): Transaction {
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    
    const account = user.accounts.find(a => a.id === accountId);
    if (!account) {
      throw new Error('Счёт не найден');
    }
    
    if (amount <= 0) {
      throw new Error('Сумма должна быть больше нуля');
    }
    
    if (amount > account.balance) {
      throw new Error('Недостаточно средств на счёте');
    }
    
    const transaction: Transaction = {
      id: Date.now(),
      type: 'withdrawal',
      amount: amount,
      date: new Date(),
      description: description
    };
    
    account.balance -= amount;
    account.transactions.unshift(transaction);
    this.saveToStorage();
    
    return transaction;
  }
  
  // Получить общую статистику
  getStatistics() {
    const totalCustomers = this.users.length;
    const totalAccounts = this.users.reduce((sum, user) => sum + user.accounts.length, 0);
    const totalAssets = this.users.reduce((sum, user) => 
      sum + user.accounts.reduce((accSum, acc) => accSum + acc.balance, 0), 0
    );
    
    return {
      totalCustomers,
      totalAccounts,
      totalAssets
    };
  }
}