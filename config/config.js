var path = require('path'),
  rootPath = path.normalize(__dirname + '/..'),
  templatePath = path.normalize(__dirname + '/../server/mailer/templates'),
  notifier = {
      service: 'postmark',
      APN: false,
      email: false, // true
      actions: ['comment'],
      tplPath: templatePath,
      key: 'POSTMARK_KEY',
      parseAppId: 'PARSE_APP_ID',
      parseApiKey: 'PARSE_MASTER_KEY'
    }
module.exports = {
  development: {
    db: 'mongodb://localhost/portal',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Nodular'
    }
  },
  test: {
    db: 'mongodb://localhost/portal_test',
    root: rootPath,
    notifier: notifier,
    app: {
      name: 'Nodular'
    }
  },
  production: {}
}