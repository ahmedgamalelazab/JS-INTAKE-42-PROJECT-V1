import { LocalStorageService } from "../utils/services/StorageService.js";

import { Employee } from "../models/Employee.js";

import { validateDataTemplateService } from "../utils/services/validationService.js";

import {pubsub} from "../libs/pubsub.js";

import {delay} from "../libs/delay.js";

const eventSeriesNotifier = new pubsub(); // instance pubs

eventSeriesNotifier.subscribe("EmailingService",async function(data){
    console.log(data);
    const {status} = data;
    if(status === true){
        console.log(data);
        $(".main-content").hide();
        $(".state-ok").show();
        await  delay(1500);
        // alert("redirecting you to system page");
        setTimeout("location.href = 'system.html';",1500);
    }
})

eventSeriesNotifier.subscribe("storageService",function(data){
    const {status} = {data};
    if(status === true){
      eventSeriesNotifier.publish("storageServiceDone",data);
    }

})

const serviceUrl = "https://api.emailjs.com/api/v1.0/email/send";



$(".btn").on("click", async function () {
  console.log("clicked successfully !");
  //get all the dom data and assign in to the local storage object
  // const employee = new Employee();

    $(this).html(
        `
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Registering ...
        `
    );

  const userFirstName = $("#input-user-first-name").val();
  const userLastName = $("#input-user-last-name").val();
  const userAddress = $("#input-user-address").val();
  const userEmailAddress = $("#input-user-email").val();
  const userAge = $("#input-user-age").val();

  try {
    const isValid = await validateDataTemplateService(
      userFirstName,
      userLastName,
      userAddress,
      userEmailAddress,
      userAge
    );

    if (isValid) {
      const userDataModel = new Employee(
        userFirstName,
        userLastName,
        userAddress,
        userEmailAddress,
        userAge
      );


      const sendMailServiceInstance = new MailingService(serviceUrl,eventSeriesNotifier);

      const storageService = new LocalStorageService(eventSeriesNotifier);

      sendMailServiceInstance.setMailingData({
          service_id: "service_3s8tdtl",
          template_id: "template_m2lf0na",
          user_id: "user_9RQgEt6lPmdWEPwoOu2UB",
          template_params: {
              user_email: userEmailAddress,
              message:
                  "thanks for register pleas wait for account checking state !",
          },
      });

      storageService.setData(userDataModel);

      await storageService.submitData("userData");

      await sendMailServiceInstance.sendMail();

    }
  } catch (error) {
    console.log(error);
    await delay(2000);
      $(this).html(
          `
        Register
        `
      );

      $(".main-content").show();
      alert(error);
  }
});
