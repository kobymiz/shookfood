import { NgModule } from '@angular/core';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BooleanFormatPipe } from './pipes/boolean-formatter.pipe';

@NgModule({
  declarations: [BooleanFormatPipe],
  exports: [NgbTypeaheadModule, NgbDropdownModule, BooleanFormatPipe],
  imports: [NgbTypeaheadModule, NgbDropdownModule],
})
export class SharedModule {}
