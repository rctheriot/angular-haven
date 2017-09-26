import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxguageComponent } from './ngxguage.component';

describe('NgxguageComponent', () => {
  let component: NgxguageComponent;
  let fixture: ComponentFixture<NgxguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
