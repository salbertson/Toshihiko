/**
 * XadillaX created at 2015-03-19 13:59:28
 *
 * Copyright (c) 2015 Huaban.com, all rights
 * reserved
 */
var util = require("util");
var mysql = require("mysql");
var BaseEngine = require("./base");

/**
 * MySQL engine interface
 * @param {Object} options the options object
 * @constructor
 */
var MySQL = function(options) {
    BaseEngine.call(this, options);

    var self = this;
    this.mysql = mysql.createPool(options);
    this.mysql.on("connection", function(/** connection */) {
        /* istanbul ignore if */
        if(!process.env.YOURPACKAGE_COVERAGE && self.options.showSql) {
            console.log("❤️ A new MySQL connection from Toshihiko is set. ⁽⁽ଘ( ˙꒳˙ )ଓ⁾⁾");
        }
    });

    this.keywordSymbol = "`";
    this.stringSymbol = "\"";
};

util.inherits(MySQL, BaseEngine);

/**
 * execute a certain sql
 * @param {String} sql the sql string
 * @param {Function} callback the callback function
 */
MySQL.prototype.execute = function(sql, callback) {
    this.mysql.getConnection(function(err, conn) {
        if(err) {
            return callback(err);
        }

        conn.query(sql, function(err, rows) {
            conn.release();
            callback(err, rows);
        });
    });
};

/**
 * make insert SQL
 * @param {String} table the table name
 * @param {Object} object the data to be inserted
 * @return {String} the sql string
 */
MySQL.prototype.makeInsertSQL = function(table, object) {
    var sql = "INSERT INTO `{table}` SET ?".assign({ 
        table: table
    });
    return mysql.format(sql, object);
};

module.exports = MySQL;

