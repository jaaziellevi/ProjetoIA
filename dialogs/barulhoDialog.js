var builder = require('botbuilder'),
    brain   = require("../brainApp.js");

module.exports = function(bot){
    bot.dialog('barulho', [
        function(session) {
            session.send("Vamos tentar identificar o motivo do barulho.");
            builder.Prompts.text(session, "Em qual parte do carro é o barulho? (frente, meio, traseira)");
        }, function(session, results) {
            if(results.response.match(/(dianteira)|(frente)|(motor)/i)) {
                session.beginDialog('dianteira');
            } else if(results.response.match(/(meio)|(cabine)/i)) {
                session.beginDialog('meio');
            } else if(results.response.match(/(traseira)|(atras)|(fundo)|(porta-mala)|(porta mala)/i)) {
                session.beginDialog('traseira');
            } else {
                session.send("Desculpe, não consegui te enteder. Onde é mesmo o barulho?");
            }
        }
    ]);

    bot.dialog('dianteira', [
        function(session) {
            session.send("Certo");
            session.dialogData.parteCarro = 0;
            session.beginDialog('freio');
        }, function(session, results) {
            session.dialogData.freio = results.response;
            session.beginDialog('volante');
        }, function(session, results) {
            session.dialogData.volante = results.response;
            session.beginDialog('buraco');
        }, function(session, results) {
            session.dialogData.buraco = results.response;
            session.beginDialog('batida');
        }, function(session, results) {
            session.dialogData.batida = results.response;
            session.send(
                `${brain.brainProcess(session.dialogData)}`
            );
            session.endConversation();
        }
    ]);

    bot.dialog('meio', [
        function(session) {
            session.send("Certo");
            session.dialogData.parteCarro = 0.5;
            session.beginDialog('porta');
        }, function(session, results) {
            session.dialogData.porta = results.response;
            session.beginDialog('passageiro');
        }, function(session, results) {
            session.dialogData.passageiro = results.response;
            session.beginDialog('coluna');
        }, function(session, results) {
            session.dialogData.coluna = results.response;
            session.beginDialog('batida');
        }, function(session, results) {
            session.dialogData.batida = results.response;
            
            session.send(
                `${brain.brainProcess(session.dialogData)}`
            );
            session.endConversation();
        }
    ]);

    bot.dialog('traseira', [
        function(session) {
            session.send("Certo");
            session.dialogData.parteCarro = 1;
            session.beginDialog('batida');
        }, function(session, results) {
            session.dialogData.batida = results.response;
            session.beginDialog('passageiro');
        }, function(session, results) {
            session.dialogData.passageiro = results.response;
            
            session.send(
                `${brain.brainProcess(session.dialogData)}`
            );
            session.endConversation();
        }
    ]);

    bot.dialog('freio', [
        function(session) {
            builder.Prompts.text(session, "Faz barulho quando você pisa no freio?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    bot.dialog('volante', [
        function(session) {
            builder.Prompts.text(session, "Algum barulho estranho quando você esterça o volante?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    bot.dialog('buraco', [
        function(session) {
            builder.Prompts.text(session, "Faz um barulho grave quando você passa por buraco?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    bot.dialog('porta', [
        function(session) {
            builder.Prompts.text(session, "Faz barulho ao abrir ou fechar a porta?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    bot.dialog('passageiro', [
        function(session) {
            builder.Prompts.text(session, "O barulhor é maior quando você não está levando passageiro?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    bot.dialog('coluna', [
        function(session) {
            builder.Prompts.text(session, "O barulhor vem de algum lugar na altura da cabeça?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    bot.dialog('batida', [
        function(session) {
            builder.Prompts.text(session, "O carro já foi batido?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);
}