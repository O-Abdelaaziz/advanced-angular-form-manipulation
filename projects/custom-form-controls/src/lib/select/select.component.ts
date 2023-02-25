import {
  trigger,
  state,
  style,
  transition,
  animate,
  AnimationEvent,
} from '@angular/animations';
import {
  Component,
  OnInit,
  Input,
  Output,
  HostListener,
  EventEmitter,
} from '@angular/core';

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
      transition(':enter', [
        animate('320ms cubic-bezier(0, 1, 0.45, 1.34)'),
      ]),
      transition(':leave', [
        animate('420ms cubic-bezier(0.88, -0.7, 0.86, 0.85)'),
      ]),
    ]),
  ],
})
export class SelectComponent implements OnInit {
  @Input()
  public label: string = '';

  @Input()
  public value: string | null = null;

  @Output()
  public opened = new EventEmitter<void>();

  @Output()
  public closed = new EventEmitter<void>();

  public isOpen: boolean = false;

  @HostListener('click')
  public open() {
    this.isOpen = true;
  }

  public close() {
    this.isOpen = false;
  }

  constructor() {}

  ngOnInit(): void {}

  public onPanelAnimationDone({ fromState, toState }: AnimationEvent) {
    if (fromState === 'void' && toState === null && this.isOpen) {
      this.opened.emit();
    }

    if (fromState === null && toState === 'void' && !this.isOpen) {
      this.closed.emit();
    }
  }
}
