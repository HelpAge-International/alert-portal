import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkPlansComponent } from './local-network-plans.component';

describe('LocalNetworkPlansComponent', () => {
  let component: LocalNetworkPlansComponent;
  let fixture: ComponentFixture<LocalNetworkPlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkPlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
