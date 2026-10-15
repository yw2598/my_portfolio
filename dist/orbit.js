(function(root){
  'use strict';
  function position(width,height,labelWidth,labelHeight,index,seconds){
    const angle=-Math.PI/2+index*Math.PI/2+seconds*Math.PI*2/54;
    const rx=Math.max(0,Math.min((width-labelWidth)/2-4,width*.30));
    const ry=Math.max(0,Math.min((height-labelHeight)/2-8,height*.37));
    // A compact, gently changing path that crosses the portrait's edges.
    // Text stays upright; the movement is independent of the photo.
    return {x:width/2+Math.cos(angle)*rx,
      y:height/2+Math.sin(angle)*ry+Math.sin(angle*3)*height*.008};
  }
  root.PortraitOrbit={position};
  if(typeof module!=='undefined')module.exports={position};
})(typeof window!=='undefined'?window:globalThis);
