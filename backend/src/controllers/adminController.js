const { pool } = require('./config/db')

const adminSchema = new pool.Schema({
    username:{type: String, required: true},
    password:{type: String, required: true},
    firstName:{type: String, required: true},
    lastName:{type: String, required: true},
    
})

export default pool.model('admin', adminSchema)