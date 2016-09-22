import {
  Component,
  Renderer,
  ElementRef,
  forwardRef,
  Input,
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
    _regEx: any;
    constructor(
        private renderer: Renderer,
        private elementRef: ElementRef
    ) {}

    get regEx(): any {
        return this._regEx;
    }

    @Input('regEx')
    set regEx(value: any) {
        this._regEx = value;
        this.updateState();
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

    updateState() {
        let value = this.textAreaRef.nativeElement.value;
        let regEx = new RegExp(this._regEx, 'gm');
        let text = value.replace(/\n$/g, '\n\n')
        .replace(regEx, '<mark>$&</mark>')
        .replace(/ /gm, '<mark>$&</mark>');
        this.highlightsRef.nativeElement.innerHTML = text;
    }

    valueChanged(value: any) {
        this.updateState();
        this.propagateChange(value.target.value);
    }

    onScroll(scrollValue: any) {
        let scrollMatch = this.textAreaRef.nativeElement.scrollTop;
        this.backdropRef.nativeElement.scrollTop = scrollMatch;
    }

}
