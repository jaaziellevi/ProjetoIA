var builder = require('botbuilder'),
    brain   = require("../brainApp.js");

module.exports = function(bot){
    bot.dialog("motor", [
        function(session, results) {
            session.dialogData.motorFraco = 1;
            session.send("Ok.");
            session.beginDialog('oleo');
        }, function(session, results) {
            session.dialogData.oleo = results.response;
            session.beginDialog('injecao');
        }, function(session, results) {
            session.dialogData.injecao = results.response;
            session.beginDialog('fumaca');
        }, function(session, results) {
            session.dialogData.fumaca = results.response;
            session.send(
                `${brain.brainProcess(session.dialogData)}`
            );
            session.endConversation();
        }
    ]);

    bot.dialog('oleo', [
        function(session) {
            builder.Prompts.text(session, "A luz de óleo está acesa, ou acende com o carro andando?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    bot.dialog('injecao', [
        function(session) {
            builder.Prompts.text(session, "A luz da injeção está acesa, ou acende com o carro andando?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    bot.dialog('fumaca', [
        function(session) {
            builder.Prompts.text(session, "O carro está com excesso de fumaça?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);
}