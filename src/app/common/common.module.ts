import { IonicModule } from "@ionic/angular";

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { FooterComponent } from "./footer/footer.component";
import { BubblePostComponent } from "./bubble-post/bubble-post.component";
import { BubblesContainerComponent } from "./bubbles-container/bubbles-container.component";
import { SearchFilterPipe } from './search-filter.pipe';

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule],
  declarations: [
    FooterComponent,
    BubblePostComponent,
    BubblesContainerComponent,
    SearchFilterPipe
  ],
  entryComponents: [BubblePostComponent],
  exports: [FooterComponent, BubblePostComponent, BubblesContainerComponent, SearchFilterPipe]
})
export class CommonComponentsModule {}
