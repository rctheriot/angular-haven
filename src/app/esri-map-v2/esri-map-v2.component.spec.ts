import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EsriMapV2Component } from './esri-map-v2.component';

describe('EsriMapV2Component', () => {
  let component: EsriMapV2Component;
  let fixture: ComponentFixture<EsriMapV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EsriMapV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EsriMapV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
