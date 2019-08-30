import { Injectable, EventEmitter } from '@angular/core';
import { Entry } from '../model/entry.model';
import * as xlsx from 'xlsx';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class FileWatcherService {

  modelHeader: String[] = [];
  modelEntries: Entry[] = [];
  modelUpdated = new EventEmitter<void>();

  private currentFile: File;
  private fileReader = new FileReader();
  private lastReadTimestamp = 0;

  constructor() {
    this.fileReader.onload = this.onDataReady.bind(this);

    setInterval(this.onInterval.bind(this), 1000);
  }

  watchFile(file: File) {
    this.currentFile = file;
    this.lastReadTimestamp = 0;

    console.log(file.name);
    this.onInterval();
  }

  readFile(file: File) {
    this.fileReader.readAsArrayBuffer(this.currentFile);
  }

  onInterval() {
    if (this.currentFile && this.fileReader.readyState !== FileReader.LOADING && this.currentFile.lastModified !== this.lastReadTimestamp) {
      this.lastReadTimestamp = this.currentFile.lastModified;
      this.readFile(this.currentFile);
    }
  }

  onDataReady() {
    const workbook = xlsx.read(this.fileReader.result, { type: 'buffer'});
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const range = xlsx.utils.decode_range(sheet['!ref']);
    const columnCount = range.e.c;
    const rowCount = range.e.r;
    this.modelHeader = _.map(_.range(columnCount), c => sheet[xlsx.utils.encode_cell({ c, r: 0 })]['w']);

    this.modelEntries = _.map(_.range(rowCount - 1), r => {
      const rank = r;
      const data = _.map(_.range(columnCount), c => sheet[xlsx.utils.encode_cell({ c, r: r + 1 })]['w']);
      const score = Number(sheet[xlsx.utils.encode_cell({ c: columnCount - 1, r: r + 1 })]['w']);
      return { rank, data, score, position: rank };
    });

    console.log(sheet);
    this.modelUpdated.emit();
  }
}
