   

importScripts('poserppx.js');

        //console.log(Module);
        var GetPose = Module.cwrap("PoseRpp", null, ["number", "number", "number", "number"]);
        var output_pose;

    var input1 ;
    var input2 ;
    var len, bytes_per_element, input1_ptr, input2_ptr, output_ptr, output_array;
    
    self.onmessage = function (e) {

        console.log('pose worker 2');
    
 
                //input1 = new Float64Array(e.data.modeldata);
                input1 = e.data.modeldata;
               // console.log(input1);            
                Initialize(input1);
          
                //input2 =  new Float64Array(e.data.imagedata);
                input2 =  e.data.imagedata;

               // console.log('image received');
                output_pose =  GetRPPPose(input2);
               // console.log('Posting message back to main script');
                postMessage({"pose" : output_pose, "index":e.data.index, "ai":e.data.ai}); 
           
    
        //, [output_pose.buffer]
      };   

// self.onmessage = function (e) {

//     //console.log('Message received from main script');

//     switch(e.data.cmd){
//         case "model":
//             input1 = new Float64Array(e.data.modeldata);
//             console.log('Model received');            
//             Initialize(input1);
//             break;

//         case "image":
//             input2 =  new Float64Array(e.data.imagedata);
//             console.log('image received');
//             output_pose =  GetRPPPose(input2);
//             console.log('Posting message back to main script');
//             postMessage(output_pose, [output_pose.buffer]); 
//             break;

//     }
    
//   };
  
  function Initialize(input1_array){

    //console.log(Module);
              len = input1_array.length;			       
              bytes_per_element = input1_array.BYTES_PER_ELEMENT;   
               
  // alloc memory, in this case 5*4 bytes
               input1_ptr = Module._malloc(len * bytes_per_element);
               input2_ptr = Module._malloc(len * bytes_per_element);
  
               output_ptr = Module._malloc(12 * bytes_per_element);
  
  // write WASM memory calling the set method of the Int32Array, (see below for details)            
              Module.HEAPF64.set(input1_array, input1_ptr / bytes_per_element); 
              //console.log("The starting array 1 was:", input1_array);

  }

  function GetRPPPose(input2_array){

               Module.HEAPF64.set(input2_array, input2_ptr / bytes_per_element);



  // call the WASM function
             GetPose(input1_ptr, input2_ptr, output_ptr, Math.floor(len/2)); 
  
  
  // extract data to another JS array
            output_array = new Float64Array(Module.HEAPF64.buffer, output_ptr, 12); 

             // console.log("The starting array 2 was:", input2_array);
            //  console.log("The result read is:	", output_array);
              
  // dealloc memory
              Module._free(input1_ptr);
              Module._free(input2_ptr);
              Module._free(output_ptr);
  
              return output_array;
  
  }

