import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-haven-header',
  templateUrl: './haven-header.component.html',
  styleUrls: ['./haven-header.component.css']
})
export class HavenHeaderComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.authService.signOut();
  }

}
