import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLotComponent } from './add-lot.component';

describe('AddLotComponent', () => {
  let component: AddLotComponent;
  let fixture: ComponentFixture<AddLotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddLotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
