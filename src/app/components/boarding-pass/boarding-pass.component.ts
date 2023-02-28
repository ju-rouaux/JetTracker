import { Component } from '@angular/core';

@Component({
  selector: 'boarding-pass',
  templateUrl: './boarding-pass.component.html',
  styleUrls: ['./boarding-pass.component.css']
})
export class BoardingPassComponent {

    num : number[];
    test = "07:50 AM\n(date)";
    constructor() {
        this.num = [];

        for(let i = 1; i <= 10; i++) {
            this.num.push(i);
        }
    }
}
