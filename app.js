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

// ######################################################################
//                                BRAIN JS
// ######################################################################

var net = new brain.NeuralNetwork();

// Treino da rede neural
net.train([
    {input: {combustivel: 0, bateria: 0, motorPartida: 0, alarme: 0}, output: {combustivel: 1}},
    {input: {combustivel: 0, bateria: 1, motorPartida: 1, alarme: 1}, output: {combustivel: 1}},
    {input: {combustivel: 1, bateria: 0, motorPartida: 0, alarme: 0}, output: {bateria: 1}},
    {input: {combustivel: 1, bateria: 0, motorPartida: 1, alarme: 0}, output: {bateria: 1}},
    {input: {combustivel: 1, bateria: 0, motorPartida: 0, alarme: 1}, output: {bateria: 1}},
    {input: {combustivel: 1, bateria: 0, motorPartida: 1, alarme: 1}, output: {bateria: 1}},
    {input: {combustivel: 1, bateria: 1, motorPartida: 0, alarme: 0}, output: {motorPartida: 1}},
    {input: {combustivel: 1, bateria: 1, motorPartida: 0, alarme: 1}, output: {motorPartida: 1}},
    {input: {combustivel: 1, bateria: 1, motorPartida: 1, alarme: 1}, output: {alarme: 1}},

    {input: {teclaAlerta: 1, fusivel: 0, releDaSeta: 1}, output: {teclaAlerta: 1}},
    {input: {teclaAlerta: 0, fusivel: 1, releDaSeta: 0}, output: {curtoNoCarro: 1}},
    {input: {teclaAlerta: 0, fusivel: 0, releDaSeta: 0}, output: {releDaSeta: 1}},
]);

// ######################################################################
//                                BOT BUIDER
// ######################################################################

// Configuração inicial do bot
var bot = new builder.UniversalBot(connector, [
    function(session) {
        session.send("Óla");
        session.send("Vou tentar te ajudar a descobrir o que há de errado com seu carro");
        session.beginDialog("mainMenu");
    }
]).set('storage', inMemoryStorage); // Register in-memory storage

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
    }, function(session, results){
        if(results.response.match(/(não)|(nao)|(Não)|(Nao)|(NÂO)|(NAO)/i)) {
            session.beginDialog("naoLiga");
        } else if(results.response.match(/(sim)|(Sim)|(SIM)/i)) {
            session.beginDialog("liga");
        }
    }
]);

//Dialog para resposta 'não'
bot.dialog('naoLiga', [
    function (session) {
        session.send("Vamos ver por que seu carro não está ligando.");
        session.beginDialog('combustivel');
    }, function(session, results) {
        session.dialogData.combustivel = results.response;
        session.beginDialog('bateria');
    }, function(session, results){
        session.dialogData.bateria = results.response;
        session.beginDialog('motorPartida');
    }, function(session, results) {
        session.dialogData.motorPartida = results.response;
        session.beginDialog('alarme');
    }, function(session, results) {
        session.dialogData.alarme = results.response;

        session.send(
            `${brainProcess(session.dialogData)}`
        );
        session.endDialog();
    }
]);

//Dialog para resposta 'sim'
bot.dialog('liga', [
    function (session) {
        session.send("Vamos ver o que pode está causando problema.");
        session.beginDialog('teclaAlerta');
    }, function(session, results) {
        session.dialogData.teclaAlerta = results.response;
        session.beginDialog('fusivel');
    },  function(session, results) {
        session.dialogData.fusivel = results.response;
        session.beginDialog('releDaSeta');
    }, function(session, results) {
        session.dialogData.releDaSeta = results.response;

        session.send(
            `${brainProcess(session.dialogData)}`
        );
        session.endDialog();
    }
]);

// Dialog provisorio para resposta 'sim'
//bot.dialog('outroProblemaQueAindaNaoSei', function(session) {
    //session.send("Por enquanto só sei trabalhar com carro que não liga :D");
//});

// Dialog do combustivel
bot.dialog('combustivel', [
    function(session) {
        builder.Prompts.text(session, "Seu carro tem combustivel?");
    }, function(session, results) {
        session.endDialogWithResult(results);
    }
]);
    
// Dialog da bateria
bot.dialog('bateria', [
    function(session) {
        builder.Prompts.text(session, "Consegue ligar/acender os farois?");
    }, function(session, results) {
        session.endDialogWithResult(results);
    }
]);

// Dialogo do motor de partida
bot.dialog('motorPartida', [
    function(session) {
        builder.Prompts.text(session, "Quando você gira a chave o carro faz o barulho normal para ligar?");
    }, function(session, results) {
        session.endDialogWithResult(results);
    }
]);

// Dialog do alarme
bot.dialog('alarme', [
    function(session) {
        builder.Prompts.text(session, "O alarme está ativado?");
    }, function(session, results) {
        session.endDialogWithResult(results);
    }
]);

// Dialog da tecla do alerta
bot.dialog('teclaAlerta', [
    function(session) {
        builder.Prompts.text(session, "Mexendo na tecla várias vezes e em várias posições, o alerta funciona?");
    }, function(session, results) {
        session.endDialogWithResult(results);
    }
]);

// Dialog do fusivel
bot.dialog('fusivel', [
    function(session) {
        builder.Prompts.text(session, "Já trocou o fusível do pisca-alerta?");
    }, function(session, results) {
        session.endDialogWithResult(results);
    }
]);

// Dialog do relé da seta
bot.dialog('releDaSeta', [
    function(session) {
        builder.Prompts.text(session, "Tanto a seta como o pisca alerta funcionam?");
    }, function(session, results) {
        session.endDialogWithResult(results);
    }
]);

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


//#################################################################################
//                        PROCESSAMENTO DA RESPOSTA
//#################################################################################

function getResults(res) {
    for(var key in res){
        if(res[key].match(/(não)|(nao)|(Não)|(Nao)|(NÂO)|(NAO)/i)){
            res[key] = 0;
        } else {
            res[key] = 1;
        }
    }
    return res;
}

function brainProcess(res) {
    delete res['BotBuilder.Data.WaterfallStep'];
    res = getResults(res);
    var output = net.run(res);
    return getFinalResult(output);
}

function getFinalResult(res) {
    var vals = [];    
    for(var i in res){
       vals.push(res[i]);
    }

    var max = Math.max.apply(null, vals);

     for(var i in res){
        if(res[i] == max){
            return "O problema tem " + parseFloat((res[i] * 100).toFixed(2)) + "% de chances de estar no(a) " + i;
        }
    }
}