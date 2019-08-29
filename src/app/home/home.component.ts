import { Component, OnInit, HostBinding } from '@angular/core';
import { FileWatcherService } from '../core/file-watcher.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  file: File | null

  constructor(private fileWatcherService: FileWatcherService) { }

  ngOnInit() {
  }

  onFileElementChange(event) {
    const e = event.srcElement as HTMLInputElement;
    if (e.files.length) {
      this.fileWatcherService.watchFile(e.files[0]);
    }
  }

}
