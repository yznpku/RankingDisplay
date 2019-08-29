import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileWatchComponent } from './file-watch.component';

describe('FileWatchComponent', () => {
  let component: FileWatchComponent;
  let fixture: ComponentFixture<FileWatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileWatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
