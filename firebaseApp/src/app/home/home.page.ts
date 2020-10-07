import { Component, OnInit } from '@angular/core';
import { UserInfoService, UserInfo } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  users: UserInfo[];
  constructor(
    private userInfo: UserInfoService
  ) {}

  ngOnInit(){
    this.userInfo.getUserinfo().subscribe(res => {
      this.users = res;
    })
  }

  remove(item){
    this.userInfo.removeUserinfo(item.id);
  }
}
