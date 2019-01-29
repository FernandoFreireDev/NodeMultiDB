const ICrud = require('./interfaces/interfaceCrud')
const Sequelize = require('sequelize')

class Postgres extends ICrud {
    constructor() {
        super()
        this._driver = null
        this._herois = null
    }

    async defineModel() {
        this._herois = driver.define('herois', {
            id: {
                type: Sequelize.INTEGER,
                required: true,
                primaryKey: true,
                autoIncrement: true
            },
            nome: {
                type: Sequelize.STRING,
                required: true
            },
            poder: {
                type: Sequelize.STRING,
                required: true
            }
        }, {
                tableName: 'tb_herois',
                freezeTableName: false,
                timestamps: false
            })

        await this._herois.sync()
    }

    async connect() {
        this._driver = new Sequelize(
            'heroes',
            'fernandofreire',
            'system',
            {
                host: '192.168.99.100',
                dialect: 'postgres',
                quoteIdentifiers: false,
                operatorsAliases: false
            }
        )

        this.defineModel()
    }

    async isConnected() {
        try {
            await this._driver.authenticate()
            return true
        } catch (error) {
            console.error('Erro: ', error)
        }
    }

    create(item) {
        return this._herois.create(item)
    }
}

module.exports = Postgres