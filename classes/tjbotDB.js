/**
 *	tjbotDB.js
 */

/*----------------------------------------------------------------------------*/
/* IMPORTS                                                                    */
/*----------------------------------------------------------------------------*/
const Cloudant = require('@cloudant/cloudant');
const dbName = 'tjbotdb';

/*----------------------------------------------------------------------------*/
/* TJBotDB						                                              */
/*----------------------------------------------------------------------------*/

/**
 * TJBotDB
 *
 * @constructor
 * @param {object} cloudantNoSQLDB object with service information
 */
class TJBotDB {
	constructor(cloudantNoSQLDB) {

		if (typeof(cloudantNoSQLDB) !== "object") {
			throw new Error("cloudantNoSQLDB must be type of 'object'");
		}

		this.cloudant = Cloudant(cloudantNoSQLDB.credentials);
	}

	

	/**
	 * add the bot to the DB
	 * @param {object} botManager botManager to store the tjbotList in
	 * @param {function} callback function(err)
	 */
	connect(botManager, callback) {
		if(this.cloudant) {
			// Create a new "mydb" database.
			this.cloudant.db.create(dbName, function(err, data) {
				if(err) { // err if database doesn't already exists
					callback(err);
				} else {
					console.log("Created database: " + dbName);
					console.log("data: " + data);
				}
			});

			// Specify the database we are going to use (mydb)...
			this.mydb = this.cloudant.db.use(dbName);

			if(this.mydb) {
				this.mydb.list({ include_docs: true }, function(err, body) {
					let botList = {};
					let count = 0;
					if (err) {
						// handle err
						callback(err);
					} else {
						body.rows.forEach(function(row) {
							count++;
							if(row.doc) {
								row.doc.web.status = "offline";
								if (row.doc.data.cpuinfo.Serial in botList) {
									console.log("DUPLICATE SERIAL ENTRY " + row.doc.data.cpuinfo.Serial);
								}
								botList[row.doc.data.cpuinfo.Serial] = row.doc;
							}
						});
						console.log(count + " entries in DB vs. " + Object.keys(botList).length + " in list");
						botManager.setTJBotList(botList);
					}
				});
			} else {
				callback(new Error("No DB connection"));
			}
			console.log("DB connected");
		}
	}

	/**
	 * add the bot to the DB
	 * @param {object} tjbot object with information and configuration
	 * @param {function} callback function(err)
	 */
	addBotToDB(tjbot, callback) {
		if(!this.mydb) {
			callback(new Error("No database"));
		} else {
			// insert the username as a document
			this.mydb.insert(tjbot, function(err, body, header) {
				if (err) {
					callback(err);
				} else {
					if (body.ok) {
						tjbot._id = body.id;
						tjbot._rev = body.rev;
					}
				}
			});
		}
	}
}

module.exports = TJBotDB;
