var builder = require('botbuilder'),
    brain   = require("../brainApp.js");

module.exports = function(bot){
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
                `${brain.brainProcess(session.dialogData)}`
            );
            session.endConversation();
        }
    ]);

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
}