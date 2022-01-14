import {systemLoginStates} from "./SystemLoginState.js";

//supposing now that the obj is type of array .. i need to search
export function localStorageToGateValidator(userUniqueName, userPassword){
    ;
    const storageRules = ["superData","userData"];
    return new Promise((resolve, reject)=>{
        storageRules.forEach((key)=>{
            const data = window.localStorage.getItem(key);
            if(data){
                const convertedData = JSON.parse(data);
                convertedData.forEach((user)=>{
                    console.log(user.uniqueName.toString() === userUniqueName.toString());
                    console.log(user.uniqueName.toString(),userUniqueName.toString());
                    console.log(user.password.toString() === userUniqueName.toString());
                    console.log(user.password.toString(),userPassword.toString());
                    console.log(user.password.toString() === userPassword.toString());
                    if(user.uniqueName.toString() === userUniqueName.toString()
                        && user.password.toString() === userPassword.toString()
                        && user.valid.toString() === systemLoginStates.valid.toString()
                        && user.gainSystemAccess.toString() === systemLoginStates.gainedSystemAccess.toString()){
                        resolve({
                            status:true,
                            message:"ok",
                            usertype:user.userType
                        });
                    }
                })
            }
        })
        reject({status:false,
               detailedMessage:"username or password are in correct Pleas check the security",
               message:"error",
            usertype:"none"
        })
    })
}
