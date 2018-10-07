import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TouComponent } from './tou.component';

describe('TouComponent', () => {
  let component: TouComponent;
  let fixture: ComponentFixture<TouComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
