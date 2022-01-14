
import {LocalStorageService} from "./StorageService.js";
import {validateStorageRepeatedData} from "./validationService.js";
import {delay} from "../../libs/delay.js";
import {Report} from "../../models/Report.js";



export class LocalStorageReportService extends LocalStorageService{

        constructor(notifierContract) {
            super(notifierContract);
        }

        setData(data) {
            super.setData(data);
        }

        submitData(key) {
            return new Promise(async(resolve, reject)=>{
                if(this.data && key){
                    const response = JSON.parse(window.localStorage.getItem(key));
                    if(response){
                        //bring back the report from literal to Model
                        response.forEach((report)=>{
                            Object.setPrototypeOf(report,Report.prototype);
                            this.dataContainer.push(report.tojson());
                        })
                            this.stageData(key);
                            await delay(4000);
                            if(this.notifyContract){
                                this.notifyContract.publish("SavingReportSuccess",{
                                    status:true,
                                    data:this.data.tojson()
                                });
                            }
                            resolve("data has set successfully !");
                    }else{
                        this.stageData(key);
                        await delay(5000);
                        if(this.notifyContract){
                            this.notifyContract.publish("SavingReportFailed",{
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