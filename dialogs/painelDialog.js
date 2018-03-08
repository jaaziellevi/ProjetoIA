var builder = require('botbuilder'),
    brain   = require("../brainApp.js");

module.exports = function(bot){
    bot.dialog('painel', [
        function(session) {
            session.send("Vamos tentar identificar o problema no painel.");
            builder.Prompts.text(session, "Que luzes permanecem acesas após ligar o carro? (óleo, temperatura do motor, freio de mão)");
        }, function(session, results) {
            if(results.response.match(/(óleo)|(oleo)/i)) {
                session.beginDialog('óleo');
            } else if(results.response.match(/(temperatura)|(motor)|(temperatura do motor)/i)) {
                session.beginDialog('temperatura do motor');
            } else if(results.response.match(/(freio de mão)|(freio de mao)|(freio)/i)) {
                session.beginDialog('freio de mão');
            } else {
                session.send("Desculpe, não consegui te enteder. Qual é mesmo o luz acesa?");
            }
        }
    ]);

    bot.dialog('óleo', [
        function(session) {
            session.send("Certo");
            session.dialogData.óleo = 1;
            session.beginDialog('oleoLuz');
        }, function(session, results) {
            session.dialogData.oleoLuz = results.response;
            session.beginDialog('nivel');
        }, function(session, results) {
            session.dialogData.nivel = results.response;
            session.beginDialog('limpo');
        }, function(session, results) {
            session.dialogData.limpo = results.response;
            session.beginDialog('emdia');
        }, function(session, results) {
            session.dialogData.emdia = results.response;
            session.send(
                `${brain.brainProcess(session.dialogData)}`
            );
            session.endConversation();
        }
    ]);

    bot.dialog('temperatura do motor', [
        function(session) {
            session.send("Certo");
            session.dialogData.painel = 0.5;
            session.beginDialog('aguaN');
        }, function(session, results) {
            session.dialogData.aguaN = results.response;
            
            session.send(
                `${brain.brainProcess(session.dialogData)}`
            );
            session.endConversation();
        }
    ]);

    bot.dialog('freio de mão', [
        function(session) {
            session.send("Certo");
            session.dialogData.painel = 0;
            session.beginDialog('puxado');
        }, function(session, results) {
            session.dialogData.puxado = results.response;
          
            session.send(
                `${brain.brainProcess(session.dialogData)}`
            );
            session.endConversation();
        }
    ]);


    bot.dialog('oleoLuz', [
        function(session) {
            builder.Prompts.text(session, "A luz de óleo do motor está acesa, ou acende com o carro andando?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    bot.dialog('nivel', [
        function(session) {
            builder.Prompts.text(session, "O nível do óleo do motor está na medida correta?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    bot.dialog('limpo', [
        function(session) {
            builder.Prompts.text(session, "O óleo do motor está limpo?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    bot.dialog('emdia', [
        function(session) {
            builder.Prompts.text(session, "A troca de óleo do motor está em dia?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    bot.dialog('puxado', [
        function(session) {
            builder.Prompts.text(session, "O freio de mão está puxado?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    bot.dialog('aguaN', [
        function(session) {
            builder.Prompts.text(session, "A água do motor está no nível correto?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

}