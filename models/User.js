
import {systemLoginStates} from "../utils/tools/SystemLoginState.js";

export class User{

    constructor(firstName, lastName, address,email,age) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.email = email;
        this.age = age;
        this.gainSystemAccess = systemLoginStates.provokedSystemAccess;
        this.valid = systemLoginStates.notValid;
        this.userType="";
        this.uniqueName="";
        this.password = "";
        this.briefReport = "";
        this.userAttendanceDate = "";
        this.state = 'offline';
    }


    getPersonName(){
        return `${this.firstName} ${this.lastName}`;
    }

    getPersonAddress(){
        return this.address;
    }


    getPersonEmail(){
        return this.email;
    }

    getPersonAge(){
        return this.age;
    }


    tojson(){
        const json = {};
        json.firstName = this.firstName;
        json.lastName = this.lastName;
        json.address = this.address;
        json.email = this.email;
        json.age = this.age;
        json.gainSystemAccess = this.gainSystemAccess;
        json.valid = this.valid;
        json.userType = this.userType;
        json.uniqueName = this.uniqueName;
        json.password = this.password;
        json.userBriefReport = this.briefReport;
        json.userAttendaceDate = this.userAttendanceDate;
        json.userLoginState = this.state;
        return json;
    }

    toArray(){

        return [

                `${this.firstName} ${this.lastName}`,
                `${this.email}`,
                `${this.userType}`,
                `${this.valid}`,

        ];

    }

}