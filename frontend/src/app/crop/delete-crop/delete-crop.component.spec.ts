import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCropComponent } from './delete-crop.component';

describe('DeleteCropComponent', () => {
  let component: DeleteCropComponent;
  let fixture: ComponentFixture<DeleteCropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteCropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
