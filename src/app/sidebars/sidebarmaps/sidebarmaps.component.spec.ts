import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarmapsComponent } from './sidebarmaps.component';

describe('SidebarComponent', () => {
  let component: SidebarmapsComponent;
  let fixture: ComponentFixture<SidebarmapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarmapsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarmapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
