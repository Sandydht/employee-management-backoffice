import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputAutocompleteComponent } from './input-autocomplete';

describe('InputAutocompleteComponent', () => {
  let component: InputAutocompleteComponent;
  let fixture: ComponentFixture<InputAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputAutocompleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputAutocompleteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
