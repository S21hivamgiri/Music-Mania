import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayingAnimationComponent } from './playing-animation.component';

describe('PlayingAnimationComponent', () => {
  let component: PlayingAnimationComponent;
  let fixture: ComponentFixture<PlayingAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayingAnimationComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayingAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
