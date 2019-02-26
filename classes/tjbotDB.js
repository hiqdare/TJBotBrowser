/**
 *	tjbotDB.js
 */

/*----------------------------------------------------------------------------*/
/* IMPORTS                                                                    */
/*----------------------------------------------------------------------------*/
const Cloudant = require('@cloudant/cloudant');

/*----------------------------------------------------------------------------*/
/* TJBotDB						                                              */
/*----------------------------------------------------------------------------*/

/**
 * TJBotDB
 *
 * @constructor
 * @param {object} vcapServices object with service information
 */
class TJBotDB {
	constructor(vcapServices) {

		if (typeof(vcapServices) !== "object") {
			throw new Error("VCAP service must be type of 'object'");
		}

		this.cloudant = Cloudant(vcapServices.cloudantNoSQLDB[0].credentials);

		if(this.cloudant) {
			//database name
			let dbName = 'tjbotdb';

			// Create a new "mydb" database.
			this.cloudant.db.create(dbName, function(err, data) {
					if(!err) //err if database doesn't already exists
					console.log("Created database: " + dbName);
			});

			// Specify the database we are going to use (mydb)...
			this.mydb = this.cloudant.db.use(dbName);

			if(!this.mydb) {
				console.log("No DB connection");
			}
		}
	}

	/**
	 * add the bot to the DB
	 * @param {object} tjbot object with information and configuration
	 */
	addBotToDB(tjbot) {
		if(!this.mydb) {
			console.log("No database.");
		}
		// insert the username as a document
		this.mydb.insert(tjbot, function(err, body, header) {
			if (err) {
				console.log('[mydb.insert] ', err.message);
				return;
			} else {
				let result = JSON.stringify(body);
				if (body.ok) {
					tjbot._id = body.id;
					tjbot._rev = body.rev;
				}
				console.log('body: ' + result);
			}
		});
	}

	/**
	 * returns a list with bot objects
	 */
	getBotList() {
		let list = {};
		this.mydb.list({ include_docs: true }, function(err, body) {
			if (!err) {
				body.rows.forEach(function(row) {
					if(row.doc)
						row.doc.web.status = "offline";
						list[row.doc.data.cpuinfo.Serial] = row.doc;
				});
			}
		});
		return list;
	}
}

module.exports = TJBotDB;
