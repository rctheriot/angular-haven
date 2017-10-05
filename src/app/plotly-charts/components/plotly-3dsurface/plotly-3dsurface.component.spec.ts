import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Plotly3dsurfaceComponent } from './plotly-3dsurface.component';

describe('Plotly3dsurfaceComponent', () => {
  let component: Plotly3dsurfaceComponent;
  let fixture: ComponentFixture<Plotly3dsurfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Plotly3dsurfaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Plotly3dsurfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
