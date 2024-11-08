const {createOrder,verifyOrder,getNotification,registration} = require('../controller/user.controller')

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
};
