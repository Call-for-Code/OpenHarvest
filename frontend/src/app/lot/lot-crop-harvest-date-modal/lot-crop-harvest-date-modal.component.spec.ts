import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotCropHarvestDateModalComponent } from './lot-crop-harvest-date-modal.component';

describe('LotCropHarvestDateModalComponent', () => {
  let component: LotCropHarvestDateModalComponent;
  let fixture: ComponentFixture<LotCropHarvestDateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotCropHarvestDateModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LotCropHarvestDateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
