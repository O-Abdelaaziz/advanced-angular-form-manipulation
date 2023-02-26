import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  HostListener,
  HostBinding,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Highlightable } from '@angular/cdk/a11y';

@Component({
  selector: 'lib-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptionComponent<T> implements OnInit {
  @Input()
  public value: T | null = null;

  @Input()
  public disabledReason: T | null = null;

  @Input()
  @HostBinding('class.disabled')
  public disabled: boolean = false;

  @Output()
  public selected: EventEmitter<OptionComponent<T>> = new EventEmitter<
    OptionComponent<T>
  >();

  @HostBinding('class.selected')
  protected isSelected: boolean = false;

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

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
    this._changeDetectorRef.markForCheck();
  }

  public deselect() {
    this.isSelected = false;
    this._changeDetectorRef.markForCheck();
  }
}
