import { Component } from '@angular/core';

@Component({
  selector: 'app-boarding-pass',
  templateUrl: './boarding-pass.component.html',
  styleUrls: ['./boarding-pass.component.css']
})
export class BoardingPassComponent {

    num : number[];

    constructor() {
        this.num = [];

        for(let i = 1; i <= 10; i++) {
            this.num.push(i);
        }
    }
}
