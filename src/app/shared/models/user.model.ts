import { PlaceLocation } from './location.model';
import { RequestItem } from './request.model';
import { ShoppingItem } from './shopping-item.model';


export class User{
    constructor(public uid?: string,
                public email?: string,
                public firstName?:string,
                public middleName?:string,
                public lastName?:string,
                public gender?:string,
                public phoneNumber?:string,
                public dateOfBirth?:Date,
                public address1?:String,
                public address2?:String,
                public poBox?:String,
                public country?:String,
                public state?:String,
                public city?:String,
                public requests?:RequestItem[],
                public activeRequests?:RequestItem[],
                public completedRequests?:RequestItem[],
                public placeLocation?:PlaceLocation,
                public photoURL?: string,
                public username?: string,
                public points?:number,
                public myCustomData?: string){}
}