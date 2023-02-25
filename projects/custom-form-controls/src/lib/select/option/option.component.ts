import {
  Component,
  Input,
  Output,
  OnInit,
  EventEmitter,
  HostListener,
  HostBinding,
} from '@angular/core';

@Component({
  selector: 'lib-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
})
export class OptionComponent implements OnInit {
  @Input()
  public value: string | null = null;

  @Output()
  public selected: EventEmitter<OptionComponent> =
    new EventEmitter<OptionComponent>();

  @HostBinding('class.selected')
  protected isSelected: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  @HostListener('click')
  select() {
    this.isSelected = true;
    this.selected.emit(this);
  }

  deselect() {
    this.isSelected = false;
  }
}
