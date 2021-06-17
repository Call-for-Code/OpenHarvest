import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCropComponent } from './search-crop.component';

describe('SearchCropComponent', () => {
  let component: SearchCropComponent;
  let fixture: ComponentFixture<SearchCropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchCropComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
