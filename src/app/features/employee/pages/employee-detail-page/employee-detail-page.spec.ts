import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDetailPage } from './employee-detail-page';

describe('EmployeeDetailPage', () => {
  let component: EmployeeDetailPage;
  let fixture: ComponentFixture<EmployeeDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeDetailPage],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeDetailPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
