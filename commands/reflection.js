const cmd = {
    name: 'reflection',
    aliases: ['reflect', 'r', 'xo'],
    description: 'foo bar is the description',
    execute: (msg, args) => {
        msg.channel.send('some kind of reflective question');
    }
};

module.exports = cmd;
