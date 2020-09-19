import * as dotenv from "dotenv";
import { MosBot, MosBotOptions } from "./mosbot";

dotenv.config();

if (process.env.MOSBOT_COMMAND === undefined || process.env.MOSBOT_CHANNELS === undefined || process.env.MOSBOT_USERS === undefined || process.env.MOSBOT_TOKENS === undefined) {
    console.log("Command, Channels, Users, and Tokens must be provided!");
    process.exit();
}

const command: string = process.env.MOSBOT_COMMAND.trim();
const channels: string[] = trimAndSplit(process.env.MOSBOT_CHANNELS);
const usernames: string[] = trimAndSplit(process.env.MOSBOT_USERS);
const tokens: string[] = trimAndSplit(process.env.MOSBOT_TOKENS);
const firstUsername = usernames[0];

console.log(usernames);

const mosBotOptions: MosBotOptions = {
    channels: channels,
    command: command,
    primaryUser: firstUsername,
};

// spawn one client per user
for (let i in usernames) {
    const bot = new MosBot(usernames[i], tokens[i], mosBotOptions);
}

function trimAndSplit(str: string): string[] {
    return str.replace(/ /g, '').split(',');
}
