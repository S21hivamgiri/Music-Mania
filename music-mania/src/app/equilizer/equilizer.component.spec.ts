import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquilizerComponent } from './equilizer.component';

describe('EquilizerComponent', () => {
  let component: EquilizerComponent;
  let fixture: ComponentFixture<EquilizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquilizerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquilizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
