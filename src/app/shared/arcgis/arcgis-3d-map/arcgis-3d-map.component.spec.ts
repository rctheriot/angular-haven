import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Arcgis3dMapComponent } from './arcgis-3d-map.component';

describe('Arcgis3dMapComponent', () => {
  let component: Arcgis3dMapComponent;
  let fixture: ComponentFixture<Arcgis3dMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Arcgis3dMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Arcgis3dMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
