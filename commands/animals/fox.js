const request = require('axios')
module.exports = {
  name: 'fox',
  usage: 'fox',
  aliases: [],
  description: 'Sends a picture of a random fox',
  category: 'animals',
  permissions: [],
  args: false,
  run: function(msg, args) {
    request('https://randomfox.ca/floof/')
    .then(req => msg.channel.send(req.data.image))
    .catch(err => {
      console.error(err)
      msg.channel.send('There was an error, try again later')
    })
  }
}