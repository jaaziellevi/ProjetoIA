var builder = require('botbuilder'),
    restify = require('restify');

var inMemoryStorage = new builder.MemoryBotStorage();

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
        console.log('%s listening to %s', server.name, server.url);
});

// Connector com o Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Escuta as mensagems do usuario
server.post('/api/messages', connector.listen());

// Configuração inicial do bot
var bot = new builder.UniversalBot(connector, [
    function(session) {
        session.send(`Óla<br/>Vou tentar te ajudar a descobrir o que há de errado com seu carro`);
        session.beginDialog("mainMenu");
    }
]).set('storage', inMemoryStorage); // Register in-memory storage

// Import dos dialogs
var naoLiga = require('./dialogs/naoLigaDialog.js')(bot);
var motor = require('./dialogs/motorDialog.js')(bot);
var barulho = require('./dialogs/barulhoDialog.js')(bot);
var painel = require('./dialogs/painelDialog.js')(bot);
var pneu = require('./dialogs/pneuDialog.js')(bot);
var pisca = require('./dialogs/piscaDialog.js')(bot);

//teste para o bot enviar msg primeiro
//bot.on('conversationUpdate', function (message) {
        //bot.send(new builder.Message().address(message.address).text('Oi'));

        //var msg = new builder.Message().address(message.address);
        //msg.text('Opa');
        //msg.textLocale('pt-BR');
        //bot.send(msg);    
//});

bot.dialog("mainMenu", [
    function(session) {
        builder.Prompts.text(session, "Seu carro está ligando?");
    }, function(session, results, next){
        if(results.response.match(/(não)|(nao)|(Não)|(Nao)|(NÂO)|(NAO)/i)) {
            session.beginDialog("naoLiga");
        } else if(results.response.match(/(sim)|(Sim)|(SIM)/i)) {
            next();
        }
    }, function(session) {
        builder.Prompts.text(session, "O motor anda falhando ou está fraco?");
    }, function(session, results, next){
        if(results.response.match(/(sim)|(Sim)|(SIM)/i)) {
            session.beginDialog("motor");
        } else if(results.response.match(/(não)|(nao)|(Não)|(Nao)|(NÂO)|(NAO)/i)) {
            next();
        }
    }, function(session) {
        builder.Prompts.text(session, "Seu carro está com algum barulho estranho?");
    }, function(session, results, next){
        if(results.response.match(/(sim)|(Sim)|(SIM)/i)) {
            session.beginDialog("barulho");
        } else if(results.response.match(/(não)|(nao)|(Não)|(Nao)|(NÂO)|(NAO)/i)) {
            next();
        }
    }, function(session) {
        builder.Prompts.text(session, "Seu carro está com luzes de painel acesas?");
    }, function(session, results, next){
        if(results.response.match(/(sim)|(Sim)|(SIM)/i)) {
            session.beginDialog("painel");
        } else if(results.response.match(/(não)|(nao)|(Não)|(Nao)|(NÂO)|(NAO)/i)) {
            next();
        }

    }, function(session) {
        builder.Prompts.text(session, "Algum problema com os pneus?");
    }, function(session, results, next){
        if(results.response.match(/(sim)|(Sim)|(SIM)/i)) {
            session.beginDialog("pneu");
        } else if(results.response.match(/(não)|(nao)|(Não)|(Nao)|(NÂO)|(NAO)/i)) {
            next();
        }    

    }, function(session) {
        builder.Prompts.text(session, "O pisca alerta está funcionado?");
    }, function(session, results, next) {
        if(results.response.match(/(não)|(nao)|(Não)|(Nao)|(NÂO)|(NAO)/i)) {
            session.beginDialog("pisca");
        } else if(results.response.match(/(sim)|(Sim)|(SIM)/i)) {
            session.beginDialog("outroProblemaQueAindaNaoSei");
        }
    }
]);

bot.dialog('outroProblemaQueAindaNaoSei', function(session) {
    session.send("Então, acho que seu carro não deve ter nenhum problema =D");
});

// A pilha de dialogo é limpa e este dialogo é invocado quando o usuario digita 'help'.
bot.dialog('help', function(session, args, next) {
    session.endDialog("Este é um bot para ajudar a identificar problemas com o seu veiculo. <br/>Por favor digite 'next' para continuar");
}).triggerAction({
    matches: /^help$/i,
    onSelectAction: (session, args, next) => {
        // Adiciona o dialogo help na pilha de dialogo
        // sobreescreve o comportamento padrão da pilha de dialogo
        session.beginDialog(args.action, args);
    }
});