import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotlyHeatmapComponent } from './plotly-heatmap.component';

describe('PlotlyHeatmapComponent', () => {
  let component: PlotlyHeatmapComponent;
  let fixture: ComponentFixture<PlotlyHeatmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotlyHeatmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotlyHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
