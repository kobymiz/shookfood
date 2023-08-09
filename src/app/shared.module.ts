import { NgModule } from '@angular/core';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [],
  exports: [NgbTypeaheadModule, NgbDropdownModule],
  imports: [NgbTypeaheadModule, NgbDropdownModule],
})
export class SharedModule {}
