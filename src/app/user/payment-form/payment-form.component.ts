import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements OnInit {
  pop: PopoverController;
  price = 0;

  constructor(navParams: NavParams) {
    this.price = navParams.get('price');

    this.pop = navParams.get('popoverController');
  }

  ngOnInit() {}

  close() {
    this.pop.dismiss();
  }
}
