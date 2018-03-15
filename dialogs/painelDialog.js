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
            session.beginDialog('vapor');
        }, function(session, results) {
            session.dialogData.vapor = results.response;
            session.beginDialog('velocidade');
        }, function(session, results) {
            session.dialogData.velocidade = results.response;
            session.beginDialog('aguaN');
        }, function(session, results) {
            session.dialogData.aguaN = results.response;
            session.beginDialog('ventilador');
        }, function(session, results) {
            session.dialogData.ventilador = results.response;
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
            session.beginDialog('pastilha');
        }, function(session, results) {
            session.dialogData.pastilha = results.response;
            session.beginDialog('fluido');
        }, function(session, results) {
            session.dialogData.fluido = results.response;
            session.send(
                `${brain.brainProcess(session.dialogData)}`
            );
            session.endConversation();
        }
    ]);


    bot.dialog('oleoLuz', [
        function(session) {
            builder.Prompts.text(session, "A luz de óleo do motor está acesa ou acende com o carro andando?");
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


    bot.dialog('pastilha', [
        function(session) {
            builder.Prompts.text(session, "A luz acendeu por frenagens e acelerações fortes?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    bot.dialog('fluido', [
        function(session) {
            builder.Prompts.text(session, "O nível do fluido está entre as marcas MAX e MIN?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    bot.dialog('vapor', [
        function(session) {
            builder.Prompts.text(session, "Está saindo vapor na região do motor?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    bot.dialog('velocidade', [
        function(session) {
            builder.Prompts.text(session, "Você dirigiu em subida íngrime em altas temperaturas, ou dirigiu em alta velocidade, ou dirigiu em marcha lenta por um longo período?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    bot.dialog('aguaN', [
        function(session) {
            builder.Prompts.text(session, "O nível do líquido de arrefecimento está no máximo?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

    bot.dialog('ventilador', [
        function(session) {
            builder.Prompts.text(session, "O ventilador do motor está funcionando?");
        }, function(session, results) {
            session.endDialogWithResult(results);
        }
    ]);

  

}