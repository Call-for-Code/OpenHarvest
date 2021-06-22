import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotCropFormComponent } from './lot-crop-form.component';

describe('LotCropFormComponent', () => {
  let component: LotCropFormComponent;
  let fixture: ComponentFixture<LotCropFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotCropFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LotCropFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
