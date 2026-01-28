require("dotenv").config();
console.log("TOKEN:", process.env.DISCORD_TOKEN);
require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  SlashCommandBuilder
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

require("dotenv").config();
const TOKEN = process.env.DISCORD_TOKEN;

const activeChannels = new Map();

// ---------- LINES ----------
const beanLines = [
  "beans are elite, as is you",
  "beans supremacy",
  "eat ur beans kids",
  "corn betrayed me...",
  "Where have you bean all my life",
  "beans: $1.29",
  "beans are sssssssooooooooooo me",
  "You are a poopie pants idiot",
  "bro who invented beans",
  "#ilovebeans",
  "beans kinda go hard ngl",
  "thinking about beans rn",
  "beans moment",
  "beans are underrated",
  "beans >>> everything else",
  "bean behavior",
  "certified bean activity",
  "beans detected",
  "bean energy fr",
  "this convo needs more beans",
  "beans are carrying rn",
  "bean thoughts only",
  "beans kinda solved everything",
  "beans but respectfully",
  "beans just make sense",
  "bean coded behavior",
  "beans stay winning",
  "bean moment tbh",
  "beans living rent free in my head",
  "beans understood the assignment",
  "beans lowkey iconic",
  "bean activities confirmed",
  "The bean king is amoung us lol"
];

const normalLines = [
  "hi",
  "hey",
  "how are you doing",
  "anyone here?",
  "that’s crazy",
  "wait",
  "idk",
  "honestly same",
  "real",
  "nah",
  "if you break the rules ill come for you",
  "yeah probably",
  "true",
  "i’m confused",
  "ok but like",
  "not gonna lie",
  "anyway",
  "why is it so quiet",
  "this feels awkward",
  "lmao",
  "i forgot what i was gonna say",
  "i’m bored",
  "what did i miss",
  "lowkey funny",
  "highkey concerning",
  "classic",
  "why am i like this",
  "my bad",
  "oops",
  "trust me",
  "fair enough",
  "moving on",
  "imagine",
  "probably nothing",
  "definitely something",
  "no comment",
  "allegedly"
];

const replyLines = [
  "real",
  "for real",
  "honestly same",
  "nah fr",
  "true tho",
  "lowkey",
  "highkey",
  "bro what",
  "wild",
  "that’s crazy",
  "no way",
  "fair enough",
  "valid",
  "based"
];

// ---------- REGISTER SLASH COMMAND ----------
client.once("ready", async () => {
  const data = new SlashCommandBuilder()
    .setName("setbeanchannel")
    .setDescription("Set the channel where the bean bot talks")
    .addChannelOption(option =>
      option
        .setName("channel")
        .setDescription("Channel for bean messages")
        .setRequired(true)
    );

  for (const guild of client.guilds.cache.values()) {
    await guild.commands.create(data);
  }

  console.log(`Logged in as ${client.user.tag}`);
  startTalking();
});

// ---------- COMMAND HANDLER ----------
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "setbeanchannel") {
    if (!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({
        content: "Only admins can set the bean channel 😤",
        ephemeral: true
      });
    }

    const channel = interaction.options.getChannel("channel");
    activeChannels.set(interaction.guild.id, channel.id);

    interaction.reply(`✅ Bean bot will now talk in ${channel}`);
  }
});

// ---------- REPLY MODE ----------
client.on("messageCreate", async message => {
  if (!message.guild || message.author.bot) return;

  const channelId = activeChannels.get(message.guild.id);
  if (message.channel.id !== channelId) return;

  if (Math.random() < 0.25) {
    const reply = replyLines[Math.floor(Math.random() * replyLines.length)];
    setTimeout(() => message.channel.send(reply), 700 + Math.random() * 1200);
  }
});

// ---------- RANDOM CHATTER ----------
function startTalking() {
  setInterval(async () => {
    for (const channelId of activeChannels.values()) {
      const channel = await client.channels.fetch(channelId).catch(() => null);
      if (!channel) continue;

      if (Math.random() < 0.2) {
        const pool = Math.random() < 0.5 ? beanLines : normalLines;
        const line = pool[Math.floor(Math.random() * pool.length)];
        channel.send(line);
      }
    }
  }, 5000);
}

client.login(TOKEN);

