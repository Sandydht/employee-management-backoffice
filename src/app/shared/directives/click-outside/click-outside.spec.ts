import { Component, signal } from '@angular/core';
import { ClickOutsideDirective } from './click-outside';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [ClickOutsideDirective],
  template: ` <div appClickOutside (clickOutside)="onOutsideClick()">Inside Element</div> `,
})
class TestHostComponent {
  outsideClicked = signal<boolean>(false);

  onOutsideClick() {
    this.outsideClicked.set(true);
  }
}

describe('ClickOutsideDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the directive instance', () => {
    const directiveElement = fixture.debugElement.query(By.directive(ClickOutsideDirective));

    expect(directiveElement).toBeTruthy();
  });

  it('should NOT emit clickOutside when clicking inside the element', () => {
    const directiveElement = fixture.debugElement.query(By.directive(ClickOutsideDirective));

    directiveElement.nativeElement.click();
    fixture.detectChanges();

    expect(hostComponent.outsideClicked()).toBeFalsy();
  });

  it('should emit clickOutside when clicking outside the element', () => {
    document.body.click();
    fixture.detectChanges();

    expect(hostComponent.outsideClicked()).toBeTruthy();
  });

  it('should emit clickOutside only once per outside click event', () => {
    document.body.click();
    fixture.detectChanges();

    expect(hostComponent.outsideClicked()).toBeTruthy();
  });
});
