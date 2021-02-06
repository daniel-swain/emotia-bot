require('dotenv').config();
const Discord = require('discord.js');
const commands = require('./commands');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

Object.keys(commands).forEach(key => {
  bot.commands.set(key, commands[key]);
});

const TOKEN = process.env.TOKEN;
const BOT_ALIASES = [
  "-xo",
  "-emotia-bot"
];

bot.login(TOKEN).catch(er => console.log(er));

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', msg => {
  const args = msg.content.split(' ');
  const [botAlias, cmd] = args.map(x => x.toLowerCase());
  // quit if the message doesn't have an alias as the beginning of a message
  if (BOT_ALIASES.includes(botAlias)) {
    return;
  }

  // show help if the cmd doesn't exist
  if (!bot.commands.has(cmd)) {
    bot.commands.get('help').execute(msg, args);
  }

  // execute command if it does
  bot.commands.get(cmd).execute(msg, args);
});

