const logger = require('../logger.js');
const emojisMessage = require('../utils/emojisMessage.js');
const settingsManager = require('../utils/settingsManager.js');

module.exports = {
    bind: async (client, emoji) => {
        const settings = settingsManager.get(emoji.guild.id);
        if (!settings.emojisChannel) return;

        const emojisChannel = await client.channels.fetch(settings.emojisChannel);
        if (!emojisChannel) return;

        emojisChannel.messages.fetch({ limit: 5 }).then(messages => {
            const emojis = emoji.guild.emojis.cache;
            const emojisText = emojisMessage(emojis);

            const msg = messages.find(msg => msg.author.id === client.user.id);
            if (msg) {
                msg.edit(emojisText).catch(error => {
                    logger.verbose("["+emoji.guild.id+"] ❌ No se ha podido editar el mensaje de emojis: " + error, process.env.DEBUG === 'true');
                });
                return;
            } else {
                emojisChannel.send(emojisText).catch(error => {
                    logger.verbose("["+emoji.guild.id+"] ❌ No se ha podido enviar el mensaje de emojis: " + error, process.env.DEBUG === 'true');
                });
            }

            logger.verbose("["+emoji.guild.id+"] ✅ Se ha actualizado el mensaje de emojis.", process.env.DEBUG === 'true');
        }).catch(error => {
            logger.verbose("["+emoji.guild.id+"] ❌ No se ha podido editar el mensaje de emojis: " + error, process.env.DEBUG === 'true');
        });
    }
}