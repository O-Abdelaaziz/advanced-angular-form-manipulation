import { Injectable, Type } from '@angular/core';
import { DynamicControl } from '../../model/dynamic-forms';
import { DynamicInputComponent } from './dynamic-controls/dynamic-input.component';
import { DynamicSelectComponent } from './dynamic-controls/dynamic-select.component';

type DynamicControlsMap = {
  [T in DynamicControl['controlType']]: Type<any>;
};

@Injectable({
  providedIn: 'root',
})
export class DynamicControlResolverService {
  private controlComponents: DynamicControlsMap = {
    input: DynamicInputComponent,
    select: DynamicSelectComponent,
  };

  resolve(controlType: keyof DynamicControlsMap) {
    return this.controlComponents[controlType];
  }
}
