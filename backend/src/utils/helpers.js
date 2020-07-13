exports.generateOneTimeToken = () => { 

     // Declare a numeric string variable which stores all numbers
     var number  = '0123456789'; 
     var len     = number.length; 
     let oneTimeToken = ''; 
 
     for (let i = 0; i < 6; i++ ) { 
         oneTimeToken += number[Math.floor(Math.random() * len)]; 
     } 
     return oneTimeToken;
 }
 