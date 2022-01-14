
import {SuperVisorsAccountsGenerator} from "../../models/superVisorsAccountsGenerator.js";

import {systemLoginStates} from "../tools/SystemLoginState.js";

export class SuperAccountsFactory extends SuperVisorsAccountsGenerator{

    constructor(superType) {
        super();
        this.superType = superType;
        this.uniqueNumber = `21232123223232`;
    }

    generateAccount() {
        return new Promise((resolve,reject)=>{
            if(this.superType.toLowerCase() === "admin"){
                this.uniqueName = `admin${this.uniqueNumber}techVally@gmail.com`
                this.password = `vally${this.uniqueNumber}vally`;
                this.gainSystemAccess = systemLoginStates.gainedSystemAccess;
                this.valid = systemLoginStates.valid;
                this.userType = this.superType;
                 resolve(this);
            }else if(this.superType.toLowerCase() == "security"){
                this.uniqueName = `security${this.uniqueNumber}techVallysecurity@gmail.com`
                this.password = `vallySecurity${this.uniqueNumber}vallySecurity`;
                this.gainSystemAccess = systemLoginStates.gainedSystemAccess;
                this.valid = systemLoginStates.valid;
                this.userType =this.superType;
                resolve(this);
            }else{
                reject(`error in your parameter type ${this.superType}`);
            }
        })
    }

    tojson(){
        return {
            uniqueName:this.uniqueName,
            password:this.password,
            gainSystemAccess:this.gainSystemAccess,
            valid:this.valid,
            userType:this.userType
        }
    }

}
