

export class ResponsiveHelperTool{

    #component;

    constructor(component) {
        this.#component = component;
    }

    //section of service work

    controlResponsive(topicName , resizingFlag , width , smallScreenHandler , largeScreenHandler){
        //this service won't work without have jquery
        $(this.#component).on(topicName,function(){
            if($(this).width()<=width){
                if(resizingFlag === false){
                    smallScreenHandler();
                }
                resizingFlag = true;
                console.log($(this).width());
            }else{
                if(resizingFlag){
                    largeScreenHandler();
                }
                resizingFlag = false;
            }
        });
    }



}