import {LongPoolingService} from "./LongPoolingService.js";


export class UserAttendanceRequestPoolingService extends LongPoolingService{

        constructor(notifier,dataBaseKey) {
            super(notifier,dataBaseKey);
            this.result = [];
            this.usersQueue = [];
            this.pool = null;
        }

        startPooling(seconds) {
            if(this.pool){
                console.log(this.pool);
                clearInterval(this.pool);
            }
            this.pool = setInterval(()=>{
                if(JSON.parse(window.localStorage.getItem(this.dataBaseKey))){
                    this.result = JSON.parse(window.localStorage.getItem(this.dataBaseKey));
                    //at this time the result will be array not object any more
                    if(this.result){
                        //we are supposing that we are searching for userData

                        this.result.forEach((user,i)=>{
                            if(user.attendanceTime !== undefined && user.attendanceTime !==""){
                                //notify me only if u found someone
                                this.usersQueue.push(user);
                            }
                        })
                    }
                    this.notifier.publish("EmployeeSentAttendanceRequest",{
                        message:`user attendance notified : ✅`,
                        data:this.usersQueue
                    });
                    this.usersQueue = [];
                }else{
                    this.result = [];
                    this.notifier.publish("NoRecordForUsersYet",{
                        message:`no user yet recorded in the data base`
                    });
                }
            },seconds);
            return this.result;
        }

    stopPooling() {
            clearInterval(this.pool);
            console.log(this.pool);
            this.pool = null;
            this.result = [];
            this.usersQueue = [];
            super.stopPooling();

        }


}