/**
 * Created by Tony Wang on 8/22/16.
 */
import {ViewChild, Input, Component, ElementRef} from "@angular/core";
import {CanvasService} from "../service/canvasService";
@Component({
  selector: '[thumbnail]',
  template: `<canvas #childCanvas></canvas>`,
  providers: [CanvasService],
  styles: [`
    img, canvas {
      width: 150px;
    }
  `]
})
export class Thumbnail {
  @Input() filter:string = '';
  @Input() image:HTMLImageElement;
  @ViewChild('childCanvas') childCanvas:ElementRef;

  constructor(private _cs:CanvasService) {
  };

  ngAfterViewInit() {
    if (this.image && this.childCanvas) {
      this.initCanvas();
    }
  }

  ngOnChanges() {
    if (this.image && this.childCanvas) {
      this.initCanvas();
    }
  }

  initCanvas() {
    this._cs.initCanvas(this.childCanvas.nativeElement, this.image);

    let filterName = this.filter.toLowerCase();

    if (this._cs[filterName])
      this._cs[filterName]();
    else
      this._cs.resetCanvas();
  }
}
