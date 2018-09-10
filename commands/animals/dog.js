const request = require('axios')
module.exports = {
  name: 'dog',
  usage: 'dog',
  aliases: [],
  description: 'Sends a picture of a random dog',
  category: 'animals',
  permissions: [],
  args: false,
  run: function(msg, args) {
    request('https://random.dog/woof.json')
    .then(req => msg.channel.send(req.data.url))
    .catch(err => {
      console.error(err)
      msg.channel.send('There was an error, try again later')
    })
  }
}