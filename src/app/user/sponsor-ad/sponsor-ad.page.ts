import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PaymentFormComponent } from '../payment-form/payment-form.component';

@Component({
  selector: 'app-sponsor-ad',
  templateUrl: './sponsor-ad.page.html',
  styleUrls: ['./sponsor-ad.page.scss']
})
export class SponsorAdPage implements OnInit {
  public targetedAudience = [
    { val: 'Friends', isChecked: true },
    { val: 'Group', isChecked: false },
    { val: 'Male', isChecked: false },
    { val: 'Female', isChecked: false },
    { val: 'Other', isChecked: false },
    { val: 'All', isChecked: false }
  ];
  dummyOccupations = ['All', 'Doctor', 'Programmer', 'Teacher'];
  dummyLocations = ['All', 'Locations 1', 'Locations 2', 'Locations 3'];
  packages = [
    'A: 1$ per week',
    'B: 10$ per week',
    'C: 20$ per week',
    'D: 50$ per week'
  ];
  selectedPackage = '';
  amountOfWeeks = 0;

  files = [
    {
      url: '../../assets/profile-picture.jpg',
      description: 'Panda Photo',
      author: 'Panda',
      likes: 1234555,
      date: '2018 AUG 10',
      animationDelay: 0,
      starsAnimation: true,
      price: 'A: 1$ per week'
    },
    {
      url: '../../assets/profile-picture.jpg',
      description: 'Panda Photo',
      author: 'Panda',
      likes: 1234555,
      date: '2018 AUG 10',
      animationDelay: 0,
      redBorderAnimation: true,
      price: 'B: 10$ per week'
    },
    {
      url: '../../assets/profile-picture.jpg',
      description: 'Panda Photo',
      author: 'Panda',
      likes: 1234555,
      date: '2018 AUG 10',
      animationDelay: 0,
      raysAnimation: true,
      price: 'C: 20$ per week'
    },
    {
      url: '../../assets/profile-picture.jpg',
      description: 'Panda Photo',
      author: 'Panda',
      likes: 1234555,
      date: '2018 AUG 10',
      animationDelay: 0,
      coloredLinesAnimation: true,
      price: 'D: 50$ per week'
    }
  ];

  dualValue2 = { lower: 18, upper: 60 };

  constructor(public popoverCtrl: PopoverController) {}

  ngOnInit() {}

  onRangeChange() {
    console.log(this.dualValue2);
  }

  get finalPrice() {
    const packagesPrices = {
      'A: 1$ per week': 1,
      'B: 10$ per week': 10,
      'C: 20$ per week': 20,
      'D: 50$ per week': 30
    };

    return packagesPrices[this.selectedPackage] * this.amountOfWeeks;
  }

  async openPayment() {
    const popover = await this.popoverCtrl.create({
      component: PaymentFormComponent,
      componentProps: { price: this.finalPrice, popoverController: this.popoverCtrl},
      translucent: true
    });
    popover.onDidDismiss().then(() => {
    })
    return await popover.present();
  }
}
