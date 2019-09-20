import { Component, OnInit, OnDestroy } from '@angular/core';
import { FileWatcherService } from '../core/file-watcher.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Entry } from '../model/entry.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit, OnDestroy {

  private $finished = new Subject();
  
  modelHeader: String[] = [];
  modelEntries: Entry[] = [];
  preparingList: String[] = [];

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
    this.modelEntries = _.sortBy(this.fileWatcherService.modelEntries, entry => -entry.score).slice(0, 10);
  
    this.preparingList = this.fileWatcherService.preparingList;

    for (let i = 0; i < this.modelEntries.length; i++) {
      if (i > 0 && this.modelEntries[i].score == this.modelEntries[i - 1].score) {
        this.modelEntries[i].rank = this.modelEntries[i - 1].rank;
      } else {
        this.modelEntries[i].rank = i + 1;
      }
    }
  }
}
