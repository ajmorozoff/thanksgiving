const { app } = require('./app');
const PORT = 3000;
const { db, Person, Dish } = require('../db');
const person1 = { name: 'mark', isAttending: true };
const person2 = { name: 'russell', isAttending: false };
const person3 = { name: 'ryan', isAttending: true };

const dish1 = { name: 'turkey', description: 'delicious briney turkey' };
const dish2 = { name: 'pie', description: 'delicious pumpkiney pie' };

async function syncAndSeedDatabase() {
  try {
    await db.sync({ force: true });

    //seeding
    const [mark, russell, ryan] = await Promise.all([
      Person.create(person1),
      Person.create(person2),
      Person.create(person3),
    ]);

    const [turk, pie] = await Promise.all([
      Dish.create({ ...dish1, personId: mark.id }),
      Dish.create({ ...dish2, personId: ryan.id }),
    ]);

  } catch (e) {
    console.log(e);
  }

  console.log('done seeding and associating!');
}

syncAndSeedDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
});
