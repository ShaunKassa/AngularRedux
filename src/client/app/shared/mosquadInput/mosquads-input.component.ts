import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';

@Component({
    selector: 'mosquads-inputs',
    moduleId: module.id,
    templateUrl: './mosquads-input.component.html',
    styleUrls: ['mosquads-input.component.css'],
})

export class MosquadsInputComponent {
    @ViewChild('textArea') textAreaRef:ElementRef;
    @ViewChild('highlights') highlightsRef:ElementRef;
    @ViewChild('backdrop') backdropRef:ElementRef;
    constructor(
        private _elementRef: ElementRef
    ) {}

   valueChanged(value: any) {
      let text = value.target.value.replace(/\n$/g, '\n\n')
                 .replace(/^((?![0-3]{14}).)*$/gm, '<mark>$&</mark>')
                 .replace(/ /gm, '<mark>$&</mark>');
      console.log(text);
      this.highlightsRef.nativeElement.innerHTML = text;
      return;
   }

   onScroll(scrollValue: any) {
       let scrollMatch = this.textAreaRef.nativeElement.scrollTop;
       this.backdropRef.nativeElement.scrollTop = scrollMatch;
       return;
   }

}
