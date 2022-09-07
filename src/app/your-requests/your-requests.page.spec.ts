import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { YourRequestsPage } from './your-requests.page';

describe('YourRequestsPage', () => {
  let component: YourRequestsPage;
  let fixture: ComponentFixture<YourRequestsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourRequestsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(YourRequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
