export function setTransform( obj, position, rotation, scale ) {
        
    // console.log("VRFunc.js: setTransform: obj=", obj, "\n position=", position , "\n rotation=", rotation , "\n scale=", scale); 
    let pos = position.clone(); 
    pos.multiply( new THREE.Vector3( -1, 1, 1 ) ); ////// reverse the x direction 
    obj.setAttribute( "position", pos );//// origin 

    let rot = rotation.clone(); 
    // rot.multiply( new THREE.Vector3( 1 , -1 , -1 ) ); ////// reverse x y direction
    rot.multiply( new THREE.Vector3( 1 , -1 , -1 ).multiplyScalar( 180 / Math.PI ) ); 
    
    obj.setAttribute( "rotation", rot );//// origin 

    obj.setAttribute( "scale", scale );//// origin 

    // obj.setAttribute( "width" , scale.x );////// the unit ratio is 1:100
    // obj.setAttribute( "height", scale.y );

}