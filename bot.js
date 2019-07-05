const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log("Connected as " + client.user.tag);

    client.guilds.forEach((guild) => {
        console.log(guild.name);

        guild.channels.forEach((channel) => {
            console.log('\t- ' + channel.name)
        })
    });
});

client.on('message', messageReceivedHandler); 
client.on('reconnecting', () => { console.log('Reconnecting...'); }); 
client.on('resume', (replayed) => { console.log('Resume... (' + replayed + " events replayed)"); }); 
client.on('ratelimit', (/*rateLimitInfo*/) => { console.log('Rate limited...'); }); 

client.login(process.env.BOT_TOKEN);

function messageReceivedHandler(receivedMessage)
{
    if (receivedMessage.author.bot){
        return;
    }

    var commandExtract = extractCommand(receivedMessage.content);

    if (receivedMessage.channel.permissionsFor(client.user).has('MANAGE_MESSAGES'))
    {
        receivedMessage.delete();
    }

    if (!commandExtract)
        return;

    var actionType = determineType(commandExtract.commandText);

    if (actionType) {
        client.user.setActivity(
            commandExtract.restText, 
            { 
                type: actionType, 
                url: "https://twitch.tv/irr11t" 
            });
    }
}

var actionTypes = {
    WATCHING: "WATCHING",
    LISTENING: "LISTENING",
    PLAYING: "PLAYING",
    STREAMING: "STREAMING"
}

function extractCommand(messageContent) {
    var firstSpaceIndex = messageContent.indexOf(' ');

    if (firstSpaceIndex == -1 || firstSpaceIndex == messageContent.length)
        return;

    var commandText = messageContent.substring(0, firstSpaceIndex);
    var restText = messageContent.substring(firstSpaceIndex + 1);

    return { commandText, restText };
}

function determineType(typeString) {
    switch(typeString) {
        case 'w':
        case 'watch':
        case 'watching':
            return actionTypes.WATCHING;
        case 'l':
        case 'listen':
        case 'listening':
            return actionTypes.LISTENING;
        case 'p':
        case 'play':
        case 'playing':
            return actionTypes.PLAYING;
        case 's':
        case 'stream':
        case 'streaming':
            return actionTypes.STREAMING;
        default:
            return;
    }
}