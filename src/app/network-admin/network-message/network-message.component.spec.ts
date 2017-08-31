import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkMessageComponent } from './network-message.component';

describe('NetworkMessageComponent', () => {
  let component: NetworkMessageComponent;
  let fixture: ComponentFixture<NetworkMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
