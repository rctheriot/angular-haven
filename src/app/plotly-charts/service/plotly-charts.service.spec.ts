import { TestBed, inject } from '@angular/core/testing';

import { PlotlyChartsService } from './plotly-charts.service';

describe('PoltlyChartsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlotlyChartsService]
    });
  });

  it('should be created', inject([PlotlyChartsService], (service: PlotlyChartsService) => {
    expect(service).toBeTruthy();
  }));
});
