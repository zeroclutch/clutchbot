const request = require('axios')
module.exports = {
  name: 'fox',
  usage: 'fox',
  aliases: [],
  description: 'Sends a picture of a random fox',
  category: 'animals',
  permissions: [],
  args: false,
  loader: true,
  run: function(msg, args) {
    request('https://randomfox.ca/floof/')
    .then(req => {
      var fileName = req.data.image.toLowerCase()
      if(fileName.includes('.gif') || fileName.includes('.png') || fileName.includes('.jpeg') || fileName.includes('.jpg')) {
        msg.channel.send('', {
          "embed": {
            "color": 4513714,
            "image": {
              "url": req.data.image
            }
          }
         })
      }
      else msg.channel.sendMsgEmbed(req.data.image)
    })
    .catch(err => {
      console.error(err)
      msg.channel.sendMsgEmbed('There was an error, try again later', '', 13841223)
    })
  }
}