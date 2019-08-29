import { Component, OnInit, HostBinding } from '@angular/core';
import { FileWatcherService } from '../core/file-watcher.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  file: File | null;

  constructor(private fileWatcherService: FileWatcherService,
              private router: Router) { }

  ngOnInit() {
  }

  onFileElementChange(event) {
    const e = event.srcElement as HTMLInputElement;
    if (e.files.length) {
      this.fileWatcherService.watchFile(e.files[0]);
      this.router.navigate(['/', 'watch']);
    }
  }

}
