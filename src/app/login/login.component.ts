import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  email: string;
  password: string;

  constructor(private authService: AuthService) {
    this.login();
  }

  login() {
    this.authService.signinUser('hseohaven@gmail.com', '1^v^have');
    //this.authService.signinUser(this.email, this.password);
  }

  createAccount() {
    this.authService.createAccount(this.email, this.password);
  }

}
