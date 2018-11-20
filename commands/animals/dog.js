const request = require('axios')
module.exports = {
  name: 'dog',
  usage: 'dog',
  aliases: [],
  description: 'Sends a picture of a random dog',
  category: 'animals',
  permissions: [],
  args: false,
  loader: true,
  run: function(msg, args) {
    request('https://random.dog/woof.json')
    .then(req => {
      var fileName = req.data.url.toLowerCase()
      if(fileName.includes('.gif') || fileName.includes('.png') || fileName.includes('.jpeg') || fileName.includes('.jpg')) {
        msg.channel.send('', {
          "embed": {
            "color": 4513714,
            "image": {
              "url": req.data.url
            }
          }
         })
      }
      else msg.channel.sendMsgEmbed(req.data.url)
    })
    .catch(err => {
      console.error(err)
      msg.channel.sendMsgEmbed('There was an error, try again later', '', 13841223)
    })
  }
}