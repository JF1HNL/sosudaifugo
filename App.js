const Discord = require("discord.js");
require('dotenv').config();
const client = new Discord.Client();    
const token = process.env.DISCORD_TOKEN;

const ROLE_NAME_ID = {
  player1 : '682934620907503636',
  player2 : '682937533814145043',
  kankyaku : '682937592081416218'
}

// 重要なフラグ
let game_flag = false;

// トランプ生成してるところ
class Card {
  constructor(mark, num){
    this.mark = mark;
    this.num = num;
    switch (num){
      case 1:
        this.char = 'A'
        break;
      case 10:
        this.char = 'T'
        break;
      case 11:
        this.char = 'J'
        break;
      case 12:
        this.char = 'Q'
        break;
      case 13:
        this.char = 'K'
        break;
      default:
        this.char = String(num)
    }
    this.use = false
  }
}

var cards = [];
function init(){ //トランプのカードを作成
  let x = 0;
  for (var i = 1; i <= 13; i++){
    cards[x] = new Card("♠", i);
    x++;
    cards[x] = new Card("☘", i);
    x++;
    cards[x] = new Card("❤", i);
    x++;
    cards[x] = new Card("♦", i);
    x++;
  };
};init();

client.on("ready", ()=> {
  console.log("ready...");
  client_msg_push('bot_control', 'server-start!')
});

client.on("message",message => {
  if(message.author.bot && message.content === 'server-start!'){
    role_reset(message);
  }
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
  .then(message => console.log(`Reply message: ${text}`))
  .catch(console.error);
}

function client_msg_push(channel_name, text) {
  client.channels.filter(channel => channel.name === channel_name).forEach(channel =>
    channel.send(text)
  );
  console.log(`Push channel: ${channel_name}, Push message: ${text}`)
}

function role_reset(message) {
  client_msg_push('bot_control', '役職をリセットしました')
  sosudaihugo_obj = new SOSUDAIHUGO_CLASS(0, [], 0, [])
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
  sosudaihugo_obj[msg] = new PLAYER_CLASS(message.author.id, [])
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

let sosudaihugo_obj = new SOSUDAIHUGO_CLASS(0, [], 0, [])


// チャンネルごとの挙動
function func_player1(message) {
  message_reply(message, 'player1') 
}

function func_player2(message) {
  message_reply(message, 'player2')
}

function func_bot_control(message) {
  if(game_flag){
    return;
  }
  if(message.content === 'new game'){
    role_reset(message);
    return;
  }
  if(sosudaihugo_obj.player1.user !== message.author.id && sosudaihugo_obj.player2.user !== message.author.id){
    if(message.content === 'player1' && sosudaihugo_obj.player1.user === 0){
      role(message);
      if(sosudaihugo_obj.player1.user !== 0 && sosudaihugo_obj.player2.user !== 0){
        game_start()
      }
      return;
    }
    if(message.content === 'player2' && sosudaihugo_obj.player2.user === 0){
      role(message);
      if(sosudaihugo_obj.player1.user !== 0 && sosudaihugo_obj.player2.user !== 0){
        game_start()
      }
      return;
    }
  }
  message_reply(message, message.content)
}

function game_start(params) {
  console.log('game start!')
  function all_chanel_msg_push(e){
    client_msg_push('プレイヤー1', e);
    client_msg_push('プレイヤー2', e);
    client_msg_push('闘技場', e);
    client_msg_push('bot_control', e);
  }

  game_flag = true;
  const start_text = 
  `\`\`\`
  ********************
  素数大富豪スタート！
  ********************
  \`\`\`
  まずは各プレイヤーに手札を配布します。`;
  all_chanel_msg_push(start_text);
  for(let i = 0; i < 5; i++){
    hand_add(sosudaihugo_obj.player1)
    hand_add(sosudaihugo_obj.player2)
  }
  console.log(sosudaihugo_obj.player1.hand)
  console.log(sosudaihugo_obj.player2.hand)
}

function hand_add(player){
  while(1){
    const random = Math.floor(Math.random() * cards.length)
    const geted_card = cards[random]
    if(geted_card.use){
      continue
    }
    geted_card.use = true;
    player.hand.push(geted_card)
    break;
  }
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