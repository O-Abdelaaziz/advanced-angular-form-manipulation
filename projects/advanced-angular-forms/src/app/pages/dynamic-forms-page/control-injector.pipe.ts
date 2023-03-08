import { inject, Injector, Pipe, PipeTransform } from '@angular/core';
import { DynamicControl } from '../../model/dynamic-forms';
import { CONTROL_DATA } from './control-data.token';


@Pipe({
  name: 'controlInjector',
  standalone: true,
})
export class ControlInjectorPipe implements PipeTransform {
  injector = inject(Injector);

  transform(controlKey: string, config: DynamicControl): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        {
          provide: CONTROL_DATA,
          useValue: { controlKey, config },
        },
      ],
    });
  }
}
