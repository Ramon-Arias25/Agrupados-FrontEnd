import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { Follow } from '../models/follow';


@Injectable()
export class FollowService{
    public url: string;
 
    constructor(public _http: HttpClient){
        this.url = GLOBAL.url;
    }

    addFollow(token,followed, follow: Follow):Observable<any>{
        //no necesita el follow, por alguna razon no lo tomo y se envio por url. . .por url: Funciona!!!
        let params = JSON.stringify(follow);
        let headers = new HttpHeaders().set('Content-Type', 'aplication/json')
                                        .set('Authorization',token);
        //console.log(params);
        return this._http.post(this.url+'follow/'+ followed, params, {headers: headers});
    }

    deleteFollow(token, id):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'aplication/json')
                                        .set('Authorization',token);
        
        return this._http.delete(this.url+'follows/'+ id, {headers: headers});
    }

    getFollowing(token, userId = null, page):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'aplication/json')
                                        .set('Authorization',token);
        
        var url = this.url+'following/';
        if(userId != null){
            var url = this.url+'following/'+userId+'/'+page;    
        }
        //console.log(url);
        return this._http.get(url, {headers: headers});
    }

    getFollower(token, userId = null, page):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'aplication/json')
                                        .set('Authorization',token);
        
        var url = this.url+'followed/';
        if(userId != null){
            var url = this.url+'followed/'+userId+'/'+page;    
        }
        //console.log(url);
        return this._http.get(url, {headers: headers});
    }
    getMyFollows(token):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'aplication/json')
                                        .set('Authorization',token);
        
        return this._http.get(this.url+'getfollows/true', {headers: headers});
    }
}