import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NearbyRequestsPage } from './nearby-requests.page';

describe('NearbyRequestsPage', () => {
  let component: NearbyRequestsPage;
  let fixture: ComponentFixture<NearbyRequestsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NearbyRequestsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NearbyRequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
