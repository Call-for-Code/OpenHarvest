import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandAreasComponent } from './land-areas.component';

describe('LandAreasComponent', () => {
  let component: LandAreasComponent;
  let fixture: ComponentFixture<LandAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandAreasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
