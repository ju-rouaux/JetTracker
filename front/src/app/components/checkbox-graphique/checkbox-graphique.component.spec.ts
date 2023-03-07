import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxGraphiqueComponent } from './checkbox-graphique.component';

describe('CheckboxGraphiqueComponent', () => {
  let component: CheckboxGraphiqueComponent;
  let fixture: ComponentFixture<CheckboxGraphiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckboxGraphiqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxGraphiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
