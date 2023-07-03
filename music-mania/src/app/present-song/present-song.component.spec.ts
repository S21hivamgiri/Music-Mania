import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentSongComponent } from './present-song.component';

describe('PresentSongComponent', () => {
  let component: PresentSongComponent;
  let fixture: ComponentFixture<PresentSongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PresentSongComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PresentSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
