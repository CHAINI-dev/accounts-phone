var Md5 = Npm.require('md5');
var Future = Npm.require('fibers/future');

SMS = {};
SMSTest = {};

var next_devmode_sms_id = 0;
var output_stream = process.stdout;

// Testing hooks
SMSTest.overrideOutputStream = function (stream) {
    next_devmode_sms_id = 0;
    output_stream = stream;
};

SMSTest.restoreOutputStream = function () {
    output_stream = process.stdout;
};

var devModeSend = function (options) {
    var devmode_sms_id = next_devmode_sms_id++;

    var stream = output_stream;

    // This approach does not prevent other writers to stdout from interleaving.
    stream.write("====== BEGIN SMS #" + devmode_sms_id + " ======\n");
    stream.write("(SMS not sent; to enable sending, set the TWILIO_CREDENTIALS " +
        "environment variable.)\n");
    var future = new Future;
    stream.write("To:" + options.to + "\n");
    stream.write("Text:" + options.body + "\n");
    stream.write("====== END SMS #" + devmode_sms_id + " ======\n");
    future['return']();
};

/**
 * Mock out sms sending (eg, during a test.) This is private for now.
 *
 * f receives the arguments to SMS.send and should return true to go
 * ahead and send the email (or at least, try subsequent hooks), or
 * false to skip sending.
 */
var sendHooks = [];
SMSTest.hookSend = function (f) {
    sendHooks.push(f);
};

/**
 * Send an sms.
 *
 * Connects to twilio via the CONFIG_VARS environment
 * variable. If unset, prints formatted message to stdout. The "from" option
 * is required, and at least one of "to", "from", and "body" must be provided;
 * all other options are optional.
 *
 * @param options
 * @param options.to {String} - The receiver SMS number
 * @param options.body {String}  - The content of the SMS
 */

SMS.send = function (options) {
  var apiUrl = 'http://http.yunsms.cn:80/tx/';

  for (var i = 0; i < sendHooks.length; i++)
        if (!sendHooks[i](options))
            return;

  if (SMS.yunsms) {
    var uid = SMS.yunsms.uid;
    var pwd = Md5(SMS.yunsns.pwd);

    var response = HTTP.call('POST', apiUrl, {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        'Connection': 'Close'
      },
      params: {
        uid: uid,
        pwd: pwd,
        encode: 'utf8',
        mobile: options.to,
        content: options.body
      }
    });

    var result = '';

    if (response.trim() == '100') {
      result = true;
    } else {
      throw new Meteor.Error("Error sending SMS ", getSMSerr(response.trim()));
    }
  } else {
    devModeSend(options);
  }
};

SMS.phoneTemplates = {
    text: function (user, code) {
        return 'Welcome your invitation code is: ' + code;
    }
};

function getSMSerr(re) {
  var msg = '';

  switch(re)
  {
    case  '100' :
      msg = '发送成功';
      break;
    case  '101' :
      msg = '验证失败（帐号密码错误）';
      break;
    case  '102' :
      msg = '短信不足';
      break;
    case  '103' :
      msg = '操作失败';
      break;
    case  '104' :
      msg = '非法字符';
      break;
    case  '105' :
      msg = '内容过多';
      break;
    case  '106' :
      msg = '号码过多';
      break;
    case  '107' :
      msg = '频率过快';
      break;
    case  '108' :
      msg = '号码内容空';
      break;
    case  '109' :
      msg = '帐号冻结';
      break;
    case  '110' :
      msg = '禁止频繁单条发送';
      break;
    case  '111' :
      msg = '帐号暂停发送';
      break;
    case  '112' :
      msg = '号码错误';
      break;
    case  '113' :
      msg = '定时时间格式不对';
      break;
    case  '114' :
      msg = '帐号临时锁定，10分钟后自动解锁';
      break;
    case  '115' :
      msg = '连接失败';
      break;
    case  '116' :
      msg = '禁止接口发送';
      break;
    case  '117' :
      msg = '绑定IP错误';
      break;
  }

  return msg;
}
