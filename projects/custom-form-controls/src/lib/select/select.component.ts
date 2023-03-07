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
} from '@angular/core';
import { Subject, takeUntil, tap } from 'rxjs';
import { merge } from 'rxjs/internal/observable/merge';
import { startWith } from 'rxjs/internal/operators/startWith';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { OptionComponent } from './option/option.component';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent<T>
  implements OnChanges, AfterContentInit, OnDestroy
{
  @Input()
  public label: string = '';

  @Input()
  public searchable: boolean = false;

  @Input()
  public displayWith: ((value: T) => string | number) | null = null;

  @Input()
  compareWith: (v1: T | null, v2: T | null) => boolean = (v1, v2) => v1 === v2;

  @Input()
  set value(value: SelectValue<T>) {
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

  @HostBinding('class.select-panel-open')
  public isOpen: boolean = false;

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

  @HostListener('click')
  public open() {
    this.isOpen = true;
    if (this.searchable) {
      setTimeout(() => {
        this.searchInputEl.nativeElement.focus();
      }, 0);
    }
  }

  public close() {
    this.isOpen = false;
  }

  @ContentChildren(OptionComponent, { descendants: true })
  options!: QueryList<OptionComponent<T>>;

  @ViewChild('input')
  public searchInputEl!: ElementRef<HTMLInputElement>;

  constructor(@Attribute('multiple') private multiple: string) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['compareWidth']) {
      this.selectionModel.compareWith = changes['compareWidth'].currentValue;
      this.highlightSelectedOptions();
    }
  }

  ngAfterContentInit(): void {
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

  private handleSelection(selectedOption: OptionComponent<T>): void {
    if (selectedOption.value) {
      this.selectionModel.toggle(selectedOption.value);
      this.selectionChanged.emit(this.value);
    }
    if (!this.selectionModel.isMultipleSelection) {
      this.close();
    }
  }

  public onPanelAnimationDone({ fromState, toState }: AnimationEvent) {
    if (fromState === 'void' && toState === null && this.isOpen) {
      this.opened.emit();
    }

    if (fromState === null && toState === 'void' && !this.isOpen) {
      this.closed.emit();
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

  public onClearSelecion(event: Event) {
    event.stopPropagation();
    this.selectionModel.clear();
    this.selectionChanged.emit(this.value);
  }

  protected onHandleInput(event: Event) {
    this.searchChanged.emit((event.target as HTMLInputElement).value);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
