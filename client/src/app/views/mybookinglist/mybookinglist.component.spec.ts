import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MybookinglistComponent } from './mybookinglist.component';

describe('MybookinglistComponent', () => {
  let component: MybookinglistComponent;
  let fixture: ComponentFixture<MybookinglistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MybookinglistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MybookinglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
