import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MpaComponent } from './mpa.component';

describe('MpaComponent', () => {
  let component: MpaComponent;
  let fixture: ComponentFixture<MpaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MpaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
