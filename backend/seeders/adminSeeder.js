const User = require('../models/User');

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: 'admin@autolms.com' });

        if (!adminExists) {
            await User.create({
                name: 'AutoLMS Admin',
                email: 'admin@autolms.com',
                password: 'Admin1234',
                role: 'admin',
                adminLevel: 5,
                permissions: ['full_access']
            });
            console.log('Admin user seeded properly: admin@autolms.com / Admin1234');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error(`Error seeding admin: ${error.message}`);
    }
};

module.exports = seedAdmin;
