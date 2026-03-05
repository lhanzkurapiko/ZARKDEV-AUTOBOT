const fs = require("fs");

module.exports = {
    name: "report",
    usePrefix: true,
    description: "Send a message to the bot owner.",
    usage: "report <your message>",
    version: "1.2",
    admin: false,
    cooldown: 10,

    async execute({ api, event, args }) {
        const senderID = event.senderID;
        const threadID = event.threadID;

        // Load owner UID from appState.json
        let ownerUID = null;
        try {
            const appState = JSON.parse(fs.readFileSync("appState.json", "utf8"));
            ownerUID = appState.ownerUid || "61585233555488";
        } catch (e) {
            return api.sendMessage("❌ Failed to load the owner's UID from appState.json.", threadID);
        }

        const message = args.join(" ");
        if (!message) {
            return api.sendMessage("❌ Please provide a message to send.\nUsage: report <your message>", threadID);
        }

        try {
            const senderInfo = await api.getUserInfo(senderID);
            const senderName = senderInfo[senderID]?.name || "Unknown";

            const fullMessage = `📥 𝗥𝗲𝗽𝗼𝗿𝘁 𝗙𝗿𝗼𝗺 𝗨𝘀𝗲𝗿\n━━━━━━━━━━━━━━\n👤 Name: ${senderName}\n🆔 UID: ${senderID}\n📝 Message: ${message}`;

            await api.sendMessage(fullMessage, ownerUID);
            return api.sendMessage("✅ Your message has been sent to the bot owner.", threadID);
        } catch (err) {
            console.error("❌ Error sending message to owner:", err);
            return api.sendMessage("❌ Failed to send your message. Try again later.", threadID);
        }
    },
};
