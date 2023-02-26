import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  HostListener,
  HostBinding,
} from '@angular/core';
import { Highlightable } from '@angular/cdk/a11y';

@Component({
  selector: 'lib-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
})
export class OptionComponent<T> implements OnInit, Highlightable {
  @Input()
  public value: T | null = null;

  @Input()
  public disabledReason: T | null = null;

  @Input()
  @HostBinding('class.disabled')
  public disabled: boolean = false;

  @Output()
  public selected: EventEmitter<OptionComponent<T>> =
    new EventEmitter<OptionComponent<T>>();

  @HostBinding('class.selected')
  protected isSelected: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  @HostListener('click')
  protected select() {
    if (!this.disabled) {
      this.isSelected = true;
      this.selected.emit(this);
    }
  }

  public highlightAsSelected() {
    this.isSelected = true;
  }

  public deselect() {
    this.isSelected = false;
  }

  setActiveStyles(): void {
    throw new Error('Method not implemented.');
  }
  setInactiveStyles(): void {
    throw new Error('Method not implemented.');
  }
  getLabel?(): string {
    throw new Error('Method not implemented.');
  }
}
