const router = require("express").Router();
const { Dish, Person } = require("../../db");

// make sure to use router.get, router.post etc..., instead of app.get, app.post, or etc... in this file.
// see https://expressjs.com/en/api.html#router

router.get("/", async (req, res, next) => {
    try {
        const dishes = await Dish.findAll();
        if (dishes) {
            res.status(200).send(dishes);
        }
        else {
            res.status(404).send('not found');
        }
    }
    catch (e) {
        res.status(400).send('bad request');
        next(e);
    }
});

router.get("/:id", async (req, res, next) => {
    try {
        const dish = await Dish.findAll({
            where: {
                id: req.params.id,
            }
        });
        if (dish) {
            res.status(200).send(dish);
        }
        else {
            res.status(404).send('not found');
        }
    }
    catch (e) {
        res.status(400).send('bad request');
        next(e);
    }
});

router.post("/", async(req, res, next) => {
    try {
        if (req.body.name && req.body.description) {
            const newDish = await Dish.create(req.body);
            res.status(201).send(newDish);
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
        const updatedRows = await Dish.update({...req.body},
        {
            where: {
                id: req.params.id,
            }
        });
        if (updatedRows[0]) {
            res.status(200).send(await Dish.findAll({where: {id: req.params.id}}));
        }
        else {
            res.status(400).send('bad request');
        }
    }
    catch (e) {
        res.status(400).send('bad request');
        next(e);
    }
})

router.delete("/:id", async(req, res, next) => {
    try {
        const rows = await Dish.destroy({
            where: {
                id: req.params.id,
            }
        });
        if (rows) {
            res.status(204).send();
        }
        else {
            res.status(404).send('dish not found');
        }
    }
    catch (e) {
        res.status(400).send('bad request');
        next(e);
    }
})

module.exports = router;
