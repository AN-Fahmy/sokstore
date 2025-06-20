import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSettingComponent } from './client-setting.component';

describe('ClientSettingComponent', () => {
  let component: ClientSettingComponent;
  let fixture: ComponentFixture<ClientSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientSettingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
