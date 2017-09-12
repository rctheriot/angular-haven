import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  email: 'test@gmail.com';
  password: 'asdfasdf';


  constructor(private authService: AuthService) {
   this.login();
  }

  login() {
    this.authService.signinUser('test@gmail.com', 'asdfasdf');
  }

}
