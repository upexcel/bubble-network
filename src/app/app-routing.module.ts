import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoggedInGuard } from './authentification/loddeg-in.guard';

import { MainContainerPage } from './main-page/main-container/main-container.page';

import { SigninComponent } from './authentification/signin/signin.component';
import { SignupComponent } from './authentification/signup/signup.component';
import { PassRecoveryComponent } from './authentification/pass-recovery/pass-recovery.component';
import { LoggedOutGuard } from './authentification/logged-out.guard';
import { FollowersPage } from './user/followers/followers.page';
import { FollowingsPage } from './user/followings/followings.page';
import { AllBubblierPage } from './user/allbubblier/allbubblier.page';
import { NewBubblePostComponent } from './common/new-bubble-post/new-bubble-post';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: 'main',
    component: MainContainerPage,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'newBubblePost',
    component: NewBubblePostComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'followers',
    component: FollowersPage,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'following',
    component: FollowingsPage,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'allbubblier',
    component: AllBubblierPage,
    canActivate: [LoggedInGuard]
  },
  {
    path: '',
    loadChildren: './user/tabs.module#TabsPageModule',
    canActivate: [LoggedInGuard]
  },
  {
    path: 'chats',
    loadChildren: './chats/chats.module#ChatsPageModule',
    canActivate: [LoggedInGuard]
  },
  {
    path: 'welcome',
    children: [
      {
        path: '',
        component: SigninComponent
      },
      {
        path: 'signup',
        component: SignupComponent
      },
      {
        path: 'recovery',
        component: PassRecoveryComponent
      }
    ],
    canActivate: [LoggedOutGuard]
  },
  { path: 'live-video', loadChildren: './live-video/live-video.module#LiveVideoPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
