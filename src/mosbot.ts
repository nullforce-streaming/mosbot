import * as tmi from "tmi.js";
import client from "tmi.js/lib/client";

export interface MosBotOptions {
    channels: string[],
    command: string,
    primaryUser: string,
    commandWindowInSeconds: number,
    commandCooldownInSeconds: number,
}

export class MosBot {
    username: string;
    token: string;
    client: client;
    opts: MosBotOptions;

    dict = {};
    lastCommandCountTimes: any;
    commandCounts = {};

    constructor(username: string, token: string, opts: MosBotOptions) {
        this.username = username;
        this.token = token;
        this.opts = opts;

        const tmiOpts = {
            identity: {
                username: username,
                password: token,
            },
            channels: opts.channels
        }

        const client = tmi.client(tmiOpts);
        this.client = client;

        client.on("message", (channel, context, msg, self) => this.onMessageHandler(channel, context, msg, self));
        client.on("connected", (any, port) => this.onConnectedHandler(any, port));

        client.connect();
    }

    onConnectedHandler(addr, port) {
        console.log(`* ${this.username} connected to ${addr}:${port}`);
    }

    onMessageHandler(channel, context, msg, self) {
        if (self) return;

        const d = new Date();
        const now = d.getTime();

        const commandName = msg.trim();
        const commandNameLower = commandName.toLowerCase();
        const username = context.username.toLowerCase();

        // Only log on the first user per channel (prevent duplicates)
        if (this.username === this.opts.primaryUser) {
            console.log(`Channel: ${channel}, Username: '${username}', Command: '${commandName}'`);
        }

        let shouldExecuteCommand = false;

        if (commandName.startsWith(this.opts.command)) {
            let commandReceivedCount = this.commandCounts[channel] || 0;

            if (secondsAgo(this.lastCommandCountTimes, now, this.opts.commandWindowInSeconds)) {
                commandReceivedCount = 0;
            }

            this.commandCounts[channel] = ++commandReceivedCount;
            this.lastCommandCountTimes = now;

            // Only log on the first user per channel (prevent duplicates)
            if (this.username === this.opts.primaryUser) {
                console.log(`Command count[${channel}]: ${commandReceivedCount}`);
            }

            if (commandReceivedCount >= 2) {
                shouldExecuteCommand = true;
            }
        }

        if (shouldExecuteCommand) {
            const last = this.dict[channel];

            // reset play count
            this.commandCounts[channel] = 0;

            if (typeof last === "undefined" || secondsAgo(last, now, this.opts.commandCooldownInSeconds)) {
                this.dict[channel] = now;
                setTimeout(() => {
                    this.client.say(channel, this.opts.command);
                    console.log(`Time: ${now}, [${this.username}] Sending ${this.opts.command}`);
                }, getRandomInt(6) * 1000);
            }
        }
    }
}

function secondsAgo(last, now, seconds) {
    if (typeof last === "undefined") {
        return true;
    }

    const diff = (now - last) / 1000;
    return diff >= seconds;
}

function getRandomInt(max): number {
    return Math.floor(Math.random() * Math.floor(max));
}
