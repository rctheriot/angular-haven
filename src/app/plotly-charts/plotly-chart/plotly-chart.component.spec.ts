import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotlyChartComponent } from './plotly-chart.component';

describe('PlotlyChartComponent', () => {
  let component: PlotlyChartComponent;
  let fixture: ComponentFixture<PlotlyChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotlyChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotlyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
