module.exports = {
  name: 'restart',
  usage: 'restart',
  aliases: [],
  description: 'Restarts the bot',
  category: 'dev',
  permissions: ["GOD"],
  args: false,
  run: function(msg, args) {
    process.exit(1);
  }
}