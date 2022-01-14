class MailingService{

    #data; //private

    #serviceUrl; //private

    #notifyContract;

    constructor(url , notifyingContract) {

        // this.#data = {}; // literal object

        this.#serviceUrl = url;

        this.#notifyContract = notifyingContract;

    }

    setMailingData(payload){
        this.#data = payload;
    }

    sendMail(){
        return new Promise((resolve,reject)=>{
            if(this.#serviceUrl && this.#data){
                //ajax
                $.ajax(this.#serviceUrl , {
                    type: 'POST',
                    data: JSON.stringify(this.#data),
                    contentType: 'application/json'
                }).done(()=> {
                   if(this.#notifyContract){
                       this.#notifyContract.publish("EmailingService",{
                           status:true,
                       })
                   }
                    resolve('Your mail is sent!');
                }).fail((error)=> {
                   if(this.#notifyContract){
                       this.#notifyContract.publish("EmailingService",{
                           status:false,
                       })
                   }
                    reject('Oops... ' + JSON.stringify(error));
                });
            }else{
                reject("Sorry u didn't provide a url for the service or data not provided");
            }
        })
    }

}