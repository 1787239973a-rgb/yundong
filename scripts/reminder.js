var fs = require('fs');
var plan = JSON.parse(fs.readFileSync('plan.json', 'utf8'));
var today = new Date();
var dow = today.getDay();
var p = plan.days.find(function (d) { return d.idx === dow; }) || plan.days[0];
var vids = p.videos.map(function (v, i) {
  return (i + 1) + '. ' + v.title + ' (' + (v.dur || '') + ')';
}).join('\n');
var lines = [
  '📅 ' + p.name + ' · ' + p.theme,
  '⏰ 建议完成时间：' + (plan.defaultTime || '20:30') + ' 左右',
  '',
  vids,
  '',
  '💡 ' + p.points,
  '⚠️ 颈椎椎间盘突出者：幅度减半、疼痛即停。',
  '👉 跟练页面：' + plan.siteUrl,
  '训练结束后回到网站填写今日反馈'
];
var content = lines.join('\n');
var body = {
  token: process.env.PUSH_TOKEN,
  title: '🏋️ 今日体态训练 · ' + p.theme,
  content: content,
  template: 'txt',
  channel: 'app'
};
fetch('https://www.pushplus.plus/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
})
  .then(function (r) { return r.json(); })
  .then(function (j) { console.log('PushPlus:', JSON.stringify(j)); if (j.code !== 200) process.exit(1); })
  .catch(function (e) { console.error('Error:', e); process.exit(1); });
