import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsePlansComponent } from './response-plans.component';

describe('ResponsePlansComponent', () => {
  let component: ResponsePlansComponent;
  let fixture: ComponentFixture<ResponsePlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponsePlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponsePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
