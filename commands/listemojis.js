const logger = require('../logger.js');
const emojisMessage = require('../utils/emojisMessage.js');

module.exports = {
    data: {
        description: 'Publicar un listado de emojis del servidor en el canal donde se ejecuta el comando.',
    },
    async execute(interaction) {
        const channel = interaction.guild.channels.cache.get(interaction.channelId);
        if (!channel) {
            await interaction.reply({ content: '`❌` Este comando solo puede ser utilizado en un canal de texto.', ephemeral: true });
            return;
        }

        await interaction.deferReply({ ephemeral: true });

        const emojis = interaction.guild.emojis.cache;
        const emojisText = emojisMessage(emojis);

        try {
            await channel.send(emojisText);
        } catch (error) {
            logger.verbose("❌ No se ha podido enviar un mensaje de emojis: " + error, process.env.DEBUG === 'true');
            await interaction.editReply({ content: '`❌` No se ha podido enviar el mensaje, asegurate de que el bot tenga permisos para enviar mensajes en este canal.', ephemeral: true });
            return;
        }

        await interaction.editReply({ content: '`✅` ¡Listado de emojis publicado correctamente!', ephemeral: true });
    }
}