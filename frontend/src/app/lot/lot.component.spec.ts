import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotComponent } from './lot.component';

describe('LotComponent', () => {
  let component: LotComponent;
  let fixture: ComponentFixture<LotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
