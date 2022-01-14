import {SuperUsersStorageService} from "./SuperUsersStorageService.js";
import {SuperVisorsAccountsGenerator} from "../../models/superVisorsAccountsGenerator.js";
export class ValidateSuperData{

    constructor(superData) {
        this.superData = superData;
        this.superDataStorage = new SuperUsersStorageService(null);
    }

    validateSuper(key){
       return new Promise(async(resolve,reject)=>{
           if(!this.superData instanceof SuperVisorsAccountsGenerator){
                reject(`type Error ${this.superData}`);
           }else{
                try{
                    this.superDataStorage.setData(this.superData);
                    await this.superDataStorage.submitData(key);
                    resolve("data added well");
                }catch(error){
                    console.log(error);
                    reject(error);
                }
           }
       });
    }

}