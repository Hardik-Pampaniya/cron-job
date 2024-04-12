const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    "cron-job",
    "root",
    "",
    {
        dialect : 'mysql',
        host : 'localhost'
    }
)

module.exports = sequelize;