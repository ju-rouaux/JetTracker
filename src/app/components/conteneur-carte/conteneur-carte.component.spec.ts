import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConteneurCarteComponent } from './conteneur-carte.component';

describe('ConteneurCarteComponent', () => {
  let component: ConteneurCarteComponent;
  let fixture: ComponentFixture<ConteneurCarteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConteneurCarteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConteneurCarteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
