import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinimumComponent } from './minimum.component';

describe('MinimumComponent', () => {
  let component: MinimumComponent;
  let fixture: ComponentFixture<MinimumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinimumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinimumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
