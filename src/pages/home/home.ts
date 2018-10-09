import {Component} from '@angular/core';
import {LoadingController, Platform} from 'ionic-angular';
import {AngularFireAuth} from "@angular/fire/auth";
import {GooglePlus} from "@ionic-native/google-plus";
import * as firebase from "firebase";
import {User} from "firebase";
import {from} from "rxjs/observable/from";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    user: User;

    constructor(private loadingCtrl: LoadingController,
                private afAuth: AngularFireAuth,
                private gplus: GooglePlus,
                private platform: Platform) {
        this.afAuth.user.subscribe(user => {
            this.user = user;
        });
    }

    private nativeGoogleLogin(): void {
        const loader = this.loadingCtrl.create();

        if (!this.user) {
            loader.present();
            this.gplus.login({
                'webClientId': '826626010601-fcjt337ot5qahroestmkdnisn53tlm3u5.apps.googleusercontent.com'
            }).then(user => {
                from(this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(user.idToken))).fina.then(userConnected => {
                    if (userConnected) {
                        this.user = userConnected;
                    }
                }).catch(error => {
                    alert(JSON.stringify(error));
                })
            }).catch(err => {
                alert(JSON.stringify(err));
            })
        }

        // try {
        //
        //     if (!this.user) {
        //         const gplusUser = await this.gplus.login({
        //             'webClientId': '826626010601-fcjt337ot5qahroetmkdnisn53tlm3u5.apps.googleusercontent.com'
        //         });
        //         loader.dismiss();
        //         return await this.afAuth.auth.signInWithCredential(firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken))
        //     }
        //
        // } catch (err) {
        //     console.log(err)
        // }
    }

    async webGoogleLogin(): Promise<void> {
        try {
            const credential = await this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(user => {
                if (user) {
                    alert(JSON.stringify(user.user));
                    this.user = user.user;
                }
            });

        } catch (err) {
            console.log(err)
        }

    }

    googleLogin() {
        if (this.platform.is('cordova')) {
            this.nativeGoogleLogin();
        } else {
            this.webGoogleLogin();
        }
    }

    signOut() {
        this.afAuth.auth.signOut();
    }

}
