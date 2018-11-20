const request = require('axios')
module.exports = {
  name: 'shibe',
  usage: 'shibe',
  aliases: [],
  description: 'Sends a picture of a random shibe',
  category: 'animals',
  permissions: [],
  args: false,
  loader: true,
  run: function(msg, args) {
    request('http://shibe.online/api/shibes?count=1&urls=true')
    .then(req => {
      var fileName = req.data[0].toLowerCase()
      if(fileName.includes('.gif') || fileName.includes('.png') || fileName.includes('.jpeg') || fileName.includes('.jpg')) {
        msg.channel.send('', {
          embed: {
            color: 4513714,
            image: {
              url: req.data[0]
            }
          }
         })
      }
      else msg.channel.sendMsgEmbed(req.data[0])
    })
    .catch(err => {
      console.error(err)
      msg.channel.sendMsgEmbed('There was an error, try again later', '', 13841223)
    })
  }
}