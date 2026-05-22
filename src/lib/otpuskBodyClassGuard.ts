/**
 * Inline script for root layout: runs before React hydrates so Otpusk `new_*`
 * body classes survive Next.js overwriting body.className (e.g. next/font).
 */
export const OTPUSK_BODY_CLASS_GUARD_INLINE = `(function(){
  function collect(){
    return Array.prototype.filter.call(document.body.classList,function(c){
      return c.indexOf("new_")===0;
    });
  }
  var preserved=[];
  function restore(){
    for(var i=0;i<preserved.length;i++){
      document.body.classList.add(preserved[i]);
    }
  }
  function sync(){
    var current=collect();
    if(current.length){preserved=current;return;}
    if(preserved.length)restore();
  }
  function start(){
    if(!document.body)return;
    sync();
    new MutationObserver(sync).observe(document.body,{
      attributes:true,
      attributeFilter:["class"]
    });
  }
  if(document.body)start();
  else document.addEventListener("DOMContentLoaded",start);
})();`;
