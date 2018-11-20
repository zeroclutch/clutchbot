module.exports = {
    name: 'poll',
    usage: 'poll <question>; <response>; <response>; ...',
    aliases: [],
    description: 'Creates a poll with the given responses',
    category: 'utility',
    permissions: [],
    args: false,
    run: function(msg, args) {
        args = args.join(' ').split(';')
        const letters = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
              emoji = ["\u0030\u20E3","\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3", "\u0036\u20E3","\u0037\u20E3","\u0038\u20E3","\u0039\u20E3"],
              responses = args.slice(1)
        if(responses[responses.length - 1].replace(' ', '') === '') responses.pop()

        // send poll
        msg.channel.send('', {
            embed: {
                color: 4513714,
                title: args[0],
                description: (function () {
                    var res = ''
                    // list options
                    responses.forEach((response, i) => {
                        if(i < letters.length) {
                            res += `:${letters[i + 1]}: ${response}\n`
                        }
                    })
                    return res
                })()
            }
        })
        
        // add reactions
        .then(m => {
            m.react(emoji[1])
            .then(e=>{if(responses[1])m.react(emoji[2])})
            .then(e=>{if(responses[2])m.react(emoji[3])})
            .then(e=>{if(responses[3])m.react(emoji[4])})
            .then(e=>{if(responses[4])m.react(emoji[5])})
            .then(e=>{if(responses[5])m.react(emoji[6])})
            .then(e=>{if(responses[6])m.react(emoji[7])})
            .then(e=>{if(responses[7])m.react(emoji[8])})
            .then(e=>{if(responses[8])m.react(emoji[9])})
        })
    }
  }