import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { NavController } from "@ionic/angular";

@Injectable()
export class LoggedOutGuard implements CanActivate {
  constructor(private nav: NavController) {}

  canActivate() {
    const loggedIn = !!localStorage.getItem("token");

    if (!loggedIn) {
      return true;
    } else {
      this.nav.navigateForward(["main"], true);
      return false;
    }
  }
}
