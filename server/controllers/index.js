// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

// get the models
const Cat = models.Cat.CatModel;
const Dog = models.Dog.DogModel;

// default fake data so that we have something to work with until we make a real Cat
const defaultCatData = {
  name: 'unknown',
  bedsOwned: 0,
};

// default fake data so that we have something to work with until we make a real Cat
const defaultDogData = {
  name: 'unknown',
  breed: 'unknown',
  age: 0,
};

// object for us to keep track of the last Cat we made and dynamically update it sometimes
let lastAddedCat = new Cat(defaultCatData);

let lastAddedDog = new Dog(defaultDogData);

// function to handle requests to the main page
// controller functions in Express receive the full HTTP request
// and a pre-filled out response object to send
const hostIndex = (req, res) => {
  // res.render takes a name of a page to render.
  // These must be in the folder you specified as views in your main app.js file
  // Additionally, you don't need .jade because you registered the
  // file type in the app.js as jade. Calling res.render('index')
  // actually calls index.jade. A second parameter of JSON can be passed
  // into the jade to be used as variables with #{varName}
  res.render('index', {
    currentName: lastAddedCat.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

// function to find all cats on request.
// Express functions always receive the request and the response.
const readAllCats = (req, res, callback) => {
  Cat.find(callback).lean();
};

// function to find all cats on request.
// Express functions always receive the request and the response.
const readAllDogs = (req, res, callback) => {
  Dog.find(callback).lean();
};


// function to find a specific cat on request.
// Express functions always receive the request and the response.
const readCat = (req, res) => {
  const name1 = req.query.name;

  // function to call when we get objects back from the database.
  // With Mongoose's find functions, you will get an err and doc(s) back
  const callback = (err, doc) => {
    if (err) {
      return res.status(500).json({ err }); // if error, return it
    }

    // return success
    return res.json(doc);
  };

  // Call the static function attached to CatModels.
  // This was defined in the Schema in the Model file.
  // This is a custom static function added to the CatModel
  // Behind the scenes this runs the findOne method.
  // You can find the findByName function in the model file.
  Cat.findByName(name1, callback);
};

// function to find a specific cat on request.
// Express functions always receive the request and the response.
const readDog = (req, res) => {
  const name1 = req.query.name;

  // function to call when we get objects back from the database.
  // With Mongoose's find functions, you will get an err and doc(s) back
  const callback = (err, doc) => {
    if (err) {
      return res.status(500).json({ err }); // if error, return it
    }

    // return success
    return res.json(doc);
  };
  Dog.findByName(name1, callback);
};

// function to handle requests to the page1 page
// controller functions in Express receive the full HTTP request
// and a pre-filled out response object to send
const hostPage1 = (req, res) => {
  // function to call when we get objects back from the database.
  // With Mongoose's find functions, you will get an err and doc(s) back
  const callback = (err, docs) => {
    if (err) {
      return res.status(500).json({ err }); // if error, return it
    }

    // return success
    return res.render('page1', { cats: docs });
  };

  readAllCats(req, res, callback);
};

// function to handle requests to the page2 page
// controller functions in Express receive the full HTTP request
// and a pre-filled out response object to send
const hostPage2 = (req, res) => {
  res.render('page2');
};

// function to handle requests to the page3 page
// controller functions in Express receive the full HTTP request
// and a pre-filled out response object to send
const hostPage3 = (req, res) => {
  res.render('page3');
};

// function to handle requests to the page3 page
// controller functions in Express receive the full HTTP request
// and a pre-filled out response object to send
const hostPage4 = (req, res) => {
  // function to call when we get objects back from the database.
  // With Mongoose's find functions, you will get an err and doc(s) back
  const callback = (err, docs) => {
    if (err) {
      return res.status(500).json({ err }); // if error, return it
    }

    // return success
    return res.render('page4', { dogs: docs });
  };

  readAllDogs(req, res, callback);
};


// function to handle get request to send the name
// controller functions in Express receive the full HTTP request
// and a pre-filled out response object to send
const getCatName = (req, res) => {
  res.json({ name: lastAddedCat.name });
};

// function to handle get request to send the name
// controller functions in Express receive the full HTTP request
// and a pre-filled out response object to send
const getDogName = (req, res) => {
  res.json({ name: lastAddedDog.name });
};

// function to handle a request to set the name
// controller functions in Express receive the full HTTP request
// and get a pre-filled out response object to send
// ADDITIONALLY, with body-parser we will get the
// body/form/POST data in the request as req.body
const setCatName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname,lastname and beds are all required' });
  }

  // if required fields are good, then set name
  const name = `${req.body.firstname} ${req.body.lastname}`;

  // dummy JSON to insert into database
  const catData = {
    name,
    bedsOwned: req.body.beds,
  };

  // create a new object of CatModel with the object to save
  const newCat = new Cat(catData);

  // create new save promise for the database
  const savePromise = newCat.save();

  savePromise.then(() => {
    lastAddedCat = newCat;
    // return success
    res.json({ name: lastAddedCat.name, beds: lastAddedCat.bedsOwned });
  });

  // if error, return it
  savePromise.catch((err) => res.status(500).json({ err }));

  return res;
};

// function to handle a request to set the name
// controller functions in Express receive the full HTTP request
// and get a pre-filled out response object to send
// ADDITIONALLY, with body-parser we will get the
// body/form/POST data in the request as req.body
const setDogName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.age || !req.body.breed) {
    return res.status(400).json({ error: 'firstname, lastname, breed, and age are all required' });
  }

  // if required fields are good, then set name
  const name = `${req.body.firstname} ${req.body.lastname}`;

  // dummy JSON to insert into database
  const dogData = {
    name,
    breed: req.body.breed,
    age: req.body.age,
  };

  // create a new object of CatModel with the object to save
  const newDog = new Dog(dogData);

  // create new save promise for the database
  const savePromise = newDog.save();

  savePromise.then(() => {
    lastAddedDog = newDog;
    // return success
    res.json({ name: lastAddedDog.name, breed: lastAddedDog.breed, age: lastAddedDog.age });
  });

  // if error, return it
  savePromise.catch((err) => res.status(500).json({ err }));

  return res;
};


