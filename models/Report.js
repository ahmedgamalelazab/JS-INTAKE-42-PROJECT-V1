
import {generateRandomId} from "../utils/tools/generateRandomId.js";

export class Report{

    constructor(reportObject) {
        this.userName = reportObject.userName || '❌' ; // the unique user name
        this.userEmail=reportObject.userEmail || '❌';//this will be the user email
        this.departureTime = reportObject.departureTime || '❌';
        this.attendanceTime = reportObject.attendanceTime || '❌';
        this.message = reportObject.message || '❌';
        this.reportIds = generateRandomId() || '❌'; // this will detect if the report will be monthly or daily
        this.userUniqueIdentifier = reportObject.userUniqueIdentifier || '❌';
        this.reportSubmitTime = reportObject.reportSubmitTime;
        this.confirmed = false;
        this.confirmedOn = "";

    }

    tojson(){
        return {
            userName:this.userName,
            userEmail:this.userEmail,
            departureTime:this.departureTime,
            attendanceTime:this.attendanceTime,
            message:this.message,
            reportIds:this.reportIds,
            userUniqueIdentifier:this.userUniqueIdentifier,
            reportSubmitTime : this.reportSubmitTime,
            confirmed:this.confirmed,
            confirmedOn:this.confirmedOn
        }
    }

    toarray(){
         return [
            this.userName,
            this.userEmail,
            this.departureTime,
            this.attendanceTime,
            this.message,
            this.reportIds,
            this.userUniqueIdentifier,
            this.reportSubmitTime,
        ];
    }

}