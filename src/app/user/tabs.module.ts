import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CommonComponentsModule } from '../common/common.module';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { AppHeaderComponent } from './app-header/app-header.component';
import { ProfilePageModule } from './profile/profile.module';
import { ActivityPage } from './activity/activity.page';
import { FriendsPage } from './friends/friends.page';
import { SettingsPage } from './settings/settings.page';
import { SponsorAdPage } from './sponsor-ad/sponsor-ad.page';
import { ChangeBubblesPage } from './change-bubbles/change-bubbles.page';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { AddGroupPage } from './add-group/add-group.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    ProfilePageModule,
    CommonComponentsModule,
  ],
  declarations: [
    ActivityPage,
    FriendsPage,
    SettingsPage,
    SponsorAdPage,
    TabsPage,
    ChangeBubblesPage,
    AppHeaderComponent,
    PaymentFormComponent,
    AddGroupPage
  ],
  entryComponents: [ChangeBubblesPage, PaymentFormComponent, AddGroupPage]
})
export class TabsPageModule { }
