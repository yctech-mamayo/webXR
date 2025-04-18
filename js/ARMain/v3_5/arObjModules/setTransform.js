export function setTransform( obj, position, rotation, scale ) {
    //// 20240124 nobody use, except for quiz multi option
    console.log("VRFunc.js: setTransform: obj=", obj, "\n position=", position , "\n rotation=", rotation , "\n scale=", scale); 
    let pos = position.clone(); 
    pos.multiply( new THREE.Vector3( -1, 1, 1 ) ); ////// reverse the x direction 
    obj.setAttribute( "position", pos );//// origin 

    let rot = rotation.clone(); 
    rot.multiply( new THREE.Vector3( 1 , -1 , -1 ) ); ////// reverse x y direction
    obj.setAttribute( "rotation", rot );//// origin 

    obj.setAttribute( "scale", scale );//// origin 

    // obj.setAttribute( "width" , scale.x );////// the unit ratio is 1:100
    // obj.setAttribute( "height", scale.y );

}


export function setARTransform ( obj, position, rotation, scale, quaternion  ){

    let object3D = obj.object3D;
    if ( object3D ){

        //// 位置部份：「中心平移」「子母物件判斷」
        obj.setAttribute( "position", position );//// origin 

        /////// 大小部份
        obj.setAttribute( "scale", scale );//// origin 

        let tempEuler = new THREE.Euler();
        tempEuler.setFromQuaternion(quaternion);
        tempEuler.x = -tempEuler.x;
        tempEuler.y = -tempEuler.y;
        let newQuaternion = new THREE.Quaternion();
        newQuaternion.setFromEuler(tempEuler);

        object3D.setRotationFromQuaternion(newQuaternion);

    }

}

