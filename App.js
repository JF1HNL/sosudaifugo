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
});

client.on("message",message => {
  if(message.author.bot){
    return true
  }
  // if(message_judge(message)){
  //   return ;
  // }
  // let msg = message.content;
  // let guild = message.guild;
  let channel = message.channel.name;
  switch (channel) {
    case 'プレイヤー1':
      func_player1(message);
      break;
    case 'プレイヤー2':
      func_player2(message);
      break;
    case 'bot_control':
      func_bot_control(message);
      break;
  }
  // message_reply(message, message.content)
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
  message_reply(message, '役職をリセットしました')
  sosudaihugo_obj = new SOSUDAIHUGO_CLASS()
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
  if(msg === 'player1' || msg === 'player2'){
    sosudaihugo_obj[msg] = new PLAYER_CLASS(message.author.username, [])
    console.log(sosudaihugo_obj)
  }
  message_reply(message, `役職を${msg}に変更しました`)
  message.member.setRoles([ROLE_NAME_ID[msg]])
  .then(console.log(`Swich role: ${msg}`))
  .catch(console.error);
}

function message_judge(params) { // trueのときはこの先の処理を止める
  const name = params.channel.name
  const ok_channel = ['プレイヤー1', 'プレイヤー2', 'bot_control']
  for(let i in ok_channel){
    if(name === ok_channel[i]){
      return false
    }
  }
  return true
}


// 素数大富豪で必要な情報とかをここに書く

class PLAYER_CLASS {
  constructor(user_class, ary){
    this.user = user_class
    this.hand = ary
  }
}

class SOSUDAIHUGO_CLASS {
  constructor(player1_user, player1_ary, player2_user, player2_ary){
    this.player1 = new PLAYER_CLASS(player1_user, player1_ary)
    this.player2 = new PLAYER_CLASS(player2_user, player2_ary)
  }
}

let sosudaihugo_obj = new SOSUDAIHUGO_CLASS()

function func_player1(message) {
  message_reply(message, 'player1') 
}

function func_player2(message) {
  message_reply(message, 'player2')
}

function func_bot_control(message) {
  message_reply(message, 'bot_control')
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