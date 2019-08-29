import { TestBed } from '@angular/core/testing';

import { FileWatcherService } from './file-watcher.service';

describe('FileWatcherService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileWatcherService = TestBed.get(FileWatcherService);
    expect(service).toBeTruthy();
  });
});
