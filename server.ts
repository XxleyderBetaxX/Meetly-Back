import app from './src/app';
import env from './env';
//import created routes

import courseRoutes from './src/routes/courseRoutes';

//use routes

app.use('/api/courses', courseRoutes);

app.use('/api', (req, res) =>{
    res.status(404).json({ message: 'Endpoint not found' });
});

app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});