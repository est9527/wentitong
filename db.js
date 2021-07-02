const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/wttmain', {
    user:"wttadmin", 
    pass:"wttadmin888", 
    authSource:"admin", 
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () =>{
    console.log("connect is ok");
})
mongoose.connection.on('error', () =>{
    console.log("错误："+error);
})



