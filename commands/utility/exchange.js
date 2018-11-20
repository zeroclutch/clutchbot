const request = require('axios')
module.exports = {
  name: 'exchange',
  usage: 'exchange <amount> <currency1> <currency2>',
  aliases: ['exc'],
  description: 'Exchanges two currencies for each other, use 3 letter currency symbols, such as USD',
  category: 'utility',
  permissions: [],
  args: false,
  loader: true,
  run: function(msg, args) {
    const amount = args[0].replace(/\D/g,''),
          currency1 = args[1].toUpperCase(),
          currency2 = args[2].toUpperCase();
    if(amount && currency1 && currency2) {
      request(`https://api.exchangeratesapi.io/latest?symbols=${currency1},${currency2}`)
      .then(res => {
        const rates = res.data.rates
        msg.channel.sendMsgEmbed(`${amount} ${currency1} is ${(rates[currency2]/rates[currency1]*parseInt(amount)).toFixed(3)} ${currency2}`)
      })
      .catch(err => {
        console.error(err)
        msg.channel.sendMsgEmbed(`Incorrect usage of this command. Try \`${msg.prefix}help exchange\` for help.`)
      })
    } else {
      msg.channel.sendMsgEmbed(`Incorrect usage of this command. Try \`${msg.prefix}help exchange\` for help.`)
    }
  }
}