var builder = require('botbuilder'),
    brain   = require("../brainApp.js");

module.exports = function(bot){
    //Dialog para resposta 'sim'
    bot.dialog('pisca', [
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
                `${brain.brainProcess(session.dialogData)}`
            );
            session.endDialog();
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
}