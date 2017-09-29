import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxareaComponent } from './ngxarea.component';

describe('NgxareaComponent', () => {
  let component: NgxareaComponent;
  let fixture: ComponentFixture<NgxareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
