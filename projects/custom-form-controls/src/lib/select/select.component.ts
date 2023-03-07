import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  AnimationEvent,
} from '@angular/animations';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  AfterContentInit,
  OnChanges,
  Input,
  Output,
  ViewChild,
  HostListener,
  HostBinding,
  EventEmitter,
  ElementRef,
  ContentChildren,
  QueryList,
  OnDestroy,
  ChangeDetectionStrategy,
  SimpleChanges,
  Attribute,
  ChangeDetectorRef,
} from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { merge } from 'rxjs/internal/observable/merge';
import { startWith } from 'rxjs/internal/operators/startWith';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { OptionComponent } from './option/option.component';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';

export type SelectValue<T> = T | T[] | null;

// There is an alias for 'void => *' is ':enter'
// There is an alias for '* => void' is ':leave'

@Component({
  selector: 'lib-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  animations: [
    trigger('dropDown', [
      state('void', style({ transform: 'scaleY(0)', opacity: 0 })),
      state('*', style({ transform: 'scaleY(1)', opacity: 1 })),
      transition(':enter', [animate('320ms cubic-bezier(0, 1, 0.45, 1.34)')]),
      transition(':leave', [
        animate('420ms cubic-bezier(0.88, -0.7, 0.86, 0.85)'),
      ]),
    ]),
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<T>
  implements OnChanges, AfterContentInit, OnDestroy, ControlValueAccessor
{
  @Input()
  public label: string = '';

  @Input()
  public searchable: boolean = false;

  @HostBinding('class.disabled')
  @Input()
  public disabled: boolean = false;

  @Input()
  public displayWith: ((value: T) => string | number) | null = null;

  @Input()
  compareWith: (v1: T | null, v2: T | null) => boolean = (v1, v2) => v1 === v2;

  @Input()
  set value(value: SelectValue<T>) {
    this.setupValue(value);
    this.onChange(this.value);
    this.highlightSelectedOptions();
  }

  get value() {
    if (this.selectionModel.isEmpty()) {
      return null;
    }
    if (this.selectionModel.isMultipleSelection()) {
      return this.selectionModel.selected;
    }
    return this.selectionModel.selected[0];
  }

  private selectionModel = new SelectionModel<T>(
    coerceBooleanProperty(this.multiple)
  );

  @Output()
  public opened = new EventEmitter<void>();

  @Output()
  public closed = new EventEmitter<void>();

  @Output()
  public searchChanged = new EventEmitter<string>();

  @Output()
  public selectionChanged = new EventEmitter<SelectValue<T>>();

  private unsubscribe$ = new Subject<void>();

  private listKeyManager!: ActiveDescendantKeyManager<OptionComponent<T>>;

  @HostBinding('class.select-panel-open')
  public isOpen: boolean = false;

  @HostBinding('att.tabIndex')
  @Input()
  public tabIndex = 0;

  private optionMap = new Map<T | null, OptionComponent<T>>();

  protected get displayValue() {
    if (this.displayWith && this.value) {
      if (Array.isArray(this.value)) {
        return this.value.map(this.displayWith);
      }
      return this.displayWith(this.value);
    }
    return this.value;
  }

  protected onChange: (newValue: SelectValue<T>) => void = () => {};
  protected onToched: () => void = () => {};

  @HostListener('blur')
  public markAsTouched() {
    if (!this.disabled && !this.isOpen) {
      this.onToched();
      this.changeDetectorRef.markForCheck();
    }
  }

  @HostListener('click')
  public open() {
    if (this.disabled) return;
    this.isOpen = true;
    if (this.searchable) {
      setTimeout(() => {
        this.searchInputEl.nativeElement.focus();
      }, 0);
    }
    this.changeDetectorRef.markForCheck();
  }

  public close() {
    this.isOpen = false;
    this.onToched();
    this.hostEl.nativeElement.focus();
    this.changeDetectorRef.markForCheck();
  }

  @HostListener('keydown', ['$event'])
  protected onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown' && !this.isOpen) {
      this.open();
      return;
    }
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && this.isOpen) {
      this.listKeyManager.onKeydown(e);
      return;
    }
  }

  @ContentChildren(OptionComponent, { descendants: true })
  options!: QueryList<OptionComponent<T>>;

  @ViewChild('input')
  public searchInputEl!: ElementRef<HTMLInputElement>;

  constructor(
    @Attribute('multiple') private multiple: string,
    private changeDetectorRef: ChangeDetectorRef,
    private hostEl: ElementRef
  ) {}

  writeValue(value: SelectValue<T>): void {
    this.setupValue(value);
    this.highlightSelectedOptions();
    this.changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onToched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['compareWidth']) {
      this.selectionModel.compareWith = changes['compareWidth'].currentValue;
      this.highlightSelectedOptions();
    }
  }

  ngAfterContentInit(): void {
    this.listKeyManager = new ActiveDescendantKeyManager(
      this.options
    ).withWrap();
    this.highlightSelectedOptions();
    this.selectionModel.changed
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((values) => {
        values.removed.forEach((rv) => this.optionMap.get(rv)?.deselect());
        values.added.forEach((av) =>
          this.optionMap.get(av)?.highlightAsSelected()
        );
      });
    this.options.changes
      .pipe(
        startWith<QueryList<OptionComponent<T>>>(this.options),
        tap(() => this.refreshOptionMap()),
        tap(() => queueMicrotask(() => this.highlightSelectedOptions())),
        switchMap((options) => merge(...options.map((o) => o.selected))),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((selectedOption) => this.handleSelection(selectedOption));
  }

  public onPanelAnimationDone({ fromState, toState }: AnimationEvent) {
    if (fromState === 'void' && toState === null && this.isOpen) {
      this.opened.emit();
    }

    if (fromState === null && toState === 'void' && !this.isOpen) {
      this.closed.emit();
    }
  }

  public onClearSelecion(event?: Event) {
    event?.stopPropagation();
    if (this.disabled) return;
    this.selectionModel.clear();
    this.selectionChanged.emit(this.value);
    this.onChange(this.value);
    this.changeDetectorRef.markForCheck();
  }

  private handleSelection(selectedOption: OptionComponent<T>): void {
    if (this.disabled) {
      return;
    }
    if (selectedOption.value) {
      this.selectionModel.toggle(selectedOption.value);
      this.selectionChanged.emit(this.value);
      this.onChange(this.value);
    }
    if (!this.selectionModel.isMultipleSelection) {
      this.close();
    }
  }

  private setupValue(value: SelectValue<T>) {
    this.selectionModel.clear();
    if (value) {
      if (Array.isArray(value)) {
        this.selectionModel.select(...value);
      } else {
        this.selectionModel.select(value);
      }
      // this.highlightSelectedOptions(value);
    }
  }

  private highlightSelectedOptions() {
    const valueWithUpdateReferences = this.selectionModel.selected.map(
      (value) => {
        const correspondingOption = this.findOptionsByValue(value);
        return correspondingOption ? correspondingOption.value! : value;
      }
    );
    this.selectionModel.clear();
    this.selectionModel.select(...valueWithUpdateReferences);
    // this.findOptionsByValue(value)?.highlightAsSelected();
  }

  private findOptionsByValue(value: T | null) {
    if (this.optionMap.has(value)) {
      return this.optionMap.get(value);
    }
    return (
      this.options && this.options.find((o) => this.compareWith(o.value, value))
    );
  }

  private refreshOptionMap() {
    this.optionMap.clear();
    this.options.forEach((o) => this.optionMap.set(o.value, o));
  }

  protected onHandleInput(event: Event) {
    this.searchChanged.emit((event.target as HTMLInputElement).value);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
