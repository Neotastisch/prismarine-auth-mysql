const mysql = require('mysql')
const mysqlpass = require("/home/config.js")

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'grieferbot',
  password: mysqlpass.mysqlpass
  database: 'GGBot'
})
connection.connect()


class FileCache {
  constructor(cacheLocation) {
    this.cacheLocation = cacheLocation
  }

  async loadInitialValue() {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM cache WHERE location = ?", [this.cacheLocation], (err, result) => {
        if (err || !result[0]) {
          const cached = {};
          connection.query("INSERT INTO cache (location, value) VALUES (?, ?)", [this.cacheLocation, JSON.stringify(cached)], (err, result2) => {
            if (err) {
              reject(err);
            } else {
              resolve(cached);
            }
          });
        } else {
          resolve(JSON.parse(result[0].value));
        }
      });
    });
  }

  async getCached() {
    if (this.cache === undefined) {
      this.cache = await this.loadInitialValue();
    }
    return this.cache;
  }


  async setCached(cached) {
    this.cache = cached
    connection.query("UPDATE cache SET value = ? WHERE location = ?", [JSON.stringify(cached), this.cacheLocation], (err, result) => {
      if (err) throw err;
    })

  }

  async setCachedPartial(cached) {
    await this.setCached({
      ...this.cache,
      ...cached
    })
  }
}

module.exports = FileCache
