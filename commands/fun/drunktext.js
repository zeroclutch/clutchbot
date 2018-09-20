module.exports = {
    name: 'drunktext',
    usage: 'drunktext <phrase>',
    aliases: [],
    description: 'Makes your message 100% less sober',
    category: 'fun',
    permissions: [],
    args: true,
    run: function(msg, args) {
        var text = ':beer: ';
        args.forEach(word => {
            if (word.length > 3) text += `${word.substring(0,1)}${word.substring(1,word.length-1).split('').sort(function(){return 0.5-Math.random()}).join('')}${word.substring(word.length-1,word.length)} `
            else text += word.split('').sort(function(){return 0.5-Math.random()}).join('') + ' '
        })
        msg.channel.send(text);
    }
  }