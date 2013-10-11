var exec = require('cordova/exec');
/**
 * Constructor
 */
function MyPlugin() {}

MyPlugin.prototype.echo = function(text, callback) {
    exec(callback,
        function(error){
            // error handler
            console.error("Error", error);
        },
        "MyPlugin",
        "echo",
        [text]
    );
};

var myPlugin = new MyPlugin();
module.exports = myPlugin;