module.exports = {
    name: 'ban',
    usage: 'ban <user>',
    aliases: [],
    description: 'Bans a user',
    category: 'admin',
    permissions: ["BAN_MEMBERS"],
    args: true,
    run: function(msg, args) {
        const userID = args[0].replace(/\D/g, '')
        const reason = args.slice(1).join(" ") || "no reason provided"
        const bannedUser = msg.channel.guild.members.find(user => user.id === userID)
        // test to see if user should be able to ban
        if(bannedUser) {
            if(msg.member.highestRole.comparePositionTo(bannedUser.highestRole) > 0) {
                /***/
                if(bannedUser.bannable) {
                    bannedUser.ban({reason: `Banned by ${msg.member.displayName} for ${reason}`})
                    .then(()=>{
                        msg.channel.sendMsgEmbed(`<@${bannedUser.id}> was banned by <@${msg.author.id}>. Reason: ${reason}`)
                    })
                    .catch(err=>{
                        console.error(err)
                        msg.channel.sendMsgEmbed('There was an error performing this command. Try again later.');
                    })
                }
                else msg.channel.sendMsgEmbed('Sorry, I couldn\'t ban that user. Ask an Administrator to check my permissions.')
            } else {
                msg.channel.sendMsgEmbed('Sorry, you don\'t have the permissions to ban this user.');
            }
        } else {
            msg.channel.sendMsgEmbed('User not found.')
        }
    }
  }