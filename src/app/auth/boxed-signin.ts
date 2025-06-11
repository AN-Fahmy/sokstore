import { Component, inject } from '@angular/core';
import { toggleAnimation } from 'src/app/shared/animations';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/service/app.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    templateUrl: './boxed-signin.html',
    animations: [toggleAnimation],
})
export class BoxedSigninComponent {
    private readonly _FormBuilder = inject(FormBuilder)

    store: any;
    constructor(
        public translate: TranslateService,
        public storeData: Store<any>,
        public router: Router,
        private appSetting: AppService,
    ) {
        this.initStore();
        localStorage.setItem('rtlClass', 'rtl')
    }

    loginForm:FormGroup = this._FormBuilder.group({
        userName:['admin'],
        password:['admin']
    })

    submitLogin():void{
        let data = this.loginForm.value
        localStorage.setItem('token', '123hewfh134217egwq8gd8wegf328gr')
        localStorage.setItem('refreshToken', 'fhauywegfy4234feeda')
        if(localStorage.getItem('token')){
            this.router.navigate(['/sales-admin'])
        }
    }

    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }

    changeLanguage(item: any) {
        this.translate.use(item.code);
        this.appSetting.toggleLanguage(item);
        if (this.store.locale?.toLowerCase() === 'ae') {
            this.storeData.dispatch({ type: 'toggleRTL', payload: 'rtl' });
        } else {
            this.storeData.dispatch({ type: 'toggleRTL', payload: 'ltr' });
        }
        window.location.reload();
    }
}
