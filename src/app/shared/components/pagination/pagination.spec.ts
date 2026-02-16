import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination';
import { PaginationMeta } from '../../models/pagination-meta.model';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  const mockMeta: PaginationMeta = {
    page: 1,
    size: 10,
    totalPages: 10,
    totalItems: 100,
    hasNextPage: true,
    hasPrevPage: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('paginationMeta', mockMeta);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate pages correctly when totalPages <= 7', () => {
    fixture.componentRef.setInput('paginationMeta', {
      ...mockMeta,
      totalPages: 5,
    });

    component.ngOnChanges();

    expect(component.pages()).toEqual([1, 2, 3, 4, 5]);
  });

  it('should generate pages with ellipsis when totalPages > 7', () => {
    fixture.componentRef.setInput('paginationMeta', {
      ...mockMeta,
      page: 5,
      totalPages: 20,
    });

    component.ngOnChanges();

    expect(component.pages()).toContain('...');
    expect(component.pages()[0]).toBe(1);
    expect(component.pages()[component.pages().length - 1]).toBe(20);
  });

  it('should emit pageChange when goToPage is called', () => {
    vi.spyOn(component.pageChange, 'emit');

    component.goToPage(3);

    expect(component.pageChange.emit).toHaveBeenCalledWith(3);
  });

  it('should NOT emit pageChange when clicking ellipsis', () => {
    vi.spyOn(component.pageChange, 'emit');

    component.goToPage('...');

    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should go to first page when firstPage is called', () => {
    vi.spyOn(component.pageChange, 'emit');

    component.firstPage();

    expect(component.pageChange.emit).toHaveBeenCalledWith(1);
  });

  it('should go to last page when lastPage is called', () => {
    vi.spyOn(component.pageChange, 'emit');

    component.lastPage();

    expect(component.pageChange.emit).toHaveBeenCalledWith(10);
  });

  it('should go to next page when nextPage is called and hasNextPage is true', () => {
    vi.spyOn(component.pageChange, 'emit');

    component.nextPage();

    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should NOT go to next page when hasNextPage is false', () => {
    vi.spyOn(component.pageChange, 'emit');

    fixture.componentRef.setInput('paginationMeta', {
      ...mockMeta,
      hasNextPage: false,
    });

    component.nextPage();

    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should go to previous page when prevPage is called and hasPrevPage is true', () => {
    vi.spyOn(component.pageChange, 'emit');

    fixture.componentRef.setInput('paginationMeta', {
      ...mockMeta,
      page: 2,
      hasPrevPage: true,
    });

    component.prevPage();

    expect(component.pageChange.emit).toHaveBeenCalledWith(1);
  });

  it('should toggle page size dropdown when togglePageSizeDropdown is called', () => {
    expect(component.isOpenPageSizeDropdown()).toBeFalsy();

    component.togglePageSizeDropdown();

    expect(component.isOpenPageSizeDropdown()).toBeTruthy();
  });

  it('should close page size dropdown when closeOpenPageSizeDropdown is called', () => {
    component.isOpenPageSizeDropdown.set(true);

    component.closeOpenPageSizeDropdown();

    expect(component.isOpenPageSizeDropdown()).toBeFalsy();
  });

  it('should emit pageSizeChange and reset page to 1 when selectPageSize is called', () => {
    vi.spyOn(component.pageSizeChange, 'emit');
    vi.spyOn(component.pageChange, 'emit');

    component.selectPageSize(25);

    expect(component.pageSizeChange.emit).toHaveBeenCalledWith(25);
    expect(component.pageChange.emit).toHaveBeenCalledWith(1);
  });
});
