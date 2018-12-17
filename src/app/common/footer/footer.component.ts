import { Component, Output } from "@angular/core";
import { NavController } from "@ionic/angular";
import { Subject } from "rxjs";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"]
})
export class FooterComponent {
  @Output() onFooterNavigate = new Subject();

  constructor(private nav: NavController) {}


  signOut() {
    localStorage.removeItem("token");
    setTimeout(() => {
      
      this.nav.navigateForward(["welcome"], true);
    }, 0);
  }

  public navigate(link: string) {
    
    this.nav.navigateForward([link], true);
    this.onFooterNavigate.next(link);
  }
}
