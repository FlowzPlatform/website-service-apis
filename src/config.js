
module.exports = {
    path: '/var/www/html/websites/',
    basePath: '/var/www/html/',
     // gitLabUrl: 'http://209.50.53.116',
    // gitLabUrl: 'https://209.50.50.225',
    gitLabUrl:'https://gitlab.com',
    // gitLabUrl: 'http://209.50.49.140',
    gitLabUsername: 'cenacle-devops',
    // mailSendApi: "http://api.flowzcluster.tk/sendmail/email/send",
    mailSendApi: "http://api."+process.env.domainKey+"/sendmail/email/send",
    // gitLabToken: 'eQ1-V9hyB9PN_XYnYfkV'
    gitLabToken: 'r4BStw4h7nhsgdoMnzJP'
}
