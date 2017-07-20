import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxlineComponent } from './ngxline.component';

describe('NgxlineComponent', () => {
  let component: NgxlineComponent;
  let fixture: ComponentFixture<NgxlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
