const mongoose = require('mongoose');

const dbConeccion = async () => {
  console.log("Intentando conectar a MongoDB...");
  console.log("BD_CNN:", process.env.BD_CNN ? "Configurada" : "NO CONFIGURADA");
  
  try {
    await mongoose.connect(process.env.BD_CNN);
    console.log("===================================");
    console.log("Base de datos online");
  } catch (error) {
    console.log("Error de conexión a la base de datos:", error.message);
    console.log("===================================");
    throw new Error("Error de conexión a la base de datos");
  }
};

module.exports = {
  dbConeccion,
};
