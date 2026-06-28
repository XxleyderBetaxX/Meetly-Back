import app from './src/app';
import env from './env';

//import created routes
import courseRoutes from './src/routes/courseRoutes';
import authRoutes from './src/routes/authRoutes';
import appointmentRoutes from './src/routes/appointmentRoutes';
import enrollmentRoutes from './src/routes/enrollmentRoutes';

//use routes
app.use('/api/auth', authRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/appointments', appointmentRoutes);


app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
});
app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});