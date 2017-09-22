import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkPlansComponent } from './network-plans.component';

describe('NetworkPlansComponent', () => {
  let component: NetworkPlansComponent;
  let fixture: ComponentFixture<NetworkPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
