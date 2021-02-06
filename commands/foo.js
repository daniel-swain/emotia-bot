const cmd = {
    name: 'foo',
    aliases: ['test'],
    description: 'foo bar is the description',
    execute: (msg, args) => {
        msg.channel.send('bar');
    }
};

module.exports = cmd;
