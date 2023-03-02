import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecteurPersonneComponent } from './selecteur-personne.component';

describe('SelecteurPersonneComponent', () => {
  let component: SelecteurPersonneComponent;
  let fixture: ComponentFixture<SelecteurPersonneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelecteurPersonneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelecteurPersonneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
