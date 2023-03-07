import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphiqueComponent } from './graphique.component';

describe('GraphiqueComponent', () => {
  let component: GraphiqueComponent;
  let fixture: ComponentFixture<GraphiqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphiqueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
