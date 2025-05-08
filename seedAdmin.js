import { createUser } from './src/users.js'

await createUser('admin', 'admin123', 'admin');
console.log('Admin created.');