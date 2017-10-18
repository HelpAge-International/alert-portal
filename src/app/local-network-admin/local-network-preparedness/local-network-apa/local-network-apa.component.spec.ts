import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkApaComponent } from './local-network-apa.component';

describe('LocalNetworkApaComponent', () => {
  let component: LocalNetworkApaComponent;
  let fixture: ComponentFixture<LocalNetworkApaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkApaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkApaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
