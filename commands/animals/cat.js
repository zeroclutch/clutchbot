const request = require('axios')
module.exports = {
  name: 'cat',
  usage: 'cat',
  aliases: [],
  description: 'Sends a picture of a random cat',
  category: 'animals',
  permissions: [],
  args: false,
  loader: true,
  run: function(msg, args) {
    request('https://aws.random.cat/meow')
    .then(req => {
      var fileName = req.data.file.toLowerCase()
      if(fileName.includes('.gif') || fileName.includes('.png') || fileName.includes('.jpeg') || fileName.includes('.jpg')) {
        msg.channel.send('', {
          "embed": {
            "color": 4513714,
            "image": {
              "url": req.data.file
            }
          }
         })
      }
      else msg.channel.sendMsgEmbed(req.data.file)
    })
    .catch(err => {
      console.error(err)
      msg.channel.sendMsgEmbed('There was an error, try again later', '', 13841223)
    })
  }
}