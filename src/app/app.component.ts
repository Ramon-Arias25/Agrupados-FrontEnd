import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck{
  public title: string;
  public identity;
  public url: string;
  

  constructor(
    private myRoute: ActivatedRoute,
    private myRouter: Router,
    private myUserService:UserService
  ){
    this.title = 'Pooled Demo';
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this.myUserService.getIdentity();
  }

  ngDoCheck(){
    this.identity = this.myUserService.getIdentity();
  }

  logout(){
    localStorage.clear();
    this.identity = null;
    this.myRouter.navigate(['/']);
  }
}