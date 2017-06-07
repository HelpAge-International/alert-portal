import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertLoaderComponent } from './alert-loader.component';

describe('AlertLoaderComponent', () => {
  let component: AlertLoaderComponent;
  let fixture: ComponentFixture<AlertLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlertLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
