var builder = require('botbuilder'),
brain   = require("../brainApp.js");

module.exports = function(bot){

bot.dialog('pneu', [
    function(session, results) {
        session.dialogData.pneu = 1;
        session.send("Ok.");
        session.beginDialog('baixo');
    }, function(session, results) {
        session.dialogData.baixo = results.response;
        session.beginDialog('estourado');
    }, function(session, results){
        session.dialogData.estourado = results.response;
        session.beginDialog('careca');
    }, function(session, results) {
        session.dialogData.careca = results.response;
        session.beginDialog('incompativel');
    }, function(session, results) {
        session.dialogData.incompativel = results.response;

        session.send(
            `${brain.brainProcess(session.dialogData)}`
        );
        session.endConversation();
    }
]);


bot.dialog('baixo', [
    function(session) {
        builder.Prompts.text(session, "Seu pneu está mais baixo que o normal?");
    }, function(session, results) {
        session.endDialogWithResult(results);
    }
]);
    

bot.dialog('estourado', [
    function(session) {
        builder.Prompts.text(session, "Seu pneu estourou?");
    }, function(session, results) {
        session.endDialogWithResult(results);
    }
]);


bot.dialog('careca', [
    function(session) {
        builder.Prompts.text(session, "Seu pneu está derrapando na pista?");
    }, function(session, results) {
        session.endDialogWithResult(results);
    }
]);

bot.dialog('incompativel', [
    function(session) {
        builder.Prompts.text(session, "Algum problema no encaixe do pneu?");
    }, function(session, results) {
        session.endDialogWithResult(results);
    }
]);
}