import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileWatcherService {

  private currentFile: File

  constructor() { }

  watchFile(file: File) {
    this.currentFile = file;
    console.log(this.currentFile);
    setInterval(() => {
      console.log(file.lastModified);
    }, 1000);
  }
}
