   

importScripts('js/cv.js');
importScripts('js/aruco.js');

let  pixels = [];
let markers;
let detector = new AR.Detector();      
    

onmessage = function (e) {

    

            console.log('ImageData  received'); 

            markers = detector.detect(e.data);
            if(markers.length > 0){        

                postMessage(true);
                                
            }

    
  };



  

