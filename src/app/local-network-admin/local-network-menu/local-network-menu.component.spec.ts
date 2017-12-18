import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkMenuComponent } from './local-network-menu.component';

describe('LocalNetworkMenuComponent', () => {
  let component: LocalNetworkMenuComponent;
  let fixture: ComponentFixture<LocalNetworkMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
