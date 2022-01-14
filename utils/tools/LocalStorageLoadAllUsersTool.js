
import {User} from "../../models/User.js";


export function localStorageLoadAllUsersTool(){

    let container = [];

    return new Promise((resolve,reject)=>{

        const employeesKey = "userData";

        const result = window.localStorage.getItem(employeesKey);

        if(result){

            const convertedResult = JSON.parse(result);

            convertedResult.forEach((user)=>{
                    Object.setPrototypeOf(user,User.prototype);
                    container.push(user.toArray());
            })

            resolve({
                data : container,
                original : convertedResult
            });

        }else{
            reject({
                status:false,
                message:"error loading data from the data base !"
            });
        }

    })

}