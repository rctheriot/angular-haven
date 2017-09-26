import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxheatmapComponent } from './ngxheatmap.component';

describe('NgxheatmapComponent', () => {
  let component: NgxheatmapComponent;
  let fixture: ComponentFixture<NgxheatmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxheatmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxheatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
