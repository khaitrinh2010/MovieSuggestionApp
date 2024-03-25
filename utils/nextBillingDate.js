//next billing date monthly
const nextBillingDate = () => {
    const oneMonthFromNow = new Date()
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1) //a month
    return oneMonthFromNow
}

module.exports = nextBillingDate