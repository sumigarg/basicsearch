var ids = {
facebook: {
 clientID: '642359542549991',
 clientSecret: 'd5a807c2dfd569f0d7203e7a97db7989',
 callbackURL: 'http://localhost:3000/auth/facebook/callback'
},
twitter: {
 consumerKey: 'get_your_own',
 consumerSecret: 'get_your_own',
 callbackURL: "http://127.0.0.1:1337/auth/twitter/callback"
},
github: {
 clientID: 'get_your_own',
 clientSecret: 'get_your_own',
 callbackURL: "http://127.0.0.1:1337/auth/github/callback"
},
google: {
    consumerKey: '892300243903-j4f98pvq96snq4da18j9vvhkdfrt5qi0.apps.googleusercontent.com',
    consumerSecret: 'bM7vMw3H3X1p9PRNClYOgpAk',
    callbackURL: "http://localhost:3000/auth/google/callback"
}
}

module.exports = ids