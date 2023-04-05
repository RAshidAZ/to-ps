// Common Environment Variables
const commonVariables = {
    APP_PORT: '7000',
    MONGODB_CON_STRING: 'mongodb://localhost/cutshort-db'
}

//setting the common variables
Object.keys(commonVariables).forEach((key) => {
    process.env[key] = commonVariables[key];
})