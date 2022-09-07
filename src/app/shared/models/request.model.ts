import { ShoppingItem } from './shopping-item.model';
import { User } from './user.model';

export class RequestItem{
    constructor(public submittedDate: Date|any,
                public shoppingList: Array<ShoppingItem>,
                public status:string,
                public createdByUid?:string,
                public createdByUserName?:string,
                public acceptedByUid?:string,
                public acceptedByUsername?:string,
                public acceptedDate?: Date| any,
                public completedDate?: Date| any,
                public points?:number,
                public notified?:boolean){}
}