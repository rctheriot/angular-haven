import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxstackhorzbarComponent } from './ngxstackhorzbar.component';

describe('NgxstackhorzbarComponent', () => {
  let component: NgxstackhorzbarComponent;
  let fixture: ComponentFixture<NgxstackhorzbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxstackhorzbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxstackhorzbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
