/**
 * XadillaX created at 2015-03-19 15:56:23
 *
 * Copyright (c) 2015 Huaban.com, all rights
 * reserved
 */
var util = require("util");
var pgsql = require("pg");
var BaseEngine = require("./base");
var escaper = require("../escaper");

var PgSQL = function(options) {
    BaseEngine.call(this, options);

    this.keywordSymbol = "\"";
    this.stringSymbol = "'";
};

util.inherits(PgSQL, BaseEngine);

PgSQL.prototype.execute = function(sql, callback) {
    pgsql.connect(this.options, function(err, conn, connDone) {
        if(err) return callback(err);

        conn.query(sql, function(err, result) {
            connDone();
            callback(err, result);
        });
    });
};

PgSQL.prototype.makeInsertSQL = function(table, object) {
    var sql = "INSERT INTO " + table;
    var key = [], value = [];
    for(var k in object) {
        if(!object.hasOwnProperty(k)) continue;
        key.push(k);
        value.push(object[k]);
    }

    sql = key.reduce(function(sql, key) {
        if(sql[sql.length - 1] !== "(") sql += ", ";
        sql += "\"";
        sql += key;
        sql += "\"";
        return sql;
    }, sql + "(") + ") VALUES (";

    sql = value.reduce(function(sql, value) {
        if(sql[sql.length - 1] !== "(") sql += ", ";
        if(typeof value === "string") {
            sql += "'";
            sql += escaper.escape(value);
            sql += "'";
        } else {
            sql += value;
        }
        return sql;
    }, sql) + ")";

    return sql;
};

module.exports = PgSQL;
