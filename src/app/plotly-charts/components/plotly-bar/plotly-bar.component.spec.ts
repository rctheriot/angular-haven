import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotlyBarComponent } from './plotly-bar.component';

describe('PlotlyBarComponent', () => {
  let component: PlotlyBarComponent;
  let fixture: ComponentFixture<PlotlyBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotlyBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotlyBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
