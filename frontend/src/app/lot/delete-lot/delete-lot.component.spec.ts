import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLotComponent } from './delete-lot.component';

describe('DeleteLotComponent', () => {
  let component: DeleteLotComponent;
  let fixture: ComponentFixture<DeleteLotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteLotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
