const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const express = require('express');
const cors = require('cors');
require("dotenv").config();

const routes = require('./routes/index');
const User = require('./models/User');
const Role = require('./models/Role');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({
    limit: "10mb"
}));
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.get('/', (_req, res) => {
    res.json({ message: 'Role-Based Authentication API is running.' });
});

const initalizeRoles = async () => {
    try {
        const roleCount = await Role.countDocuments();

        if (roleCount === 0) {
            const defaultRoles = [
                {
                    name: 'Admin',
                    permissions: ['create', 'read', 'update', 'delete', 'manage_users', 'manage_roles'],
                    description: 'Full system access with user and role management capabilities'
                },
                {
                    name: 'Editor',
                    permissions: ['create', 'read', 'update'],
                    description: 'Can create, view, and edit content but cannot delete or manage users'
                },
                {
                    name: 'Viewer',
                    permissions: ['read'],
                    description: 'Read-only access to view content'
                }
            ];

            await Role.insertMany(defaultRoles);
            console.log('Default roles created successfully.');
        }
    } catch (error) {
        console.error('Error initializing roles:', error);
    }
};

const createDefaultUsers = async () => {
    const usersToCreate = [
        { fullName: 'Admin User', email: 'admin@example.com', password: 'admin123', roleName: 'Admin' },
        { fullName: 'Editor User', email: 'editor@example.com', password: 'editor123', roleName: 'Editor' },
        { fullName: 'Viewer User', email: 'viewer@example.com', password: 'viewer123', roleName: 'Viewer' }
    ];

    for (const user of usersToCreate) {
        const exists = await User.findOne({ email: user.email });
        if (!exists) {
            const role = await Role.findOne({ name: user.roleName });
            const hashedPassword = await bcrypt.hash(user.password, 12);
            await User.create({
                fullName: user.fullName,
                email: user.email,
                password: hashedPassword,
                role: role._id
            });
            console.log(`Created: ${user.email} (${user.roleName}) | password: ${user.password}`);
        }
    }
};

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('MongoDB connected successfully');
    await initalizeRoles();
    await createDefaultUsers();
    app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error('Database connection failed', error);
});
