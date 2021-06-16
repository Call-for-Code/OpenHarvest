import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CropComponent } from './crop.component';

describe('CropComponent', () => {
	let component: CropComponent;
	let fixture: ComponentFixture<CropComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ CropComponent ]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CropComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
