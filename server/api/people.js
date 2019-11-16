const router = require("express").Router();
const { Person, Dish } = require("../../db");

// make sure to use router.get, router.post etc..., instead of app.get, app.post, or etc... in this file.
// see https://expressjs.com/en/api.html#routers

router.get("/", async(req, res, next) => {
    const attending = req.query.is_attending;
    const dishes = req.query.include_dishes;
    let data = null;
    try {
        if (dishes === 'true') {
            data = await Person.findAll({
                where: {
                    isAttending: (typeof attending != 'undefined' ? attending : [true, false]),
                },
                order: [
                    ['createdAt', 'DESC']
                ],
                include: [Dish]
            });
        }
        else {
            data = await Person.findAll({
                where: {
                    isAttending: (typeof attending != 'undefined' ? attending : [true, false]),
                },
                order: [
                    ['createdAt', 'DESC']
                ]
            });
        }
        if (data) {
            res.status(200).send(data);
        }
    }
    catch (e) {
        next(e);
    }
});

router.post("/", async(req, res, next) => {
    try {
        if (req.body.name && req.body.isAttending) {
            const newPerson = await Person.create(req.body);
            res.status(201).send(newPerson);
        }
        else {
            res.status(400).send('bad request');
        }
    }
    catch (e) {
        next(e);
    }
})

router.put("/:id", async(req, res, next) => {
    try {
        const updatedRows = await Person.update({...req.body},
        {
            where: {
                id: req.params.id,
            }
        });
        if (updatedRows[0]) {
            res.status(200).send(await Person.findAll({where: {id: req.params.id}}));
        }
        else {
            res.status(404).send('person not found');
        }
    }
    catch (e) {
        res.status(400).send('bad request');
        next(e);
    }
})

router.delete("/:id", async(req, res, next) => {
    try {
        const rows = await Person.destroy({
            where: {
                id: req.params.id,
            }
        });
        if (rows) {
            res.status(204).send();
        }
        else {
            res.status(404).send('person not found');
        }
    }
    catch (e) {
        res.status(400).send('bad request');
        next(e);
    }
})

module.exports = router;
