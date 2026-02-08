import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <div class="welcome-section">
        <h2>Welcome to Global Bank</h2>
        <p class="subtitle">Secure Banking System</p>
      </div>
      
      <div class="login-options">
        <div class="option-card customer-option" (click)="goToCustomerLogin()">
          <div class="option-icon">👤</div>
          <h3>Customer Login</h3>
          <p>Access your personal banking account</p>
          <ul class="feature-list">
            <li>✓ View account balance</li>
            <li>✓ Make deposits</li>
            <li>✓ Withdraw funds</li>
            <li>✓ View transaction history</li>
          </ul>
          <button class="option-btn">Customer Login →</button>
        </div>
        
        <div class="option-card manager-option" (click)="goToManagerLogin()">
          <div class="option-icon">👔</div>
          <h3>Bank Manager Login</h3>
          <p>Manage bank operations and customers</p>
          <ul class="feature-list">
            <li>✓ Add new customers</li>
            <li>✓ Create accounts</li>
            <li>✓ View all customers</li>
            <li>✓ Manage accounts</li>
          </ul>
          <button class="option-btn">Manager Login →</button>
        </div>
      </div>
      
      <div class="demo-info">
        <h4>Demo Instructions:</h4>
        <p>1. For Customer Login, select "Ron Weasly" from dropdown</p>
        <p>2. Test deposit/withdraw functionality with positive amounts</p>
        <p>3. View transaction history</p>
        <p>4. Try Manager functions for customer management</p>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .welcome-section {
      text-align: center;
      margin-bottom: 3rem;
      padding: 2rem;
      background: white;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    
    .welcome-section h2 {
      color: #2c3e50;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    
    .subtitle {
      color: #7f8c8d;
      font-size: 1.2rem;
    }
    
    .login-options {
      display: flex;
      gap: 2rem;
      margin-bottom: 3rem;
    }
    
    .option-card {
      flex: 1;
      background: white;
      border-radius: 10px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: transform 0.3s, box-shadow 0.3s;
      border: 2px solid transparent;
    }
    
    .option-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }
    
    .customer-option:hover {
      border-color: #3498db;
    }
    
    .manager-option:hover {
      border-color: #2ecc71;
    }
    
    .option-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .option-card h3 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    
    .option-card p {
      color: #7f8c8d;
      margin-bottom: 1.5rem;
    }
    
    .feature-list {
      text-align: left;
      list-style: none;
      padding: 0;
      margin: 1.5rem 0;
    }
    
    .feature-list li {
      padding: 0.3rem 0;
      color: #34495e;
    }
    
    .option-btn {
      background: #3498db;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
      transition: background 0.3s;
    }
    
    .manager-option .option-btn {
      background: #2ecc71;
    }
    
    .option-btn:hover {
      background: #2980b9;
    }
    
    .manager-option .option-btn:hover {
      background: #27ae60;
    }
    
    .demo-info {
      background: #fff8e1;
      border-left: 4px solid #ffc107;
      padding: 1.5rem;
      border-radius: 5px;
      margin-top: 2rem;
    }
    
    .demo-info h4 {
      color: #d35400;
      margin-bottom: 0.5rem;
    }
    
    .demo-info p {
      color: #7d6608;
      margin: 0.3rem 0;
      font-size: 0.95rem;
    }
    
    @media (max-width: 768px) {
      .login-options {
        flex-direction: column;
      }
    }
  `]
})
export class HomeComponent {
  constructor(private router: Router) {}
  
  goToCustomerLogin() {
    this.router.navigate(['/customer-login']);
  }
  
  goToManagerLogin() {
    this.router.navigate(['/manager']);
  }
}