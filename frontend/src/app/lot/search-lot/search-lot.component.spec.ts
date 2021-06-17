import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLotComponent } from './search-lot.component';

describe('SearchLotComponent', () => {
  let component: SearchLotComponent;
  let fixture: ComponentFixture<SearchLotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchLotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
