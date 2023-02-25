import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from './select.component';
import { OverlayModule } from '@angular/cdk/overlay';
@NgModule({
  declarations: [SelectComponent],
  imports: [CommonModule, OverlayModule],
  exports: [SelectComponent],
})
export class SelectModule {}
