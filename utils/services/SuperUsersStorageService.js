import {LocalStorageService} from "./StorageService.js";
import {SuperAccountsFactory} from "./SuperAccountsFactory.js";
import {delay} from "../../libs/delay.js";


export class SuperUsersStorageService extends LocalStorageService{

    constructor(notifyingContract) {
        super(notifyingContract); // don't need to bother the notification now
    }

    submitData(key){
        return new Promise(async(resolve, reject)=>{
            if(this.data && key){
                const response = JSON.parse(window.localStorage.getItem(key));
                if(response){
                    response.forEach((user)=>{
                        Object.setPrototypeOf(user,SuperAccountsFactory.prototype);
                        this.dataContainer.push(user.tojson());
                    })
                        this.stageData(key);
                        await delay(4000);
                        if(this.notifyContract){
                            this.notifyContract.publish("storageService",{
                                status:true,
                                data:this.data.tojson()
                            });
                        }
                }else{
                    this.stageData(key);
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

