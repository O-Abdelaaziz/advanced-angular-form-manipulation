import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'lib-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  @Input()
  public label: string = '';

  @Input()
  public value: string | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
