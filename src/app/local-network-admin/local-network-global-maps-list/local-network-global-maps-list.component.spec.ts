/**
 * Created by jordan on 07/02/18.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkGlobalMapsListComponent } from './local-network-global-maps-list.component';

describe('LocalNetworkGlobalMapsListComponent', () => {
  let component: LocalNetworkGlobalMapsListComponent;
  let fixture: ComponentFixture<LocalNetworkGlobalMapsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkGlobalMapsListComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkGlobalMapsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
