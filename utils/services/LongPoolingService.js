

export class LongPoolingService{

    constructor(notifier,dataBaseKey) {
        this.notifier = notifier;
        this.dataBaseKey = dataBaseKey;
        this.result = {};
        this.pool = null;
    }

     startPooling(seconds){
        if(this.pool){
                clearInterval(this.pool);
        }
         this.pool = setInterval(()=>{
            if(JSON.parse(window.localStorage.getItem(this.dataBaseKey))){
                this.result = JSON.parse(window.localStorage.getItem(this.dataBaseKey));
                if(this.result){
                    let {systemRunning} = this.result;
                    if(systemRunning){
                        this.notifier.publish("systemOnInitRunning",{
                            message:`from the hell to u iam long pooling
                            system is running duuuude !
                            `
                        });
                    }else{
                        this.notifier.publish("systemIsDead",{
                            message:`from the hell to u iam long pooling
                                system is dead sorry for that
                            `
                        });
                    }
                }

            }else{
                this.result = {};
                this.notifier.publish("systemIsDead",{
                    message:`from the hell to u iam long pooling
                                system is dead sorry for that
                            `
                });
            }
        },seconds);
        return this.result;
    }

    stopPooling(){
        clearInterval(this.pool);
    }


}