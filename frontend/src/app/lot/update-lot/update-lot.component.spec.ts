import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLotComponent } from './update-lot.component';

describe('UpdateLotComponent', () => {
  let component: UpdateLotComponent;
  let fixture: ComponentFixture<UpdateLotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateLotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
