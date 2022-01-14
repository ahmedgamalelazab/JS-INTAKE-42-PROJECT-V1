
export function delay(seconds){
    return new Promise(function(resolve,reject){
        // do some work
        setTimeout(function(){
            resolve("delayed success!!");
        },seconds);
    });
}