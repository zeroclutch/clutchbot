const snoowrap = require('snoowrap')
module.exports = {
    name: 'ouija',
    usage: 'ouija <hot/top (optional)> <day/week/month/year/all>',
    aliases: [],
    description: 'Finds a random post from AskOuija, or a specific one if you search it.',
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

        function sendReply (submission) {
            var replies = submission.comments,
                letters = [],
                reply = ''

            if(!(submission.link_flair_text || '').includes('Ouija says:')) {
                while(replies[0] && replies[0].body.length <= 1) {
                    letters.push(replies[0].body)
                    replies = replies[0].replies
                }
                
                reply = letters.join('').toLowerCase().replace('goodbye', '').toUpperCase()
            } else {
                reply = submission.link_flair_text.replace('Ouija says:', '')
            }
            msg.channel.send('', {
                embed: {
                    color: 4513714,
                    title: submission.title.replace("_", "\_"),
                    url: "https://reddit.com" + submission.permalink,
                    description: 'Ouija says: ' + reply,
                    footer: {
                        "icon_url": "https://cdn.discordapp.com/emojis/492254092887064578.png",
                        "text": `${submission.score} ${submission.score === 1 ? 'upvote' : 'upvotes'}`
                    }
                }
            })
        }

        if(args.length === 0) {
            r.getSubreddit('AskOuija').getRandomSubmission()
            .then(submission => {
                sendReply(submission)
            })
        } else if (args.includes('hot')) {
            r.getSubreddit('AskOuija').getHot()
            .then(posts => {
                const submission = posts[Math.floor(Math.random()*posts.length)]
                sendReply(submission)
            })
        } else if (args.includes('top')) {
            r.getSubreddit('AskOuija').getTop({time: args[1] || 'all'})
            .then(posts => {
                const submission = posts[Math.floor(Math.random()*posts.length)]
                sendReply(submission)
            })
        }
    }
  }