import { Component } from '@angular/core';

import { HighlightsPage } from '../highlights/highlights';
import { BrowsePage } from '../browse/browse';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HighlightsPage;
  tab2Root: any = BrowsePage;

  constructor() {

  }
}
