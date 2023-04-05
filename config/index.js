// Common Environment Variables
const commonVariables = {
    
    
}

//setting the common variables
Object.keys(commonVariables).forEach((key) => {
    process.env[key] = commonVariables[key];
})