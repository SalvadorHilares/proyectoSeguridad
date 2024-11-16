require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const sequelize = new Sequelize(
  `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/seguridad`,
  {
    logging: false, // set to console.log to see the raw SQL queries
    native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  }
);
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Group, User, Notification, Message } = sequelize.models;
// Aca vendrian las relaciones

// Un User puede pertenecer a muchos grupos y un grupo puede tener muchos usuarios

User.belongsToMany(Group, { through: "user_group" });
Group.belongsToMany(User, { through: "user_group" });

// Una notificación pertenece a un usuario y un usuario puede tener muchas notificaciones

Notification.belongsTo(User);
User.hasMany(Notification);

// Una notificación pertenece a un admin y un admin puede tener muchas notificaciones

Notification.belongsTo(User, { foreignKey: 'adminId', as: 'admin' });
User.hasMany(Notification, { foreignKey: 'adminId' });

// Un mensaje pertenece a un usuario y un usuario puede tener muchos mensajes

Message.belongsTo(User, {foreignKey: 'senderId', as: 'sender'});
User.hasMany(Message, {foreignKey: 'senderId'});

Message.belongsTo(User, {foreignKey: 'receiverId', as: 'receiver'});
User.hasMany(Message, {foreignKey: 'receiverId'});

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};