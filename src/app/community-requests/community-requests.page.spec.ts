import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CommunityRequestsPage } from './community-requests.page';

describe('CommunityRequestsPage', () => {
  let component: CommunityRequestsPage;
  let fixture: ComponentFixture<CommunityRequestsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityRequestsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityRequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
