import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxvbarComponent } from './ngxvbar.component';

describe('NgxvbarComponent', () => {
  let component: NgxvbarComponent;
  let fixture: ComponentFixture<NgxvbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxvbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxvbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
