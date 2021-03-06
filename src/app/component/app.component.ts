/**
 * Created by Tony Wang on 8/22/16.
 */

let filters = require('./../../assets/data/filters.json');

import {ViewChild, Component, ChangeDetectorRef, ElementRef} from "@angular/core";
import {CanvasService} from "../service/canvas.service";
import {remote, ipcRenderer} from "electron";
import {writeFile} from "fs";
import {Thumbnail} from "./thumbnail.component";
let {dialog} = remote;

@Component({
  selector: 'app',
  template: require('./app.component.html'),
  styles: [require('./app.component.css')],
  providers: [CanvasService],
  directives: [Thumbnail]
})

export class AppComponent {
  @ViewChild('canvas')
  canvas:ElementRef;

  imageElement:HTMLImageElement;
  filters:Array<Object> = filters;
  dropzoneStylesVisible:boolean = true;
  currentFilter:string = '';
  showDropzone:boolean = true;
  openDialogActive:boolean = false;
  saveDialogActive:boolean = false;

  constructor(private _cd:ChangeDetectorRef,
              private _cs:CanvasService) {
    ipcRenderer.on('open-file', this.open.bind(this));
    ipcRenderer.on('save-file', this.save.bind(this));
  }

  showDropzoneStyles() {
    this.dropzoneStylesVisible = true;
    return false;
  }

  hideDropzoneStyles() {
    this.dropzoneStylesVisible = false;
    return false;
  }

  handleDrop(e) {
    e.preventDefault();
    var files:File = e.dataTransfer.files;

    Object.keys(files).forEach((key) => {
      if (files[key].type === 'image/png' || files[key].type === 'image/jpeg') {
        this.loadImage(files[key].path);
      }
      else {
        alert('File must be a PNG or JPEG!');
      }
    });


    return false;
  }

  loadImage(fileName) {
    let image:HTMLImageElement = new Image();
    image.onload = this.imageLoaded.bind(this, this.canvas.nativeElement, image);
    image.src = fileName;
  }

  open() {
    if (!this.openDialogActive && !this.saveDialogActive) {
      this.openDialogActive = true;
      dialog.showOpenDialog((fileNames) => {
        this.openDialogActive = false;
        if (fileNames === undefined) return;
        let fileName = fileNames[0];
        this.loadImage(fileName)
      });
    }
  }

  save() {
    if (!this.saveDialogActive && !this.openDialogActive) {
      this.saveDialogActive = true;
      dialog.showSaveDialog({
        filters: [
          {name: 'png', extensions: ['png']}
        ]
      }, this.saveFile.bind(this));
    }
  }

  saveFile(fileName) {
    this.saveDialogActive = false;
    if (fileName === undefined) return;

    let buffer = this._cs.canvasBuffer(this.canvas.nativeElement, 'image/png');

    writeFile(fileName, buffer, this.saveFileCallback.bind(this, fileName));
  }

  saveFileCallback(fileName, err) {
    let myNotification:Notification;
    if (err) {
      console.log(err);
      myNotification = new Notification('Error', {
        body: 'There was an error; please try again'
      });
    } else {
      myNotification = new Notification('Image Saved', {
        body: fileName
      });
    }
  }

  setFilter(value) {
    let filterName = value.toLowerCase();

    if (this._cs[filterName])
      this._cs[filterName]();
    else
      this._cs.resetCanvas();
  }

  imageLoaded(canvas, image) {
    this.imageElement = image;
    this._cs.initCanvas(canvas, image);

    this.showDropzone = false;
    this.dropzoneStylesVisible = false;

    this._cd.detectChanges();
  }
}
