module.exports = (emojis) => {
    var emojisText = "";

    emojis.forEach(emoji => {
        emojisText += `${emoji} - \`<${emoji.name}:${emoji.id}>\`\n`;
    });

    return emojisText;
}