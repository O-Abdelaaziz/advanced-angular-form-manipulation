import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  public searchString = '';
  public reactiveSearchString = new FormControl('');

  constructor() {}

  ngOnInit(): void {
    this.reactiveSearchString.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(console.log);
  }

  findSomething(search: string) {
    console.log(search);
  }
}
