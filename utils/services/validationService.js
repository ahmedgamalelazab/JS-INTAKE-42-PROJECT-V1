
import {User} from "../../models/User.js";

export function validateDataTemplateService(...params){
    return new Promise((resolve,reject)=>{
        params.forEach((param)=>{
            // ;
            if(param === ""){
                //check for nulls
                reject("pleas complete the form to continue the process");
            }
        })
        resolve(true);
    })
}

export function validateStorageRepeatedData(userToCheck,arr){
    return new Promise((resolve,reject)=>{
        arr.forEach((user)=>{
            Object.setPrototypeOf(user,User.prototype);
            if(user.getPersonName() === userToCheck.getPersonName()
                ||user.getPersonEmail() === userToCheck.getPersonEmail()
            ){
                resolve(true);
            }
        })
        resolve(false);
    })
}