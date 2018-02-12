var builder = require('botbuilder'),
    restify = require('restify'),
    brain = require('brain');

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
        session.send("Óla");
        session.send("Vou tentar te ajudar a descobrir o que há de errado com seu carro");
        session.beginDialog("mainMenu");
    }
]).set('storage', inMemoryStorage); // Register in-memory storage

bot.dialog("mainMenu", [
    function(session) {
        builder.Prompts.text(session, "Seu carro está ligando?");
    }, function(session, results){
        if(results.response.match(/(não)|(nao)|(Não)|(Nao)|(NÂO)|(NAO)/i)) {
            session.beginDialog("naoLiga");
        } else if(results.response.match(/(sim)|(Sim)|(SIM)/i)) {
            session.beginDialog("outroProblemaQueAindaNaoSei");
        }
    }
]);

//Dialog para resposta 'não'
bot.dialog('naoLiga', [
    function (session) {
        session.send("Vamos ver por que seu carro não está ligando.");
        session.beginDialog('combustivel');
    },
    function(session, results) {
        session.dialogData.combustivel = results.response;
        session.beginDialog('bateria');
    },
    function(session, results) {
        session.dialogData.bateria = results.response;
        session.beginDialog('alarme');
    },
    function(session, results) {
        session.dialogData.alarme = results.response;

        // Provisoriamente mostra as resposta do usuario
        session.send(
            `combustivel: ${session.dialogData.combustivel}<br/>bateria: ${session.dialogData.bateria}<br/>alarme: ${session.dialogData.alarme}`
        );
        session.endDialog();
    }
]);

// Dialog provisorio para resposta 'sim'
bot.dialog('outroProblemaQueAindaNaoSei', function(session) {
    session.send("Por enquanto só sei trabalhar com carro que não liga :D");
});

// Dialog do combustivel
bot.dialog('combustivel', [
    function(session) {
        builder.Prompts.text(session, "Seu carro tem combustivel?");
    },
    function(session, results) {
        session.endDialogWithResult(results);
    }
]);
    
// Dialog da bateria
bot.dialog('bateria', [
    function(session) {
        builder.Prompts.text(session, "Consegue ligar/acender os farois?");
    },
    function(session, results) {
        session.endDialogWithResult(results);
    }
]);

// Dialog do alarme
bot.dialog('alarme', [
    function(session) {
        builder.Prompts.text(session, "O alarme está ativado?");
    },
    function(session, results) {
        session.endDialogWithResult(results);
    }
]);

// A pilha de dialogo é limpa e este dialogo é invocado quando o usuario digita 'help'.
bot.dialog('help', function(session, args, next) {
    session.endDialog("Ete é um bot para ajudar a identificar problemas com o seu veiculo. <br/>Por favor digite 'next' para continuar");
}).triggerAction({
    matches: /^help$/i,
    onSelectAction: (session, args, next) => {
        // Adiciona o dialogo help na pilha de dialogo
        // sobreescreve o comportamento padrão da pilha de dialogo
        session.beginDialog(args.action, args);
    }
});