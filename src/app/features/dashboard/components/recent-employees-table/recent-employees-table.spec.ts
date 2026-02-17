import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentEmployeesTableComponent } from './recent-employees-table';

describe('RecentEmployeesTableComponent', () => {
  let component: RecentEmployeesTableComponent;
  let fixture: ComponentFixture<RecentEmployeesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentEmployeesTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecentEmployeesTableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
