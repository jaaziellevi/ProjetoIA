var builder = require('botbuilder'),
    restify = require('restify'),
    brain = require('brain');

var inMemoryStorage = new builder.MemoryBotStorage();

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
        console.log('%s listening to %s', server.name, server.url);
});

// Chat connector or communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

// This dialog help the user order dinner to be delivered to the hotel room.
var dinnerMenu = {
    "Potato Salad - $5.99": {
        Description: "Potato Salad",
        Price: 5.99
    },
    "Tuna Sandwich - $6.89": {
        Description: "Tuna Sandwich",
        Price: 6.89
    },
    "Clam Chowder - $4.50": {
        Description: "Clam Chowder",
        Price: 4.50
    },
    "Check out": {
        Description: "Check out",
        Proce: 0 // Order total. Updated as items are added to order.
    },
    "Cancel order": { // Cancel order and back to Main Menu
        Description: "Cancel order",
        Price: 0
    }
};

// This is a reservation bot that has a menu of offerings.
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

//This dialog helps the user make a dinner reservation.
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
        session.dialogData.reservationName = results.response;

        // Process request and display reservation details
        session.send(
            `combustivel: ${session.dialogData.combustivel}<br/>        bateria: ${session.dialogData.bateria}<br/>alarme: ${session.dialogData.alarme}`
        );
        session.endDialog();
    }
]);

// Dialog to ask for a date and time
bot.dialog('combustivel', [
    function(session) {
        builder.Prompts.text(session, "Seu carro tem combustivel?");
    },
    function(session, results) {
        session.endDialogWithResult(results);
    }
]);
    
// Dialog to ask for number of people in the party
bot.dialog('bateria', [
    function(session) {
        builder.Prompts.text(session, "Consegue ligar/acender os farois?");
    },
    function(session, results) {
        session.endDialogWithResult(results);
    }
]);

// Dialog to ask for the reservation name
bot.dialog('alarme', [
    function(session) {
        builder.Prompts.text(session, "O alarme está ativado?");
    },
    function(session, results) {
        session.endDialogWithResult(results);
    }
]);

// The dialog stack is cleared and this dialog is invoked when the user enters 'help'.
bot.dialog('help', function(session, args, next) {
    session.endDialog("This is a bot that can help you make a dinner reservation. <br/>Please say 'next' to continue");
}).triggerAction({
    matches: /^help$/i,
    onSelectAction: (session, args, next) => {
        // Add the help dialog to the dialog stack
        // (override the default behavior of replacing the stack)
        session.beginDialog(args.action, args);
    }
});

// Menu: "Order dinner"
// This dialog allows user to order dinner to be delivered to their hotel room.
bot.dialog('orderDinner', [
    function(session) {
        session.send("Lets order some dinner!");
        session.beginDialog("addDinnerItem");
    },
    function(session, results) {
        if(results.response) {
            ///Display itemize order with price total.
            for (var i = 1; i < session.conversationData.orders.length; i++) {
                session.send(`You ordered: ${session.conversationData.orders[i].Description} for a total of $${session.conversationData.orders[i].Price}.`);
            }
            session.send(`Your total is $${session.conversationData.orders[0].Price}`);

            // Continue with the check out process.
            builder.Prompts.text(session, "What is your room number?");
        }
    },
    function(session, results) {
        if(results.response) {
            session.dialogData.room = results.response;
            var msg = `Thank you. Your order will be delivered to room #${results.response}`;
            session.send(msg);
            session.replaceDialog("mainMenu"); // Display the menu again.
        }
    }
]).reloadAction(
    "restartOrderDinner", "Ok. Let's start over.",
    {
        matches: /^start over$/i
    }
).cancelAction(
    "cancelOrder", "Type 'Main Menu' to continue.",
    {
        matches: /^nevermind$|^cacel$|^cancel.*order/i,
        confirmPrompt: "This will cancel your order. Are you sure?"
    }
);

// Add dinner items to the list by repeating this dialog until the user says 'check out'.
bot.dialog("addDinnerItem", [
    function(session, args) {
        if(args && args.reprompt) {
            session.send("What else would you like to have for dinner tonight?");
        } else {
            // New Order
            // Using the conversationData to store the orders
            session.conversationData.orders = new Array();
            session.conversationData.orders.push({
                Description: "Check out",
                Price: 0
            });
        }
        builder.Prompts.choice(session, "Dinner menu:", dinnerMenu);
    },
    function(session, results) {
        if(results.response) {
            if(results.response.entity.match(/^check out$/i)) {
                session.endDialog("Checking out...");
            } else if(results.response.entity.match(/^cancel/i)) {
                // Cancel the order and start "mainMenu" dialog.
                session.cancelDialog(0, "mainMenu");
            } else {
                var order = dinnerMenu[results.response.entity];
                session.conversationData.orders[0].Price += order.Price; // Add to total.
                var msg = `You ordered: ${order.Description} for a total of $${order.Price}.`;
                session.send(msg);
                session.conversationData.orders.push(order);
                session.replaceDialog("addDinnerItem", {reprompt: true}); // Repeat dinner menu
            }
        }
    }
]).reloadAction(
    "restartOrderDinner", "Ok. Let's start over.",
    {
        matches: /^start over$/i
    }
);