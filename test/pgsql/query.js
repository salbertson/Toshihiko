/**
 * XadillaX created at 2015-03-19 17:25:26
 *
 * Copyright (c) 2015 Huaban.com, all rights
 * reserved
 */
var should = require("should");
var T = require("../../");
var async = require("async");
var toshihiko = new T.Toshihiko("toshihiko_test", "root", "", {
    engine: "pgsql",
    // showSql: true
});

var Model = null;
describe("pgsql query", function () {
    before(function(done) {
        var sql = "CREATE TABLE \"test\" (" +
            "id serial NOT NULL primary key," +
            "key2 integer NOT NULL," +
            "key3 varchar(200) NOT NULL DEFAULT ''," +
            "key4 varchar(200) NOT NULL DEFAULT ''" +
            ");";
        toshihiko.execute("DROP TABLE test", function() {
            toshihiko.execute(sql, done);
        });
    });

    before(function(done) {
        Model = toshihiko.define("test", [
            { name: "key1", column: "id", primaryKey: true, type: T.Type.Integer },
            {
                name: "key2",
                type: T.Type.Integer, 
                defaultValue: 1, 
                validators: [
                    function(v) {
                        if(v > 100) return "`key2` can't be greater than 100";
                    }
                ]
            },
            { name: "key3", type: T.Type.Json, defaultValue: {} },
            { name: "key4", type: T.Type.String, defaultValue:"Ha!"}
        ]);
        done();
    });

    after(function(done) {
        toshihiko.execute("DROP TABLE \"test\";", done);
    });

    describe("insert", function () {
        it("insert 10 row", function (done) {
            var arr = [];
            var i = 10;
            while(i--) arr.push(i);

            async.parallel(arr.map(function (it) {
                return function(cb) {
                    var yukari = Model.build({
                        key2    : it + 0.1,
                        key3    : { it: it % 2 },
                        key4    : "哈哈" + it % 3
                    });

                    yukari.insert(function (err) {
                        should(err).equal(undefined);
                        cb(null, it);
                    });
                };
            }), function(err, data) {
                data.should.eql(arr);
                should(err).not.be.ok;
                done();
            });
        });
    });
});

