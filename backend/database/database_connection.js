require('dotenv').config()
const mongodb = require('mongodb')

module.exports = (function() {
    var maindb = '';
  
    return { // public interface
        initConnection: function (cb) {
            let uri = process.env.MONGODB_CONNECTION_STRING
            mongodb.MongoClient.connect(uri, {useNewUrlParser: true}, function(err, db) {
                if (err) throw err;
                maindb = db.db('kansen_index');
                console.log("db connection established");
                cb()
            })
        },
        getConnection: function () {
            if (maindb === '') this.initConnection
            return maindb
        }
    };
}) ();