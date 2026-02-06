require('dotenv').config({ override: true });
const app = require('./app');
const userRepository = require('./repositories/user.repository');

const PORT = process.env.PORT || 3000;

async function initializeAdminUser() {
    try {
        const adminExists = await userRepository.findAdmin();
        
        if (!adminExists) {
            
            const defaultAdmin = {
                name: 'Admin User',
                email: 'admin@library.com',
                password: 'admin@library.com',
                phoneNumber: '+91 9876543210',
                accounttype: 'ADMIN',
                created_by: null
            };
            
            await userRepository.createUser(defaultAdmin);
        } else {
            console.log('✓ ADMIN user exists.');
        }
    } catch (error) {
        console.error('Error initializing ADMIN user:', error.message);
    }
}

// Start server and initialize admin
initializeAdminUser().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
