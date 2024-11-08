const {createOrder,verifyOrder,getNotification,registration, genricIntrestedRegistration} = require('../controller/user.controller')

exports.routes = {
  ["/createOrder"]:{
    POST :createOrder,
  },
  ["/verifyOrder"]:{
    POST: verifyOrder
  },
  ["/getNotification"]:{
    POST: getNotification
  },
  ["/registration"]:{
    POST: registration
  },
  ["/genricIntrestedRegistration"]:{
    POST: genricIntrestedRegistration
  },
};
