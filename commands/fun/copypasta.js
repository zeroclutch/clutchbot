const snoowrap = require('snoowrap')
module.exports = {
    name: 'copypasta',
    usage: 'copypasta <search (optional)>',
    aliases: [],
    description: 'Finds a random copypasta, or a specific one if you search it.',
    category: 'fun',
    permissions: [],
    args: false,
    run: function(msg, args) {
        const r = new snoowrap({
            userAgent: 'ClutchBot v0.1 (by /u/mrprgr)',
            clientId: process.env.REDDIT_CLIENT_ID,
            clientSecret: process.env.REDDIT_CLIENT_SECRET,
            username: process.env.REDDIT_USERNAME,
            password: process.env.REDDIT_PASSWORD
        });

        function sendReply(submission) {
            msg.channel.send('', { 
                "embed": {
                    "color": 4513714,
                    "title": submission.title,
                    "description": submission.toJSON().selftext.substring(0, Math.min(submission.toJSON().selftext.length, 2048)),
                    "url": "https://reddit.com" + submission.permalink,
                    "footer": {
                        "icon_url": "https://cdn.discordapp.com/emojis/492254092887064578.png",
                        "text": `${submission.score} ${submission.score === 1 ? 'upvote' : 'upvotes'}`
                    },
                }
            })
            .then(msg => {
                msg.react(msg.client.emojis.find(emoji => emoji.id === '492248537644531722'))
                .then(() => {
                    msg.react(msg.client.emojis.find(emoji => emoji.id === '492248331356209162'))
                })
            })
        }

        if(!args || args.length === 0) {
            r.getSubreddit('copypasta').getRandomSubmission()
            .then(submission => {
                sendReply(submission)
            })
            .catch(err => {
                console.error(err)
                msg.channel.send('', { 
                    "embed": {
                        "color": 0xfd171c,
                        "description": 'No results found.',
                    }
                })
            })
        } else {
            r.getSubreddit('copypasta').search({query: args.join(" "), sort: 'relevance'})
            .then(listing => {
                const submission = listing[0]
                if(submission) {
                    sendReply(submission)
                } else {
                    msg.channel.send('', { 
                        "embed": {
                            "color": 0xfd171c,
                            "description": 'No results found.',
                        }
                    })
                }
            })
            .catch(err => {
                console.error(err)
                msg.channel.send('', { 
                    "embed": {
                        "color": 0xfd171c,
                        "description": 'No results found.',
                    }
                })
            })
        }
    }
  }