import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkPreparednessComponent } from './local-network-preparedness.component';

describe('LocalNetworkPreparednessComponent', () => {
  let component: LocalNetworkPreparednessComponent;
  let fixture: ComponentFixture<LocalNetworkPreparednessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkPreparednessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkPreparednessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
