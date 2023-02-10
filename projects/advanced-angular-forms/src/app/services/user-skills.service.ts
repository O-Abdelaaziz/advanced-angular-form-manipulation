import { of, delay } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserSkillsService {
  constructor() {}

  getSkills() {
    return of([
      'Java',
      'SpringBoot',
      'PHP',
      'Laravel',
      'Javascript',
      'Angular',
      'ReactJs',
    ]).pipe(delay(1000));
  }
}
