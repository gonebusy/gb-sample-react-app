export default class Utils {

	static getFullOffset(element){
	  var offset = {
	    top: element.offsetTop,
	    left: element.offsetLeft,
	  }
	  
	  if(element.offsetParent){
	    var po = this.getFullOffset(element.offsetParent);
	    offset.top += po.top;
	    offset.left += po.left;
	    return offset;
	  }
	  else
	    return offset;
	}
}