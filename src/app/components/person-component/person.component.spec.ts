import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonComponentComponent } from './person.component';

describe('PersonComponentComponent', () => {
  let component: PersonComponentComponent;
  let fixture: ComponentFixture<PersonComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
