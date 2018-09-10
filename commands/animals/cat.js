const request = require('axios')
module.exports = {
  name: 'cat',
  usage: 'cat',
  aliases: [],
  description: 'Sends a picture of a random cat',
  category: 'animals',
  permissions: [],
  args: false,
  run: function(msg, args) {
    request('https://aws.random.cat/meow')
    .then(req => msg.channel.send(req.data.file))
    .catch(err => {
      console.error(err)
      msg.channel.send('There was an error, try again later')
    })
  }
}