var fs = require('fs');
var plan = JSON.parse(fs.readFileSync('plan.json', 'utf8'));
var today = new Date();
var dow = today.getDay();
var p = plan.days.find(function (d) { return d.idx === dow; }) || plan.days[0];
var vids = p.videos.map(function (v, i) {
  return '<p><b>' + (i + 1) + '. ' + v.title + '</b> <span style="color:#fbbf24">' + (v.dur || '') + '</span></p>';
}).join('');
var content =
  '<h3>📅 ' + p.name + ' · ' + p.theme + '</h3>' +
  '<p>⏰ 建议完成时间：' + (plan.defaultTime || '20:30') + ' 左右</p>' +
  vids +
  '<p style="background:#1a1a2e;padding:10px;border-radius:8px;font-size:13px;color:#aaa">💡 ' + p.points + '</p>' +
  '<p>⚠️ 颈椎椎间盘突出者：幅度减半、疼痛即停。</p>' +
  '<p><a href="' + plan.siteUrl + '">👉 点这里打开跒练页面</a></p>' +
  '<p style="font-size:12px;color:#666">训练结束后回到网站填写今日反馈</p>';
var body = {
  token: process.env.PUSH_TOKEN,
  title: '🏋️ 今日体态训练 · ' + p.theme,
  content: content,
  template: 'html',
  channel: 'wechat'
};
fetch('https://www.pushplus.plus/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
})
  .then(function (r) { return r.json(); })
  .then(function (j) { console.log('PushPlus:', JSON.stringify(j)); if (j.code !== 200) process.exit(1); })
  .catch(function (e) { console.error('Error:', e); process.exit(1); });
