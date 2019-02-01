/*
    docker exec -it d8f0f24f4f25 mongo -u fernandofreire -p systemmongo -authenticationDatabase herois

    show dbs
    use herois

    show collections


*/

db.herois.insert({
    nome: "Flash",
    poder: "Velocidade",
    dataNascimento: "1998-01-01"
})

db.herois.find()
db.herois.find().pretty()

for (let i = 0; i < 100; i++) {
    db.herois.insert({
        nome: `Clone-${i}`,
        poder: "Velocidade",
        dataNascimento: "1998-01-01"
    })
}

db.herois.count()
db.herois.findOne()
db.herois.find().limit(20).sort({ nome: -1 })
db.herois.find({}, { poder: 1, _id: 0 })

db.herois.update({ _id: ObjectId("5c5465dc7f20b7de4f5aa7e6") }, { nome: "Mulher maravilha" })

db.herois.update(
    { poder: "Velocidade" },
    { $set: { poder: "Anel" } }
)

db.herois.remove({})
db.herois.remove({ nome: "Flash"})