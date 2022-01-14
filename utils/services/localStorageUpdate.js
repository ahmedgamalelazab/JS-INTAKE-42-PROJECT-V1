import { User} from "../../models/User.js";

import {LocalStorageService} from "../services/StorageService.js";


export class LocalStorageUpdateService{

    constructor(key) {
            this.targetKey = key;
    }

    //this will represent the original user from the dashboard
    updateUserInLocalStorage(user){
        ;
            return new Promise(async (resolve,reject)=>{
                const data = window.localStorage.getItem(this.targetKey);
                if(data){
                        let convert = JSON.parse(data);
                        convert = convert.filter((convertedUser)=>{
                            return convertedUser.email != user.email;
                        })

                    convert.push(user);
                        convert.forEach((updatedUser)=>{
                            Object.setPrototypeOf(updatedUser,User.prototype);
                        });

                    window.localStorage.setItem(this.targetKey,JSON.stringify(convert));

                    resolve({
                        status:true,
                        message:"data inserted well",
                        data : convert,
                    })

                }else{
                    reject({
                        status:false,
                        message:"wrongKey",
                        service:"localStorageService"
                    });
                }
            })
    }


}