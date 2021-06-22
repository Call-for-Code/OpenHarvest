import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotCropEditModalComponent } from './lot-crop-edit-modal.component';

describe('LotCropEditModalComponent', () => {
  let component: LotCropEditModalComponent;
  let fixture: ComponentFixture<LotCropEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotCropEditModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LotCropEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
