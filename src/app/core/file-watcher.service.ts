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
  preparingList: String[] = [];
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
    
    this.loadSheet1(workbook.Sheets[workbook.SheetNames[0]]);
    this.loadSheet2(workbook.Sheets[workbook.SheetNames[1]]);

    this.modelUpdated.emit();
  }

  loadSheet1(sheet: xlsx.Sheet) {
    const range = xlsx.utils.decode_range(sheet['!ref']);
    const columnCount = range.e.c + 1;
    const rowCount = range.e.r + 1;
    this.modelHeader = _.map(_.range(columnCount), c => {
      const cell = sheet[xlsx.utils.encode_cell({ c, r: 0 })];
      return cell ? cell['w'] : '';
    });

    console.log(range);
    this.modelEntries = _.map(_.range(rowCount - 1), r => {
      const rank = r;
      const data = _.map(_.range(columnCount), c => {
        const cell = sheet[xlsx.utils.encode_cell({ c, r: r + 1 })];
        return cell ? cell['w'] : '';
      });
      const cell = sheet[xlsx.utils.encode_cell({ c: columnCount - 1, r: r + 1 })];
      const score = cell ? Number(cell['w']) : 0;
      return { rank, data, score, position: rank };
    });
  }

  loadSheet2(sheet: xlsx.Sheet) {
    const range = xlsx.utils.decode_range(sheet['!ref']);
    const columnCount = range.e.c + 1;
    const rowCount = range.e.r + 1;
    this.preparingList = _.map(_.range(rowCount), r => {
      return sheet[xlsx.utils.encode_cell({ c: 0, r })]['v'];
    });
  }
}
