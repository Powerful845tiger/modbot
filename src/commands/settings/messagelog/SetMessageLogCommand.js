const SetConfigCommand = require('../../SetConfigCommand');
const {MessageEmbed} = require('discord.js');
const util = require('../../../util');
const Guild = require('../../../Guild');

class SetMessageLogCommand extends SetConfigCommand {
    static usage = '<#channel|channelid>';

    static description = 'Set a channel deleted and edited messages will be logged in';

    async execute() {
        const channelID = this.source.isInteraction ?
            this.options.getChannel('channel')?.id : this.options.getString('channelid');

        if (!channelID) {
            await this.sendUsage();
            return;
        }

        const channel = await (new Guild(this.source.getGuild())).fetchChannel(channelID);
        if (!channel) {
            await this.sendUsage();
            return;
        }

        this.guildConfig.messageLogChannel = channelID;
        await this.guildConfig.save();
        await this.reply(new MessageEmbed()
            .setDescription(`Set message log channel to <#${channel.id}>.`)
            .setColor(util.color.green)
        );
    }

    static getOptions() {
        return [{
            name: 'channel',
            type: 'CHANNEL',
            description: 'The new message log channel.',
            required: true
        }];
    }

    parseOptions(args) {
        return [{
            name: 'channelid',
            type: 'STRING',
            value: util.channelMentionToId(args.shift())
        }];
    }
}

module.exports = SetMessageLogCommand;