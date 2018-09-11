module.exports = {
    name: 'kick',
    usage: 'kick <user>',
    aliases: [],
    description: 'Kicks a user',
    category: 'admin',
    permissions: ["KICK_MEMBERS"],
    args: true,
    run: function(msg, args) {
        const userID = args[0].replace(/\D/g, '')
        const reason = args.slice(1).join(" ") || "no reason provided"
        const kickedUser = msg.channel.guild.members.find(user => user.id === userID)
        // test to see if user should be able to kick
        if(kickedUser) {
            if(msg.member.highestRole.comparePositionTo(kickedUser.highestRole) > 0) {
                /***/
                if(kickedUser.kickable) {
                    kickedUser.kick(`Kicked by ${msg.member.displayName} for ${reason}`)
                    .then(()=>{
                        msg.channel.send(`<@${kickedUser.id}> was kicked by <@${msg.author.id}>. Reason: ${reason}`)
                    })
                    .catch(err=>{
                        console.error(err)
                        msg.channel.send('There was an error performing this command. Try again later.');
                    })
                }
                else msg.channel.send('Sorry, I couldn\'t kick that user. Ask an Administrator to check my permissions.')
            } else {
                msg.channel.send('Sorry, you don\'t have the permissions to kick this user.');
            }
        } else {
            msg.channel.send('User not found.')
        }
    }
  }