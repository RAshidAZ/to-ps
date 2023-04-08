// Common Environment Variables
const commonVariables = {
    APP_PORT: '7000',
    MONGODB_CON_STRING: 'mongodb://localhost/cutshort-db',
    PASS_SALT_STATIC: 'CUT#dSDFeFenyL2jaSDasdaeFenyL2jas@766sar7^^#&W^FSBGg7dBG7q3FSQ#SHORT',
    pageLimit: 10
}

//setting the common variables
Object.keys(commonVariables).forEach((key) => {
    process.env[key] = commonVariables[key];
})