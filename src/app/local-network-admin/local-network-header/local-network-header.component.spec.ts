import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkHeaderComponent } from './local-network-header.component';

describe('LocalNetworkHeaderComponent', () => {
  let component: LocalNetworkHeaderComponent;
  let fixture: ComponentFixture<LocalNetworkHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
