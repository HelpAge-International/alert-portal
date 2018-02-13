/**
 * Created by jordan on 07/02/18.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkGlobalMapsComponent } from './local-network-global-maps.component';

describe('LocalNetworkGlobalMapsComponent', () => {
  let component: LocalNetworkGlobalMapsComponent;
  let fixture: ComponentFixture<LocalNetworkGlobalMapsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkGlobalMapsComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkGlobalMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
