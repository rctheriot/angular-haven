import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-haven-main',
  templateUrl: './haven-main.component.html',
  styleUrls: ['./haven-main.component.css']
})
export class HavenMainComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    document.addEventListener('contextmenu', (e) => {
      // e.preventDefault();
    })
  }

}
