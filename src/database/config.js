const mongoose = require('mongoose');

const dbConeccion = async () => {
  try {
    await mongoose.connect(process.env.BD_CNN);
    console.log("===================================");
    console.log("Conectando a la base de datos...");
    console.log("Base de datos online");
  } catch (error) {
    console.log("Error de conexión a la base de datos:", error);
    console.log("===================================");
    throw new Error("Error de conexión a la base de datos");
  }
};

module.exports = {
  dbConeccion,
};
