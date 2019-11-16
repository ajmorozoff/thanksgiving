// tests for /api/dishes

// supertest is a module that allows us to test our express server
const request = require('supertest');
const { app } = require('../server/app.js');
const { db, Dish, Person } = require('../db/index.js');

beforeEach(async done => {
  // wipe the db before each test block
  await db.sync({ force: true });
  done();
});
afterAll(async done => {
  // close the db connection upon completion of all tests
  await db.close();
  done();
});
describe('/api/dishes routes', () => {
  const person1 = { name: 'mark', isAttending: true };
  const person2 = { name: 'russell', isAttending: false };
  const person3 = { name: 'ryan', isAttending: true };

  const dish1 = { name: 'turkey', description: 'delicious briney turkey' };
  const dish2 = { name: 'pie', description: 'delicious pumpkiney pie' };

  describe('GET to /api/dishes', () => {
    it('returns all dishes', async () => {
      try {
        //seed the DB
        const [turk, pie] = await Promise.all([
          Dish.create({ ...dish1, personId: null }),
          Dish.create({ ...dish2, personId: null }),
        ]);

        const getResponse = await request(app).get('/api/dishes');

        //response format
        expect(getResponse.statusCode).toBe(200);
        expect(getResponse.headers['content-type']).toEqual(
          expect.stringContaining('json')
        );

        //test response content
        const dishes = getResponse.body;
        expect(dishes.length).toBe(2);

        expect(dishes).toEqual(
          expect.arrayContaining([
            expect.objectContaining(dish1),
            expect.objectContaining(dish2),
          ])
        );


      }
      catch (e) {
        fail(e);
      }
    });
  });

  describe('GET to /api/dishes/:id', () => {
    it('returns a single dish by id', async() => {
      try {
        const [turk, pie] = await Promise.all([
          Dish.create({ ...dish1, personId: null }),
          Dish.create({ ...dish2, personId: null }),
        ]);

        const getIdResponse = await request(app).get(`/api/dishes/${turk.id}`);

        //response format
        expect(getIdResponse.statusCode).toBe(200);
        expect(getIdResponse.headers['content-type']).toEqual(
          expect.stringContaining('json')
        );

        //test response content
        const dishById = getIdResponse.body;
        expect(dishById.length).toBe(1);
        expect(dishById).toEqual([expect.objectContaining(dish1)]);

      }
      catch (e) {
        fail(e);
      }

    });

    it('returns correct failure codes', async () => {
      try {
        const failResponse = await request(app).get(`/api/dishes/derpderp`);
        expect(failResponse.statusCode).toBe(400);
      }
      catch (e) {
        fail(e);
      }
    });
  });

  describe('POST to /api/dishes/', () => {
    it('creates a new dish and returns it', async () => {
      try {
        const dish3 = { name: 'stuffing', description: 'carby goodness' };
        const postResponse = await request(app).post('/api/dishes/').send(dish3);
  
        //test API Response
        expect(postResponse.statusCode).toBe(201);
        expect(postResponse.headers['content-type']).toEqual(
            expect.stringContaining('json')
            );
        const newDish = postResponse.body;
        expect(newDish).toEqual(expect.objectContaining(dish3));
  
        //Test DB contents
        const newDBDish = await Dish.findAll({
          where: {
            name: dish3.name,
          }
        });
        expect(newDBDish).toEqual([expect.objectContaining(dish3)]);
      }
      catch (e) {
        fail(e);
      }
    });

    it('returns correct failure codes', async () => {
      try {
        const failDish = { value: 'stuffing', color: 'carby goodness' };
        const failResponse = await request(app).post('/api/dishes/').send(failDish);
        expect(failResponse.statusCode).toBe(400);
      }
      catch (e) {
        fail(e);
      }
    });

  });

  describe('PUT to /api/dishes/:id', () => {
    it('updates an existing dish and returns the updated dish', async () => {
      try {
        const turk = await Dish.create(dish1);
        const russell = await Person.create(person2);
        const putResponse = await request(app).put(`/api/dishes/${turk.id}`).send({ name: 'turkay', description: 'big ol bird', personId: russell.id });

        expect(putResponse.statusCode).toBe(200);
        expect(putResponse.headers['content-type']).toEqual(
          expect.stringContaining('json')
          );
        const updatedDish = putResponse.body[0];
        expect(updatedDish.name).toEqual('turkay');
        expect(updatedDish.description).toEqual('big ol bird');
        expect(updatedDish.personId).toEqual(russell.id);

        //test DB
        const updatedDbDish = (await Dish.findAll({
          where: {
            id: turk.id,
          }
        }))[0].dataValues;
        expect(updatedDbDish.name).toEqual('turkay');
        expect(updatedDbDish.description).toEqual('big ol bird');
        expect(updatedDbDish.personId).toEqual(russell.id);
      }
      catch (e) {
        fail(e);
      }
    });

    it('returns correct failure codes', async () => {
      try {
        const noItemResponse = await request(app).put(`/api/dishes/100`).send({ name: 'turkay', description: 'big ol bird' });
        expect(noItemResponse.statusCode).toBe(400);
      }
      catch (e) {
        fail(e);
      }
    });

  });

  describe('DELETE to /api/dishes/:id', () => {
    it('deletes a dish', async () => {
      try {
        const dish3 = { name: 'stuffing', description: 'pieces of baked bread' };
        const stuffing = await Dish.create(dish3);

        //test API response
        const deleteResponse = await request(app).delete(`/api/dishes/${stuffing.id}`);
        expect(deleteResponse.statusCode).toBe(204);

        //test DB
        let deletedDbDish = (await Dish.findAll());
        expect(deletedDbDish).not.toEqual(expect.objectContaining(dish3));

      }
      catch (e) {
        fail(e);
      }
    });

    it('returns correct failure codes', async () => {
      try {
        const noItemResponse = await request(app).delete(`/api/dishes/100`);
        expect(noItemResponse.statusCode).toBe(404);

        const badReqResponse = await request(app).delete(`/api/dishes/derpderp`);
        expect(badReqResponse.statusCode).toBe(400);
      }
      catch (e) {
        fail(e);
      }
    })

  });
});
