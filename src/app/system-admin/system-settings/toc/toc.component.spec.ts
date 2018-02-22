import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToCComponent } from './toc.component';

describe('ToCComponent', () => {
  let component: ToCComponent;
  let fixture: ComponentFixture<ToCComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToCComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