// function to handle requests search for a name and return the object
// controller functions in Express receive the full HTTP request
// and a pre-filled out response object to send
const searchCatName = (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  return Cat.findByName(req.query.name, (err, doc) => {
    // errs, handle them
    if (err) {
      return res.status(500).json({ err }); // if error, return it
    }

    // if no matches, let them know
    // (does not necessarily have to be an error since technically it worked correctly)
    if (!doc) {
      return res.json({ error: 'No cats found' });
    }

    // if a match, send the match back
    return res.json({ name: doc.name, beds: doc.bedsOwned });
  });
};


// function to handle requests search for a name and return the object
// controller functions in Express receive the full HTTP request
// and a pre-filled out response object to send
const searchDogName = (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }
  return Dog.findByName(req.query.name, (err, doc) => {
    // errs, handle them
    if (err) {
      return res.status(500).json({ err }); // if error, return it
    }

    // if no matches, let them know
    // (does not necessarily have to be an error since technically it worked correctly)
    if (!doc) {
      return res.json({ error: 'No dogs found' });
    }

    const dog = doc;
    dog.age++;

    const savePromise = dog.save();

    // send back the name as a success for now
    savePromise.then(() => res.json({ name: dog.name, breed: dog.breed, age: dog.age }));

    // if save error, just return an error for now
    savePromise.catch((err) => res.status(500).json({ err }));

    // if a match, send the match back
    return res.json({ name: dog.name, breed: dog.breed, age: dog.age });
  });
};

// function to handle a request to update the last added object
// this PURELY exists to show you how to update a model object
// Normally for an update, you'd get data from the client,
// search for an object, update the object and put it back
// We will skip straight to updating an object
// (that we stored as last added) and putting it back
const updateLastCat = (req, res) => {
  lastAddedCat.bedsOwned++;

  const savePromise = lastAddedCat.save();

  // send back the name as a success for now
  savePromise.then(() => res.json({ name: lastAddedCat.name, beds: lastAddedCat.bedsOwned }));

  // if save error, just return an error for now
  savePromise.catch((err) => res.status(500).json({ err }));
};

// function to handle a request to any non-real resources (404)
// controller functions in Express receive the full HTTP request
// and get a pre-filled out response object to send
const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

// export the relevant public controller functions
module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  readCat,
  getCatName,
  setCatName,
  updateLastCat,
  searchCatName,
  readDog,
  getDogName,
  setDogName,
  searchDogName,
  notFound,
};
