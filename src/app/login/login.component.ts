import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  email: string;
  password: string;

  constructor(private authService: AuthService) {

  }

  login() {
    this.authService.signinUser(this.email, this.password);
  }

  createAccount() {
    this.authService.createAccount(this.email, this.password);
  }

}
