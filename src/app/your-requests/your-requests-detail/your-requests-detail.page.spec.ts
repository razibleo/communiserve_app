import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { YourRequestsDetailPage } from './your-requests-detail.page';

describe('YourRequestsDetailPage', () => {
  let component: YourRequestsDetailPage;
  let fixture: ComponentFixture<YourRequestsDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourRequestsDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(YourRequestsDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
