import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistToolComponent } from './playlist-tool.component';

describe('PlaylistToolComponent', () => {
  let component: PlaylistToolComponent;
  let fixture: ComponentFixture<PlaylistToolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlaylistToolComponent]
    });
    fixture = TestBed.createComponent(PlaylistToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
