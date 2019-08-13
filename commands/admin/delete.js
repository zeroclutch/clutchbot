module.exports = {
    name: 'prune',
    usage: 'prune <number of messages>',
    aliases: [],
    description: 'Deletes some messages',
    category: 'admin',
    permissions: ["MANAGE_MESSAGES"],
    args: true,
    run: function(msg, args) {
        var initialLimit,
            limit
        try {
            initialLimit = parseInt(args.join(' '))
            limit = initialLimit + 1
        } catch (err) {
            msg.channel.sendMsgEmbed('Please enter a valid integer.', '', 13632027)
            return
        }
        var overflow = 0
        if(limit > 99) {
            limit = 100
            overflow = limit % 100 
        }
        if(overflow > 499) {
            msg.channel.sendMsgEmbed('Sorry, you may only prune 500 messages at a time.', '', 13632027)
        }
        do {
            msg.channel.fetchMessages({limit}).then(fetched => {
                msg.channel.bulkDelete(fetched);
            })
            limit = Math.min(overflow, 100)
            overflow -= limit
        } while(overflow > 0)
        msg.channel.sendMsgEmbed(`${initialLimit} messages successfully deleted!`, 'Messages successfully pruned.')
    }
  }