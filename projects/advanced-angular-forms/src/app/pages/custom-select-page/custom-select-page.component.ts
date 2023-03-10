import { ReactiveFormsModule, FormControl } from '@angular/forms';
import {
  Component,
  ChangeDetectorRef,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModule, SelectValue } from 'custom-form-controls';
import { User } from '../../model/user';

const c = console.log.bind(this);
@Component({
  selector: 'app-custom-select-page',
  standalone: true,
  imports: [CommonModule, SelectModule, ReactiveFormsModule],
  templateUrl: './custom-select-page.component.html',
  styleUrls: [
    './custom-select-page.component.scss',
    '../../style/common-page.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomSelectPageComponent implements OnInit {
  public selectValue: FormControl<SelectValue<User>> = new FormControl([
    new User(1, 'ouakala abdelaaziz', 'abdelaaziz', 'algeria', false),
    new User(1, 'ouakala ahmed', 'ahmed', 'algeria', true),
  ]);

  public users: User[] = [
    new User(1, 'ouakala abdelaaziz', 'abdelaaziz', 'algeria', false),
    new User(1, 'ouakala ahmed', 'ahmed', 'algeria', true),
    new User(1, 'mahi ', 'amine', 'algeria', false),
  ];

  public filteredUsers = this.users;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.selectValue.valueChanges.subscribe(this.onSelectionChanged);
  }

  onSearchChanged(queryString: string) {
    this.filteredUsers = this.users.filter((user) =>
      user.name.toLowerCase().startsWith(queryString.toLowerCase())
    );
  }

  displayWithFn(user: User) {
    return user.name;
  }

  compareWithFn(user: User | null, user2: User | null) {
    return user?.id === user2?.id;
  }

  onSelectionChanged(value: unknown) {
    console.log('Selected value: ', value);
  }
}
