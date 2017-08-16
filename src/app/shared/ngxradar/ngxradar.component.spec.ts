import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxradarComponent } from './ngxradar.component';

describe('NgxradarComponent', () => {
  let component: NgxradarComponent;
  let fixture: ComponentFixture<NgxradarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxradarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxradarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
