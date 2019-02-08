/**
 *	tjbotDB.js
 */

/*----------------------------------------------------------------------------*/
/* IMPORTS                                                                    */
/*----------------------------------------------------------------------------*/
let Cloudant = require('@cloudant/cloudant');

/*----------------------------------------------------------------------------*/
/* DECLARATIONS & INITIALIZATION                                              */
/*----------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------*/
/* PRIVATE FUNCTIONS			                                              */
/*----------------------------------------------------------------------------*/

/*----------------------------------------------------------------------------*/
/* tjbotDB						                                              */
/*----------------------------------------------------------------------------*/

class TJBotDB {
	constructor(vcapServices) {
		console.log(vcapServices);
		// Load the Cloudant library.

		this.cloudant = Cloudant(vcapServices.cloudantNoSQLDB[0].credentials);

		/*const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}
		const appEnv = cfenv.getAppEnv(appEnvOpts);


		if (appEnv.services['cloudantNoSQLDB'] || appEnv.getService(/cloudant/)) {

		// Initialize database with credentials
		if (appEnv.services['cloudantNoSQLDB']) {
				// CF service named 'cloudantNoSQLDB'
				this.cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);
		} else {
				// user-provided service with 'cloudant' in its name
				this.cloudant = Cloudant(appEnv.getService(/cloudant/).credentials);
		}
		} else if (process.env.CLOUDANT_URL){
				this.cloudant = Cloudant(process.env.CLOUDANT_URL);
		}*/
		if(this.cloudant) {
			//database name
			var dbName = 'tjbotdb';

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
				var result = JSON.stringify(body);
				if (body.ok) {
					tjbot._id = body.id;
					tjbot._rev = body.rev;
				}
				console.log('body: ' + result);
			}
		});
	}

	getBotList() {
		var list = {};
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
