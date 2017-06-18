import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {AgencyAdminHeaderComponent} from "./agency-admin-header.component";

describe('AgencyAdminHeaderComponent', () => {
  let component: AgencyAdminHeaderComponent;
  let fixture: ComponentFixture<AgencyAdminHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyAdminHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyAdminHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
