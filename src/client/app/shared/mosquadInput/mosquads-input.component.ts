import {
  Component,
  Renderer,
  ElementRef,
  forwardRef,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'mosquads-inputs',
    moduleId: module.id,
    templateUrl: './mosquads-input.component.html',
    styleUrls: ['mosquads-input.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MosquadsInputComponent),
            multi: true
        }
    ]
})

export class MosquadsInputComponent implements ControlValueAccessor {
    @ViewChild('textArea') textAreaRef:ElementRef;
    @ViewChild('highlights') highlightsRef:ElementRef;
    @ViewChild('backdrop') backdropRef:ElementRef;
    constructor(
        private renderer: Renderer,
        private elementRef: ElementRef
    ) {
    }

    propagateChange = (_: any) => {
        return;
    };

    writeValue(value: any) : void {
        this.renderer.setElementProperty(this.textAreaRef.nativeElement, 'value', value);
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    registerOnTouched() {
        return;
    }

    valueChanged(value: any) {
        let text = value.target.value.replace(/\n$/g, '\n\n')
        .replace(/^((?![0-3]{14}).)*$/gm, '<mark>$&</mark>')
        .replace(/ /gm, '<mark>$&</mark>');
        this.highlightsRef.nativeElement.innerHTML = text;
        this.propagateChange(value.target.value);
    }

    onScroll(scrollValue: any) {
        let scrollMatch = this.textAreaRef.nativeElement.scrollTop;
        this.backdropRef.nativeElement.scrollTop = scrollMatch;
    }

}
