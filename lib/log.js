/**
 *  log.js
 */

 /*----------------------------------------------------------------------------*/
 /* IMPORTS                                                                    */
 /*----------------------------------------------------------------------------*/

//let {createLogger, format, transports} = require("winston");


/*----------------------------------------------------------------------------*/
/* DECLARATION AND INITIALIZATION                                             */
/*----------------------------------------------------------------------------*

let winstonLogger = createLogger({
    format: format.simple(),
    transports: [
        new (transports.Console) ({
            colorize: true,
            prettyPrint: true,
            timestamp: true
        })
    ]
});


/*----------------------------------------------------------------------------*/
/* EXPORTS                                                                    */
/*----------------------------------------------------------------------------*

module.exports = function(fileName) {
    let myLogger = {
        error: function(text) {
            winstonLogger.error(fileName + ": " + text);
        },
        info: function(text) {
            winstonLogger.info(fileName + ": " + text);
        }
    };

    return myLogger;
}
