

module.exports.getDate = ()=>{

const today = new Date();
   //const currentDay = today.getDay();
   
   const options = {
    weekday:'long',
    day:'numeric',
    month:"long"

   }
   
   let day = today.toLocaleString('en-us',options)

   return day;

}



module.exports.getDay=()=>{

    const today = new Date();
       //const currentDay = today.getDay();
       
       const options = {
        weekday:'long',
       }
       
       let day = today.toLocaleString('en-us',options)
    
       return day;
    
    }

    
    //The reason why we can export above is because module is an object;