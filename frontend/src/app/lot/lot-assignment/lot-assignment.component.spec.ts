import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotAssignmentComponent } from './lot-assignment.component';

describe('LotAssignmentComponent', () => {
  let component: LotAssignmentComponent;
  let fixture: ComponentFixture<LotAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotAssignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LotAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
