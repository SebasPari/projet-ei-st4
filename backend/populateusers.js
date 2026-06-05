import 'dotenv/config';
import { appDataSource } from './datasource.js';
import User from './entities/user.js';

appDataSource.initialize().then(async () => {
  const userRepository = appDataSource.getRepository(User);

  // Des listes de prénoms et noms pour générer des utilisateurs
  const firstnames = [
    'Alice',
    'Jose',
    'Andres',
    'Sebastian',
    'Fares',
    'Marouane',
    'Sandra',
    'Maria',
    'Alex',
    'Lubin',
    'Clarkk',
    'Peter',
    'Tony',
    'Diana',
    'Steve',
    'Bruce',
    'Tchalla',
    'Frodo',
    'Sam',
    'Ryland',
    'Hugo',
    'Juan',
    'Diego',
    'Tatiana',
    'Cecilia',
  ];

  const lastnames = [
    'Martin',
    'Rogers',
    'Parker',
    'Pari',
    'Stark',
    'Banner',
    'Medina',
    'Baggins',
    'Michel',
    'Grace',
  ];

  for (let i = 0; i < 50; i++) {
    const firstname = firstnames[i % firstnames.length];
    const lastname = lastnames[i % lastnames.length];
    const email = `${firstname.toLowerCase()}.${lastname.toLowerCase()}${i}@email.com`;

    const newUser = userRepository.create({ firstname, lastname, email });
    await userRepository.save(newUser);
    console.log(`Créé : ${firstname} ${lastname}`);
  }

  console.log('50 utilisateurs créés !');
  process.exit(0);
});
