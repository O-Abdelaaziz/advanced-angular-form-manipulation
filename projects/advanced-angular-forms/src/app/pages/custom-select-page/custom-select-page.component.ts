import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'custom-form-controls';
import { User } from '../../model/user';

const c = console.log.bind(this);
@Component({
  selector: 'app-custom-select-page',
  standalone: true,
  imports: [CommonModule, SelectModule],
  templateUrl: './custom-select-page.component.html',
  styleUrls: [
    './custom-select-page.component.scss',
    '../../style/common-page.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSelectPageComponent implements OnInit {
  public selectedValue: string | null = null;
  public users: User[] = [
    new User(1, 'ouakala abdelaaziz', 'abdelaaziz', 'algeria', false),
    new User(1, 'ouakala ahmed', 'ahmed', 'algeria', true),
    new User(1, 'mahi ', 'amine', 'algeria', false),
  ];

  constructor() {}

  ngOnInit(): void {}

  public onSelectionChanged(value: unknown) {
    // console.log(event);
    c('Selected value: ', value);
  }
}
