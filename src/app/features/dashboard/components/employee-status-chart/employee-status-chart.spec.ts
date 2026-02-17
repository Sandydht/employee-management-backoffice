import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeStatusChartComponent } from './employee-status-chart';

describe('EmployeeStatusChartComponent', () => {
  let component: EmployeeStatusChartComponent;
  let fixture: ComponentFixture<EmployeeStatusChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeStatusChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeStatusChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
