import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxstackvertbarComponent } from './ngxstackvertbar.component';

describe('NgxstackvertbarComponent', () => {
  let component: NgxstackvertbarComponent;
  let fixture: ComponentFixture<NgxstackvertbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxstackvertbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxstackvertbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
