var fs = require('fs');
var plan = JSON.parse(fs.readFileSync('plan.json', 'utf8'));
var today = new Date();
var dow = today.getDay();
var p = plan.days.find(function (d) { return d.idx === dow; }) || plan.days[0];

var vidCards = p.videos.map(function (v, i) {
  return '<div style="background:#f1f5f9;border-radius:10px;padding:12px 14px;margin-bottom:8px">' +
    '<div style="font-weight:600;font-size:15px">' + (i + 1) + '. ' + v.title + '</div>' +
    '<div style="font-size:12px;color:#64748b;margin-top:3px">⏱ ' + (v.dur || '') + '</div>' +
    '</div>';
}).join('');

var html =
  '<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#1a1a2e;max-width:420px">' +
    '<div style="background:linear-gradient(135deg,#0ea5e9,#6366f1);border-radius:14px;padding:18px 20px;color:#fff;margin-bottom:16px">' +
      '<div style="font-size:12px;opacity:.9">📅 今日体态训练</div>' +
      '<div style="font-size:20px;font-weight:700;margin-top:4px">' + p.name + ' · ' + p.theme + '</div>' +
      '<div style="font-size:13px;opacity:.85;margin-top:6px">⏰ 建议完成时间 ' + (plan.defaultTime || '20:30') + ' 左右</div>' +
    '</div>' +
    '<div style="font-size:13px;color:#64748b;margin-bottom:8px;font-weight:600">今日跟练视频</div>' +
    vidCards +
    '<div style="background:#fff7ed;border-left:4px solid #f59e0b;border-radius:8px;padding:10px 12px;font-size:13px;color:#92400e;margin:14px 0">💡 ' + p.points + '</div>' +
    '<div style="background:#fef2f2;border-left:4px solid #ef4444;border-radius:8px;padding:10px 12px;font-size:13px;color:#991b1b;margin:14px 0">⚠️ 颈椎椎间盘突出者：幅度减半、疼痛即停。</div>' +
    '<a href="' + plan.siteUrl + '" style="display:block;text-align:center;background:#10b981;color:#fff;text-decoration:none;padding:14px;border-radius:12px;font-weight:700;font-size:16px;margin-top:4px">👉 点击开始今日跟练</a>' +
    '<div style="font-size:12px;color:#94a3b8;text-align:center;margin-top:10px">训练结束后回到网站填写今日反馈</div>' +
  '</div>';

var body = {
  token: process.env.PUSH_TOKEN,
  title: '🏋️ 今日体态训练 · ' + p.theme,
  content: html,
  template: 'html',
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
