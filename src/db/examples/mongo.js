const Mongoose = require("mongoose");

Mongoose.connect(
    "mongodb://fernandofreire:systemmongo@192.168.99.100:27017/herois",
    { useNewUrlParser: true },
    function (error) {
        if (error) {
            console.error("Falha na conexão: ", error);
            return;
        }
    }
);

const connection = Mongoose.connection;
connection.once("open", () => console.log("Database rodando!!!"));

const heroiSchema = new Mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    poder: {
        type: String,
        required: true
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
})

const model = Mongoose.model("herois", heroiSchema);

async function main() {

    const resultCadastrar = await model.create({
        nome: "Batman",
        poder: "dinheiro"
    });

    console.log(resultCadastrar);

    const listItens = await model.find();
    console.log('itens: ', listItens);
}

main();