import app from './src/app';
import env from './env';

//import created routes
import courseRoutes from './src/routes/courseRoutes';
import authRoutes from './src/routes/authRoutes';
import appointmentRoutes from './src/routes/appointmentRoutes';
import enrollmentRoutes from './src/routes/enrollmentRoutes';
import chatRoutes from './src/routes/chatRoutes';
import supportRoutes from './src/routes/supportRoutes';
import userRoutes from './src/routes/userRoutes';
import notificationRoutes from './src/routes/notificationRoutes';


//use routes
app.use('/api/auth', authRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/notifications', notificationRoutes);


app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});
app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});