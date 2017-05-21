import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchResult } from './search-result';

@NgModule({
  declarations: [
    SearchResult,
  ],
  imports: [
    IonicPageModule.forChild(SearchResult),
  ],
  exports: [
    SearchResult
  ]
})
export class SearchResultModule {}
