import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCurrencyComponent } from './input-currency';

describe('InputCurrencyComponent', () => {
  let component: InputCurrencyComponent;
  let fixture: ComponentFixture<InputCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCurrencyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InputCurrencyComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
