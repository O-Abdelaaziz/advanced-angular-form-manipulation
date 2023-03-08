export interface DynamicOptions {
  label: string;
  value: string;
}

export interface DynamicControl<T = string> {
  controlType: 'input' | 'select';
  type?: string;
  label: string;
  value: T | null;
  options?: DynamicOptions[];
  validators?: {
    [key: string]: any;
  };
}

export interface DynamicFormConfig {
  description: string;
  controls: {
    [key: string]: DynamicControl;
  };
}
