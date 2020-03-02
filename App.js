const Discord = require("discord.js");
require('dotenv').config();
const client = new Discord.Client();    
const token = process.env.DISCORD_TOKEN;

const ROLE_NAME_ID = {
  player1 : '682934620907503636',
  player2 : '682937533814145043',
  kankyaku : '682937592081416218'
}

client.on("ready", ()=> {
  console.log("ready...");
  client_msg_push('bot_control', 'server-start!')
  client_msg_push('プレイヤー1', ui_test)
});

client.on("message",message => {
  if(message_judge(message)){
    return ;
  }
  // let msg = message.content;
  // let guild = message.guild;
  // let channel = message.channel;
  // let author = message.author.username;
  if(ROLE_NAME_ID[message.content]){
    role(message)
  }
  if(message.content === 'reset'){
    role_reset(message)
  }
  message_reply(message, message.content)
  return;
}
);

client.login(token);

// function
function message_reply(message, text) {
  message.reply(text)
  .then(message => console.log(`Sent message: ${text}`))
  .catch(console.error);
}

function client_msg_push(channel_name, text) {
  client.channels.filter(channel => channel.name === channel_name).forEach(channel =>
    channel.send(text)
  );
  console.log(`Push channel: ${channel_name}, Push message: ${text}`)
}

function role_reset(message) {
  message.reply('役職をリセットしました')
    .then(message => console.log(`Sent message: 役職をリセットしました`))
    .catch(console.error);
  message.guild.members.forEach(member => 
    member.setRoles([ROLE_NAME_ID['kankyaku']])
    .then(console.log(`Swich role: kankyaku`))
    .catch(console.error)
  )
}

function role(message) {
  const msg = message.content
  // for(let i in ROLE_NAME_ID){
  //   message.member.removeRole(ROLE_NAME_ID[i])
  //     //.then(console.log)
  //     .catch(console.error);
  // }
  // message.member.addRole(ROLE_NAME_ID[msg])
  //   .then(console.log(`swich role: ${msg}`))
  //   .catch(console.error);
  message_reply(message, `役職を${msg}に変更しました`)
  message.member.setRoles([ROLE_NAME_ID[msg]])
  .then(console.log(`Swich role: ${msg}`))
  .catch(console.error);
}

function message_judge(params) { // trueのときはこの先の処理を止める
  const name = params.channel.name
  const ok_channel = ['プレイヤー1', 'プレイヤー2', 'bot_control']
  if(params.author.bot){
    return true
  }
  for(let i in ok_channel){
    if(name === ok_channel[i]){
      return false
    }
  }
  return true
}


const ui_test = 
`
現在の状況
\`\`\`
相手 : A, A, 5, 7, T, K

場 : QK(1213)

自分 : 5, 7
\`\`\`
`