import { InjectionToken } from "@angular/core";
import { DynamicControl } from "../../model/dynamic-forms";

export interface ControlData {
  controlKey: string;
  config: DynamicControl;
}

export const CONTROL_DATA = new InjectionToken<ControlData>('Control Data');
