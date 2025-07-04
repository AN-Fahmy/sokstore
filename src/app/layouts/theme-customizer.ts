﻿import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

@Component({
    selector: 'setting',
    templateUrl: './theme-customizer.html',
})
export class ThemeCustomizerComponent {
    store: any;
    showCustomizer = false;
    constructor(
        public storeData: Store<any>,
        public router: Router,
    ) {
        this.initStore();
    }
    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
                console.log(d);
            });
    }

    reloadRoute() {
        window.location.reload();
        this.showCustomizer = true;
    }
}
