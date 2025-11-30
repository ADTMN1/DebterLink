

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rate from 'express-rate-limit'
import('dotenv/config')
import pool from './config/db.config.js';
import routes from './src/indexs.js'

const app = express()
const Port = process.env.PORT || 1212

app.use(helmet())
app.use(cors({origin: '*'}))  //ACCEPT ALL ORIGIN FOR NOW
app.use(express.json())


const limiter = rate({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// server.js
app.use(limiter);
app.use('api', routes);  
const main = async () => {
  try {
    const result = await pool.query('SELECT NOW()'); 
    console.log('PostgreSQL server time:', result.rows[0]);


    // await pool.end(); 
    // console.log('Database connection closed');

  } catch (err) {
    console.error('Error running queries:', err);
  }
};

main();




app.listen(Port, ()=>{
      console.log(`Server running on port ${Port}`);
})






