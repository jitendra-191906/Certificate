const mongoose = require('mongoose');
require('dotenv').config();

async function fixSerialIndex() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/letter-generator');
    
    console.log('Connected to MongoDB');
    
    // Get the collection
    const db = mongoose.connection.db;
    const collection = db.collection('letterhistories');
    
    // Drop the existing unique index on serialNumber
    try {
      await collection.dropIndex('serialNumber_1');
      console.log('Successfully dropped serialNumber_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('Index serialNumber_1 does not exist, continuing...');
      } else {
        console.log('Error dropping index:', error.message);
      }
    }
    
    // Create a new non-unique index on serialNumber
    await collection.createIndex({ serialNumber: 1 }, { 
      name: 'serialNumber_1',
      sparse: true 
    });
    
    console.log('Successfully created new sparse index on serialNumber');
    
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error fixing serial index:', error);
    process.exit(1);
  }
}

fixSerialIndex();
