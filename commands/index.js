const fs = require('fs');
const path = require('path');

const COMMAND_DIR = __dirname;
const DENYLIST_FILES = ['index.js', 'foo.js'];

function getCommandsFromFiles() {
    let commands = {};

    fs.readdirSync(COMMAND_DIR)
        .filter(file => !!file && !DENYLIST_FILES.includes(file))
        .forEach(file => {
            const cmd = require(path.join(COMMAND_DIR, file));

            // warn if command has already been loaded
            if (!!commands[cmd.name]) {
                console.warn('The following command was attempted to be loaded, but the name already exists: ' + cmd.name)
            }

            commands = addCommand(commands, cmd);
        });
    return commands;
};

function addCommand(commands, cmd) {
    let newCmds = Object.assign(commands, { [cmd.name]: cmd });
    let msg = 'Loaded cmd: ' + cmd.name;

    // handle aliases
    if (cmd.aliases) {
        cmd.aliases.forEach(alias => {
            newCmds[alias] = {
                ...newCmds[cmd.name],
                isAlias: true,
            };
        });
        msg += ' (w/ aliases: ' + cmd.aliases.join(', ') + ' )';
    }
    console.log(msg);
    return newCmds;
};

const commandsFromFiles = getCommandsFromFiles();
const helpDescription =  'instructions on how this bot works';
const helpCmd = {
    name: 'help',
    aliases: ['h'],
    description: helpDescription,
    execute: (msg, args) => {
        let helpMsg = helpDescription + '\r\n\r\n';
        Object.entries(commandsFromFiles)
            .forEach(([cmdName, { isAlias, aliases, description }]) => {
                if (isAlias) {
                   return;
                }
                helpMsg += '\t' + cmdName + '(' + aliases.join(', ') + ')' + '\t\t\t-\t' + description + '\r\n';
            });

        msg.channel.send(helpMsg);
    }
};

const allCommands = addCommand(commandsFromFiles, helpCmd);

module.exports = allCommands;