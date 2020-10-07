import { Component, OnInit } from '@angular/core';
import { UserInfo, UserInfoService } from '../services/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Dialogs } from '@ionic-native/dialogs/ngx';

@Component({
  selector: 'app-next',
  templateUrl: './next.page.html',
  styleUrls: ['./next.page.scss'],
})
export class NextPage implements OnInit {

  user: UserInfo = {
    id: 1,
    preName: '',
    amount: '',
    date: '',
    perDay: '',
    place: '',
  }
  userId = null;
  qrScan: any;
  constructor(
    private userInfoService: UserInfoService, 
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private nav: NavController, 
    public platform: Platform,
    public qrScanner: QRScanner,
    public dialog: Dialogs) 
    { 
      this.platform.backButton.subscribeWithPriority(0, () =>{
        document.getElementsByTagName("body")[0].style.opacity = "1";
        this.qrScan.unsubscribe();
      })
    }

  ngOnInit() {
    this.userId = this.route.snapshot.params['id'];
    if(this.userId){
      this.loadUserinfo();
    }
  }

  async loadUserinfo(){

    const loading = await this.loadingController.create({
      message: 'Loading User...'
    });
    await loading.present();

    this.userInfoService.getUserinfoId(this.userId).subscribe(res => {
      loading.dismiss();
      this.user = res;
    })
  }

  async saveUserinfo(){

    const loading = await this.loadingController.create({
      message: 'Loading User...'
    });
    await loading.present();

    if(this.userId){
      this.userInfoService.updateUserinfo(this.user, this.userId).then(() => {
        loading.dismiss();
        this.nav.back();
      })
    }
    else{
      this.userInfoService.addUserinfo(this.user).then(() => {
        loading.dismiss();
        this.nav.back();
      })
    }
  }

  StartScan()
{
  this.qrScanner.prepare()
.then((status: QRScannerStatus) => {
   if (status.authorized) {
     
      this.qrScanner.show();
      document.getElementsByTagName("body")[0].style.opacity = "0";
      this.qrScan = this.qrScanner.scan().subscribe((textFound) =>{
        document.getElementsByTagName("body")[0].style.opacity = "1";
        this.qrScan.unsubscribe();
        this.dialog.alert(textFound);

      }, (err) =>{
        this.dialog.alert(JSON.stringify(err));
      })

   } else if (status.denied) {

   } else {

   }
})
.catch((e: any) => console.log('Error is', e));
}
}
