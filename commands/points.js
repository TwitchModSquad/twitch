const tmi = require("tmi.js");

const utils = require("../utils/");
const config = require("../../config.json");

const command = {
    name: "points",
    /**
     * Listener for a message
     * @param {ListenClient} client 
     * @param {any} streamer 
     * @param {any} chatter 
     * @param {tmi.ChatUserstate} tags 
     * @param {string} message 
     * @param {function} reply
     */
    execute: async (client, streamer, chatter, args, tags, message, reply) => {
        if (args.length > 0 && chatter._id === config.twitch.id) {
            if (args[0].toLowerCase() === "add") {
                if (args.length > 2) {
                    try {
                        const user = await utils.Twitch.getUserByName(args[1], true, true);
                        let points = Number(args[2]);
                        if (isNaN(points)) {
                            return reply(`${args[2]} is not a valid number!`, false);
                        }
                        points = Math.floor(points);
                        const identity = await user.createIdentity();
                        const log = await utils.Points.addPoints(identity, points, "wos");
                        reply(`User ${user.display_name} was awarded ${points}${log.bonus > 0 ? `+${log.bonus} (supporter)` : ""} point${points === 1 ? "" : "s"}! User point balance: ${identity.printPoints()}`, false);
                    } catch(err) {
                        console.error(err);
                        reply(`user ${args[1]} was not found!`, false);
                    }
                }
            }
        } else {
            let points = 0;
            if (chatter?.identity?.points) {
                points = chatter.identity.points;
            }
            reply(`you have ${points} point${points === 1 ? "" : "s"}`);
        }
    }
}

module.exports = command;
