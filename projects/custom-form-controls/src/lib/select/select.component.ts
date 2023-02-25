import { Component, OnInit, Input, HostListener } from '@angular/core';

@Component({
  selector: 'lib-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {
  @Input()
  public label: string = '';

  @Input()
  public value: string | null = null;

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
}
