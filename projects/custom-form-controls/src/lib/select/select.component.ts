import {
  trigger,
  state,
  style,
  transition,
  animate,
  AnimationEvent,
} from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  AfterContentInit,
  Input,
  Output,
  HostListener,
  EventEmitter,
  ContentChildren,
  QueryList,
  OnDestroy,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { merge } from 'rxjs/internal/observable/merge';
import { startWith } from 'rxjs/internal/operators/startWith';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { OptionComponent } from './option/option.component';

export type SelectValue<T> = T | null;

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
})
export class SelectComponent<T> implements AfterContentInit, OnDestroy {
  @Input()
  public label: string = '';

  @Input()
  set value(value: SelectValue<T>) {
    this.selectionModel.clear();
    if (value) {
      this.selectionModel.select(value);
      // this.highlightSelectedOptions(value);
    }
  }
  get value() {
    return this.selectionModel.selected[0] || null;
  }

  private selectionModel = new SelectionModel<T>();

  @Output()
  public opened = new EventEmitter<void>();

  @Output()
  public closed = new EventEmitter<void>();

  @Output()
  public selectionChanged = new EventEmitter<SelectValue<T>>();

  private unsubscribe$ = new Subject<void>();

  public isOpen: boolean = false;

  @HostListener('click')
  public open() {
    this.isOpen = true;
  }

  public close() {
    this.isOpen = false;
  }

  @ContentChildren(OptionComponent, { descendants: true })
  options!: QueryList<OptionComponent<T>>;

  constructor() {}

  ngAfterContentInit(): void {
    this.highlightSelectedOptions(this.value);
    this.selectionModel.changed
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((values) => {
        values.removed.forEach((rv) => this.findOptionsByValue(rv)?.deselect());
        values.added.forEach(av => this.findOptionsByValue(av)?.highlightAsSelected());
      });
    this.options.changes
      .pipe(
        startWith<QueryList<OptionComponent<T>> >(this.options),
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
    this.close();
  }

  public onPanelAnimationDone({ fromState, toState }: AnimationEvent) {
    if (fromState === 'void' && toState === null && this.isOpen) {
      this.opened.emit();
    }

    if (fromState === null && toState === 'void' && !this.isOpen) {
      this.closed.emit();
    }
  }

  private highlightSelectedOptions(value: SelectValue<T>) {
    this.findOptionsByValue(value)?.highlightAsSelected();
  }

  private findOptionsByValue(value: SelectValue<T>) {
    return this.options && this.options.find((o) => o.value === value);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
