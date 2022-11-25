const mongoose = require('mongoose');


const connectdb = async ()=>{

    try {
        await mongoose.connect("mongodb://localhost:27017/imagesss",
       {
         useNewUrlParser:true,
        }
        );
        // 
        // app.listen(PORT, console.log(`mongodb connection Server is running on port ${PORT}`));
        console.log("mongo connection successfull...")
    } catch (err){
        console.log(err);
    }
};
connectdb();