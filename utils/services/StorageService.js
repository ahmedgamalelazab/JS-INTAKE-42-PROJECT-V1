
import {delay} from "../../libs/delay.js"

import {User} from "../../models/User.js";

import {validateStorageRepeatedData} from "./validationService.js";

export class LocalStorageService{

    data;
    dataContainer;
    notifyContract;

    constructor(notifyingContract) {
        //do nothing
        this.dataContainer = [];
        this.notifyContract = notifyingContract;
    }

    setData(data){
        this.data = data;
    }

    stageData(key){
        this.dataContainer.push(this.data.tojson());
        window.localStorage.setItem(key ,JSON.stringify(this.dataContainer));
    }

     submitData(key){
        return new Promise(async(resolve, reject)=>{
           if(this.data && key){
               const response = JSON.parse(window.localStorage.getItem(key));
               if(response){
                    response.forEach((user)=>{
                        Object.setPrototypeOf(user,User.prototype);
                        this.dataContainer.push(user.tojson());
                    })
                   const isUserRepeated = await validateStorageRepeatedData(this.data,this.dataContainer);
                    if(isUserRepeated){
                        reject("user name or email already Exists");
                    }else{
                        this.stageData(key);
                        await delay(4000);
                        if(this.notifyContract){
                            this.notifyContract.publish("storageService",{
                                status:true,
                                data:this.data.tojson()
                            });
                        }
                        resolve("data has set successfully !");
                    }
               }else{
                  this.stageData(key);
                   console.log(JSON.stringify(this.dataContainer));
                   console.log(key);
                   await delay(5000);
                   if(this.notifyContract){
                       this.notifyContract.publish("storageService",{
                           status:true,
                           data:this.data.tojson()
                       });
                   }
                   resolve("data has set successfully !");
               }

           }else{
               reject("no data provided !");
           }
        })
    }
    
}