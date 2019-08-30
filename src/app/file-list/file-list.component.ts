import { Component, OnInit, OnDestroy } from '@angular/core';
import { FileWatcherService } from '../core/file-watcher.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Entry } from '../model/entry.model';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit, OnDestroy {

  private $finished = new Subject();
  
  modelHeader: String[] = [];
  modelEntries: Entry[] = [];

  constructor(private fileWatcherService: FileWatcherService) { }

  ngOnInit() {
    this.fileWatcherService.modelUpdated.pipe(takeUntil(this.$finished))
      .subscribe(() => this.onUpdated())
  }

  ngOnDestroy() {
    this.$finished.next();
    this.$finished.complete();
  }

  onUpdated() {
    this.modelHeader = this.fileWatcherService.modelHeader;
    this.modelEntries = this.fileWatcherService.modelEntries;

    console.log(this.modelEntries);
  }
}
