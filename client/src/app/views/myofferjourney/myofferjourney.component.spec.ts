import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyofferjourneyComponent } from './myofferjourney.component';

describe('MyofferjourneyComponent', () => {
  let component: MyofferjourneyComponent;
  let fixture: ComponentFixture<MyofferjourneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyofferjourneyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyofferjourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
