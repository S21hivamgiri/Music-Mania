import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextSongPreviewComponent } from './next-song-preview.component';

describe('NextSongPreviewComponent', () => {
  let component: NextSongPreviewComponent;
  let fixture: ComponentFixture<NextSongPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NextSongPreviewComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NextSongPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
