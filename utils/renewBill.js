//determine should the user renew the subscription

const renewBill = (user) =>{
    const today = new Date()
    return !user?.nextBillingDate || user?.nextBillingDate <= today
}

module.exports = renewBill