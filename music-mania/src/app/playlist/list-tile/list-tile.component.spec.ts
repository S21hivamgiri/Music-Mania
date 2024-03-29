import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListTileComponent } from './list-tile.component';

describe('ListTileComponent', () => {
  let component: ListTileComponent;
  let fixture: ComponentFixture<ListTileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListTileComponent]
    });
    fixture = TestBed.createComponent(ListTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
