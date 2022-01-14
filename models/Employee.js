import {User} from "./User.js";


export class Employee extends User{

    //put ur functionality here
    constructor(firstName, lastName, address,email,age) {
        super(firstName, lastName, address,email,age);
        this.uniqueName = "";
        this.password = "";
        this.userType = "Employee";
    }

    //admin when verifying he must talk to employee through this functions
    setEmployeeUniqueName(empName){
        this.uniqueName = empName;
    }

    setEmployeePassword(empPassword){
        this.password = empPassword;
    }

}