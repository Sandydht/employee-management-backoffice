import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeAddPage } from './employee-add-page';

describe('EmployeeAddPage', () => {
  let component: EmployeeAddPage;
  let fixture: ComponentFixture<EmployeeAddPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeAddPage],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeAddPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
