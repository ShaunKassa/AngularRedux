import {
  Component,
  ElementRef,
  Renderer
} from '@angular/core';

@Component({
    selector: 'mosquads-inputs',
    moduleId: module.id,
    templateUrl: './mosquads-input.component.html',
    styleUrls: ['mosquads-input.component.css'],
})

export class MosquadsInputComponent {
    constructor(
        private _elementRef: ElementRef,
        private renderer: Renderer
    ) {}

   valueChanged(value: any) {
      let text = value.target.value.replace(/\n$/g, '\n\n')
                 .replace(/^((?![0-3]{14}).)*$/gm, '<mark>$&</mark>');
      alert(text);
   }
   onScroll(value: any) {
      let scrollTop = value.target.scrollTop();
      console.log(scrollTop);
   }

}
