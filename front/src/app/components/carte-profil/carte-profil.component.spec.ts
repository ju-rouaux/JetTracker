import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteProfilComponent } from './carte-profil.component';

describe('CarteProfilComponent', () => {
  let component: CarteProfilComponent;
  let fixture: ComponentFixture<CarteProfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarteProfilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarteProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
