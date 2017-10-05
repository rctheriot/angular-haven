import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoltlyGraphComponent } from './poltly-graph.component';

describe('PoltlyGraphComponent', () => {
  let component: PoltlyGraphComponent;
  let fixture: ComponentFixture<PoltlyGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoltlyGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoltlyGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
