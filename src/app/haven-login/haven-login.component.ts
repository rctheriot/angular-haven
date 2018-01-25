import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';

@Component({
  selector: 'app-haven-login',
  templateUrl: './haven-login.component.html',
  styleUrls: ['./haven-login.component.css'],
})
export class HavenLoginComponent {

  email: string;
  password: string;
  messageText: string;

  constructor(private authService: AuthService) { }

  login() {
    this.authService.signinUser(this.email, this.password);
  }

  createAccount() {
    alert('Account Creation currently disabled');
    return;
    // const message = this.authService.createAccount(this.email, this.password);
    // if (message) {
    //   // this.showMessageDialog('Success');
    // } else {
    //   // this.showMessageDialog(message);
    // }
  }

  showMessageDialog(msg: any) {
    this.messageText = msg;
    console.log(msg);
  }
}
