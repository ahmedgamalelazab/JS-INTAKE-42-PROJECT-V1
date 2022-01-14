

export class pubsub{

    #events;
    constructor(){
        this.#events = {};
    }

    subscribe(topic,callback){
        this.#events[topic] = this.#events[topic] || [];
        this.#events[topic].push(callback);
    }

    unsubscribe(topic,callback){
        if(this.#events[topic]){
            this.#events[topic] = this.#events[topic].filter((cb)=>{
                cb !== callback;
            })
        }
    }

    publish(topic , data){
        if(this.#events[topic]){
            this.#events[topic].forEach((cb)=>{
                cb(data);
            })
        }
    }


}