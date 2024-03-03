const utils = require("../utils/");

const listener = {
    name: "updateDeletedMessages",
    eventName: "messagedeleted",
    listener: async (channel, username, deletedMessage, userstate) => {
        try {
            const message = await utils.Schemas.TwitchChat.findById(userstate.id);
            if (message) {
                message.deleted = true;
                await message.save();
            }
        } catch(e) {
            console.error(e);
        }
    }
};

module.exports = listener;