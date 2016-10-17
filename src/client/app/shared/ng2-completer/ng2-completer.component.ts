import { Component, Input, Output, EventEmitter, OnInit, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CompleterDirective } from './directives/ctr-completer';
import { DropdownDirective } from './directives/ctr-dropdown';
import { InputDirective } from './directives/ctr-inputs';
import { ListDirective } from './directives/ctr-list';
import { RowDirective } from './directives/ctr-row';
import { CompleterListItemComponent } from './completer-list-item.component';
import { CompleterData } from './completer-data';
import { CompleterItem } from './completer-item';
import { MAX_CHARS, MIN_SEARCH_LENGTH, PAUSE, TEXT_SEARCHING, TEXT_NORESULTS } from './globals';


import 'rxjs/add/operator/catch';

const noop = () => { return; };

const COMPLETER_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CompleterComponent),
    multi: true
};


@Component({
    moduleId: module.id,
    selector: 'ng2-completer',
    templateUrl: 'ng2-completer.component.html',
    styleUrls: ['ng2-completer.component.css'],
    providers: [COMPLETER_CONTROL_VALUE_ACCESSOR],
    directives: [CompleterDirective,
                 DropdownDirective,
                 InputDirective,
                 ListDirective,
                 RowDirective,
                 CompleterListItemComponent]
})
export class CompleterComponent implements OnInit, ControlValueAccessor {
    @Input() public dataService: CompleterData;
    @Input() public inputName = '';
    @Input() public pause = PAUSE;
    @Input() public minSearchLength = MIN_SEARCH_LENGTH;
    @Input() public maxChars = MAX_CHARS;
    @Input() public overrideSuggested = false;
    @Input() public clearSelected = false;
    @Input() public placeholder = '';
    @Input() public matchClass: string;
    @Input() public textSearching = TEXT_SEARCHING;
    @Input() public textNoResults = TEXT_NORESULTS;
    @Input() public fieldTabindex: number;
    @Input() public autoMatch = false;
    @Input() public disableInput = false;
    @Output() public selected = new EventEmitter<CompleterItem>();
    @Output() public highlighted = new EventEmitter<CompleterItem>();
    @Output() public blur = new EventEmitter<void>();

    @ViewChild(CompleterDirective) private completerDirective: CompleterDirective;

    private displaySearching = true;
    private searchStr = '';
    private _onTouchedCallback: () => void = noop;
    private _onChangeCallback: (_: any) => void = noop;

    constructor() { return; }

    get value(): any { return this.searchStr; };

    set value(v: any) {
        if (v !== this.searchStr) {
            this.searchStr = v;
            this._onChangeCallback(v);
        }
    }
    public onTouched() {
        this._onTouchedCallback();
    }

    public writeValue(value: any) {
        this.searchStr = value;
    }

    public registerOnChange(fn: any) {
        this._onChangeCallback = fn;
    }

    public registerOnTouched(fn: any) {
        this._onTouchedCallback = fn;
    }

    public ngOnInit() {
        this.completerDirective.selected.subscribe((item: CompleterItem) => {
            this.selected.emit(item);
            this._onChangeCallback(item.title);
        });
        this.completerDirective.highlighted.subscribe((item: CompleterItem) => {
            this.highlighted.emit(item);
        });

        if (this.textSearching === 'false') {
            this.displaySearching = false;
        }
    }

    public onBlur() {
        this.blur.emit();
        this.onTouched();
    }
}

