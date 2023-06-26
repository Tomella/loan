// We aren't really giving anything away. This is on an internal private network. No public access
// Anyway, you'll want to change this for a production system to system variable substitution.

const config = {
   connection: {
      connectionLimit: 1500,
      host: process.env.LOANS_HOST,
      user: process.env.LOANS_USER, 
      password: process.env.LOANS_PASSWORD,
      database: process.env.LOANS_DATABASE
   },
   loanId: {
      ella: 1,
      tom: 2
   }

}

module.exports = config;