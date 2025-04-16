Logic.prototype.parse_transform_block = function(block, cb){
    let self = this
    let blockType = block.getAttribute("type");
    let result = new Object();
    
    switch(blockType){

        // transition
        case "transform_move_in_second":
            result.tl  = self.transform_move_in_second(block);
            break;

        case "transform_move_target_in_second":
            result.tl = self.transform_move_target_in_second(block);
            break;

        case "transform_rotate_in_second":
            result.tl = self.transform_rotate_in_second(block);
            break;

        case "transform_rotate_with_radius_in_second":
            result.tl = self.transform_rotate_with_radius_in_second(block);
            break;

        case "transform_rotate_with_radius_in_second_forever":
            result.tl = self.transform_rotate_with_radius_in_second_forever(block);
            break;

        case "transform_rotate_with_axis_in_second":
            result.tl = self.transform_rotate_with_axis_in_second(block);
            break;

        case "transform_rotate_from_origin_with_axis_in_second":
            result.tl = self.transform_rotate_from_origin_with_axis_in_second(block);
            break;

        case "transform_scale_by_in_second":
            result.tl = self.transform_scale_by_in_second(block);
            break;

        // position
        case "transform_set_position":
            result.tl = self.transform_set_position(block);
            break;

        case "transform_get_position":
            result.data = self.transform_get_position(block);
            break;

        case "transform_get_distance":
            result.data = self.transform_get_distance(block);
            break;

        //rotation
        case "transform_set_rotation":
            result.tl = self.transform_set_rotation(block);
            break;

        case "transform_to_look_at_gameobject":
            result.tl = self.transform_to_look_at_gameobject(block);
            break;
        
        case "transform_to_look_at":
            result.tl = self.transform_to_look_at(block);
            break;

        case "transform_get_rotation":
            result.data = self.transform_get_rotation(block);
            break;

        case "transform_get_rotation_in_space":
            result.data = self.transform_get_rotation_in_space(block);
            break;

        //scale
        case "transform_get_scale":
            result.data = self.transform_get_scale(block);
            break;

        case "transform_get_scale_in_space":
            result.data = self.transform_get_scale_in_space(block);
            break;

        case "transform_get_scale_axis_in_space":
            result.data = self.transform_get_scale_axis_in_space(block);
            break;

        case "transform_set_scale":
            result.tl = self.transform_set_scale(block);
            break;

        case "transform_set_scale_by_axis":
            result.tl = self.transform_set_scale_by_axis(block);
            break;
            
    }
    if(block.children[block.children.length-1].tagName == "next"){
        if(result.tl){
            result.tl.eventCallback("onComplete", function(){
                self.parseBlock(block.children[block.children.length-1].children[0], cb);
            });
        }
        else{
            self.parseBlock(block.children[block.children.length-1].children[0], cb);
        }
        
    }
    else{
        if(cb){
            if(result.tl){
                result.tl.eventCallback("onComplete", function(){
                    cb();
                });
            }
            else{
                cb();
            }
        }
    }

    return result;
}

Logic.prototype.transform_move_in_second = function(block){
    let self = this;
   
    let dir = this.getContentByFieldName(block, "DIRECTION");
    if (dir == null) return;

    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let  meterBlock = this.getBlockByValueName(block, "METER");
    if(meterBlock == null) return;
    let meter = this.parseBlock(meterBlock).data;
    if (meter == null || meter.type != "NUM") return;

    let  secondBlock = this.getBlockByValueName(block, "SECOND");
    if(secondBlock == null) return;
    let second = this.parseBlock(secondBlock).data;
    if (second == null || second.type != "NUM") return;


    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    let currentPos = target.object3D.position.clone();
    let moveDir = new THREE.Vector3();

    switch (dir) {

        case "FORWARD":
            moveDir.set(0, 0, 1);
            break;
        case "BACKWARD":
            moveDir.set(0, 0, -1);
            break;
        case "RIGHT":
            moveDir.set(-1, 0, 0);
            break;
        case "LEFT":
            moveDir.set(1, 0, 0);
            break;
        case "UP":
            moveDir.set(0, 1, 0);
            break;
        case "DOWN":
            moveDir.set(0, -1, 0);
            break;

    }
    moveDir = moveDir.applyEuler(target.object3D.rotation);
    moveDir.multiplyScalar(meter.value);
    currentPos.add(moveDir);

    let tl = gsap.timeline();
    
    self.timelineDict[ block.id ] = tl ;

    tl.to(target.object3D.position, {
        duration: second.value,
        delay: 0, 
        ease: 'none',
        x : currentPos.x,
        y : currentPos.y,
        z : currentPos.z
    });

    return tl;

}

Logic.prototype.transform_move_target_in_second = function(block){
    let self = this;

    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let  posBlock = this.getBlockByValueName(block, "POSITION");
    if(posBlock == null) return;
    let pos = this.parseBlock(posBlock).data;
    if (pos == null || pos.type != "VEC3") return;

    let  secondBlock = this.getBlockByValueName(block, "SECOND");
    if(secondBlock == null) return;
    let second = this.parseBlock(secondBlock).data;
    if (second == null || second.type != "NUM") return;


    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    pos.value.multiply( new THREE.Vector3( -1, 1, 1 ) );

    let tl = gsap.timeline();

    self.timelineDict[ block.id ] = tl ;

    tl.to(target.object3D.position, {
        duration: second.value,
        delay: 0, 
        ease: 'none',
        x : pos.value.x,
        y : pos.value.y,
        z : pos.value.z
    });

    return tl;

}

Logic.prototype.transform_rotate_in_second = function(block){
    let self = this;

    let dir = this.getContentByFieldName(block, "DIRECTION");
    if (dir == null) return;

    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let  degreeBlock = this.getBlockByValueName(block, "DEGREE");
    if(degreeBlock == null) return;
    let degree = this.parseBlock(degreeBlock).data;
    if (degree == null || degree.type != "DEGREE") return;

    let  secondBlock = this.getBlockByValueName(block, "SECOND");
    if(secondBlock == null) return;
    let second = this.parseBlock(secondBlock).data;
    if (second == null || second.type != "NUM") return;


    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    let currentRot = target.object3D.rotation.clone();

    switch (dir) {

        case "CLOCKWISE":
            currentRot.y -= Math.PI * degree.value/ 180 ;
            break;
        case "COUNTERCLOCKWISE":
            currentRot.y += Math.PI * degree.value/ 180;
            break;

    }

    let tl = gsap.timeline();

    self.timelineDict[ block.id ] = tl ;

    tl.to(target.object3D.rotation, {
        duration: second.value,
        delay: 0, 
        ease: 'none',
        y : currentRot.y,
    });

    return tl;

}

Logic.prototype.rotateAboutPoint = function (obj, point, axis, theta, pointIsWorld){
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

    if(pointIsWorld){
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if(pointIsWorld){
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    // obj.rotateOnAxis(axis, theta); // rotate the OBJECT
    obj.rotateOnWorldAxis(axis, theta); // rotate the OBJECT
}

Logic.prototype.transform_rotate_with_radius_in_second = function(block){
    
    let self = this;

    let dir = this.getContentByFieldName(block, "DIRECTION");
    if (dir == null) return;

    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let  degreeBlock = this.getBlockByValueName(block, "DEGREE");
    if(degreeBlock == null) return;
    let degree = this.parseBlock(degreeBlock).data;
    if (degree == null || degree.type != "DEGREE") return;

    let  radiusBlock = this.getBlockByValueName(block, "RADIUS");
    if(radiusBlock == null) return;
    let radius = this.parseBlock(radiusBlock).data;
    if (radius == null || radius.type != "NUM") return;
    if (radius.value < 0) radius.value = 0;

    let  secondBlock = this.getBlockByValueName(block, "SECOND");
    if(secondBlock == null) return;
    let second = this.parseBlock(secondBlock).data;
    if (second == null || second.type != "NUM") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    let forwardVec = new THREE.Vector3(0,0,1).applyEuler(target.object3D.rotation);
    let upVec = target.object3D.up.clone().applyEuler(target.object3D.rotation);
    let center = target.object3D.position.clone().add(forwardVec.multiplyScalar(radius.value));

    switch (dir) {

        case "CLOCKWISE":
            degree.value = -degree.value
            break;

        case "COUNTERCLOCKWISE":
            degree.value = degree.value
            break;

    }

    let tl = gsap.timeline();

    self.timelineDict[ block.id ] = tl ;

    let thetaRecord = 0;

    target.object3D.roundTheta = 0
    tl.to(target.object3D, {
        duration: second.value,
        delay : 0,
        ease: 'none',
        roundTheta: degree.value,
        onUpdate: function(){

            self.rotateAboutPoint(target.object3D, center, upVec, (target.object3D.roundTheta-thetaRecord)/180 * Math.PI);  
            thetaRecord = target.object3D.roundTheta;
        }

    })

    return tl;


}

Logic.prototype.transform_rotate_with_radius_in_second_forever = function(block){

    let self = this;

    let dir = this.getContentByFieldName(block, "DIRECTION");
    if (dir == null) return;

    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let  radiusBlock = this.getBlockByValueName(block, "RADIUS");
    if(radiusBlock == null) return;
    let radius = this.parseBlock(radiusBlock).data;
    if (radius == null || radius.type != "NUM") return;
    if (radius.value < 0) radius.value = 0;

    let  secondBlock = this.getBlockByValueName(block, "SECOND");
    if(secondBlock == null) return;
    let second = this.parseBlock(secondBlock).data;
    if (second == null || second.type != "NUM") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    let forwardVec = new THREE.Vector3(0,0,1).applyEuler(target.object3D.rotation);
    let upVec = target.object3D.up.clone().applyEuler(target.object3D.rotation);
    let center = target.object3D.position.clone().add(forwardVec.multiplyScalar(radius.value));

    let degree; 
    switch (dir) {

        case "CLOCKWISE":
            degree = -360;
            break;

        case "COUNTERCLOCKWISE":
            degree = 360;
            break;

    }

    let tl = gsap.timeline();

    self.timelineDict[ block.id ] = tl ;

    let thetaRecord = 0;

    target.object3D.loopTheta = 0
    tl.to(target.object3D, {
        repeat: -1,
        duration: second.value,
        delay : 0,
        ease: 'none',
        loopTheta: degree,
        onUpdate: function(){

            self.rotateAboutPoint(target.object3D, center, upVec, (target.object3D.loopTheta-thetaRecord)/180 * Math.PI);  
            thetaRecord = target.object3D.loopTheta;
            
        }

    })

    return tl;

}

Logic.prototype.transform_rotate_with_axis_in_second = function(block){

    let self = this;

    let dir = this.getContentByFieldName(block, "DIRECTION");
    if (dir == null) return;

    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let  axisBlock = this.getBlockByValueName(block, "ROTATION");
    if(axisBlock == null) return;
    let axis = this.parseBlock(axisBlock).data;
    if (axis == null || axis.type != "VEC3") return;

    let  degreeBlock = this.getBlockByValueName(block, "DEGREE");
    if(degreeBlock == null) return;
    let degree = this.parseBlock(degreeBlock).data;
    if (degree == null || degree.type != "DEGREE") return;

    let  secondBlock = this.getBlockByValueName(block, "SECOND");
    if(secondBlock == null) return;
    let second = this.parseBlock(secondBlock).data;
    if (second == null || second.type != "NUM") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    axis.value.x = -axis.value.x;
    axis.value.normalize();

    switch (dir) {

        case "CLOCKWISE":
            degree.value = -degree.value
            break;

        case "COUNTERCLOCKWISE":
            degree.value = degree.value;
            break;

    }

    let tl = gsap.timeline();

    self.timelineDict[ block.id ] = tl ;

    let thetaRecord = 0;

    target.object3D.axisTheta = 0
    tl.to(target.object3D, {
        duration: second.value,
        delay : 0,
        ease: 'none',
        axisTheta: degree.value,
        onUpdate: function(){

            target.object3D.rotateOnAxis(axis.value, (target.object3D.axisTheta-thetaRecord)/180 * Math.PI);  
            thetaRecord = target.object3D.axisTheta;

        },

    });
    

    return tl;

}

Logic.prototype.transform_rotate_from_origin_with_axis_in_second = function(block){

    let self = this;

    let dir = this.getContentByFieldName(block, "DIRECTION");
    if (dir == null) return;

    let originSpace = this.getContentByFieldName(block, "ORIGIN_SPACE");
    if (originSpace == null) return;

    let axisSpace = this.getContentByFieldName(block, "AXIS_SPACE");
    if (axisSpace == null) return;

    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let  originBlock = this.getBlockByValueName(block, "ORIGIN");
    if(originBlock == null) return;
    let origin = this.parseBlock(originBlock).data;
    if (origin == null || origin.type != "VEC3") return;

    origin.value.multiply( new THREE.Vector3( -1, 1, 1 ) );

    let  axisBlock = this.getBlockByValueName(block, "AXIS");
    if(axisBlock == null) return;
    let axis = this.parseBlock(axisBlock).data;
    if (axis == null || axis.type != "VEC3") return;

    axis.value.multiply( new THREE.Vector3( -1, 1, 1 ) );
    axis.value.normalize();

    let  degreeBlock = this.getBlockByValueName(block, "DEGREE");
    if(degreeBlock == null) return;
    let degree = this.parseBlock(degreeBlock).data;
    if (degree == null || degree.type != "DEGREE") return;

    let  secondBlock = this.getBlockByValueName(block, "SECOND");
    if(secondBlock == null) return;
    let second = this.parseBlock(secondBlock).data;
    if (second == null || second.type != "NUM") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    switch (dir) {

        case "CLOCKWISE":
            degree.value = -degree.value
            break;

        case "COUNTERCLOCKWISE":
            degree.value = degree.value
            break;

    }

    switch (originSpace) {

        case "SPACE_LOCAL":
            origin.value = origin.value.applyMatrix4(target.object3D.matrix);
            break;

        case "SPACE_GLOBAL":
            origin.value = target.object3D.worldToLocal(origin.value).applyMatrix4(target.object3D.matrix);
            break;
    }

    switch (axisSpace) {

        case "SPACE_LOCAL":
            axis.value = axis.value.applyEuler(target.object3D.rotation);
            break;

        case "SPACE_GLOBAL":
            // console.log(target.object3D)
            if(target.parentEl.localName == "a-entity"){
                console.log("has parent");
                let q = new THREE.Quaternion();
                target.parentEl.object3D.getWorldQuaternion(q);
                let e  = new THREE.Euler();
                e.setFromQuaternion(q, "YXZ");
                console.log("world eular", e)
                e.x = -e.x;
                e.y = -e.y;
                e.z = -e.z;
                axis.value = axis.value.applyEuler(e);
                // axis.value = axis.value.applyQuaternion(q);
                console.log(axis.value)
            }
 
            break;
    }

    let tl = gsap.timeline();

    self.timelineDict[ block.id ] = tl ;

    let thetaRecord = 0;

    target.object3D.Theta = 0
    tl.to(target.object3D, {
        duration: second.value,
        delay : 0,
        ease: 'none',
        Theta: degree.value,
        onUpdate: function(){

            self.rotateAboutPoint(target.object3D, origin.value, axis.value, (target.object3D.Theta-thetaRecord)/180 * Math.PI);
            thetaRecord = target.object3D.Theta;
        }

    })

    return tl;





}

Logic.prototype.transform_scale_by_in_second = function(block){
    let self = this;

    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let  scaleBlock = this.getBlockByValueName(block, "SCALE");
    if(scaleBlock == null) return;
    let scale = this.parseBlock(scaleBlock).data;
    if (scale == null || scale.type != "NUM") return;

    let  secondBlock = this.getBlockByValueName(block, "SECOND");
    if(secondBlock == null) return;
    let second = this.parseBlock(secondBlock).data;
    if (second == null || second.type != "NUM") return;


    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    let currentScale = target.object3D.scale.clone();

    currentScale.multiplyScalar(scale.value);

    let tl = gsap.timeline();

    self.timelineDict[ block.id ] = tl ;

    tl.to(target.object3D.scale, {
        duration: second.value,
        delay: 0, 
        ease: 'none',
        x : currentScale.x,
        y : currentScale.y,
        z : currentScale.z,
    });

    return tl;
}

Logic.prototype.transform_set_position = function(block){
    let self = this;

    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let  posBlock = this.getBlockByValueName(block, "POSITION");
    if(posBlock == null) return;
    let pos = this.parseBlock(posBlock).data;
    if (pos == null || pos.type != "VEC3") return;


    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    pos.value.multiply( new THREE.Vector3( -1, 1, 1 ) );

    // target.object3D.position = pos.value;

    let tl = gsap.timeline();

    self.timelineDict[ block.id ] = tl ;

    tl.to(target.object3D.position, {
        duration: 0.01,
        delay: 0, 
        ease: 'none',
        x : pos.value.x,
        y : pos.value.y,
        z : pos.value.z
    });

    return tl;
    // console.log(target.object3D.position)

}

Logic.prototype.transform_get_position = function(block){
    let self = this;

    let space = this.getContentByFieldName(block, "SPACE");
    if (space == null) return;

    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    let newData = new Object();
    newData.type = "VEC3";

    switch(space){

        case "SPACE_GLOBAL":
            newData.value = target.object3D.getWorldPosition().clone(); 
            break;

        case "SPACE_LOCAL":
            newData.value =  target.object3D.position.clone();
            break;

    }
    newData.value.x = -newData.value.x;
    
    return newData;
}

Logic.prototype.transform_get_distance = function(block){
    let self = this;

    let  objBlock1 = this.getBlockByValueName(block, "GAME_OBJECT_A");
    if(objBlock1 == null) return;
    let obj_id1 = this.parseBlock(objBlock1).data;
    if (obj_id1 == null || obj_id1.type != "TEXT") return;

    let  objBlock2 = this.getBlockByValueName(block, "GAME_OBJECT_B");
    if(objBlock2 == null) return;
    let obj_id2 = this.parseBlock(objBlock2).data;
    if (obj_id2 == null || obj_id2.type != "TEXT") return;

    let target1 = document.getElementById(obj_id1.value);
    if (target1 == null) return;
    let pos1 = new THREE.Vector3();
    target1.object3D.getWorldPosition(pos1);

    let target2 = document.getElementById(obj_id2.value);
    if (target2 == null) return;
    let pos2 = new THREE.Vector3();
    target2.object3D.getWorldPosition(pos2);

    let newData = new Object();
    newData.type = "NUM";

    newData.value = pos1.distanceTo( pos2 );

    return newData;
}

Logic.prototype.transform_set_rotation = function(block){

    let self = this;

    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let  rotBlock = this.getBlockByValueName(block, "ROTATION");
    if(rotBlock == null) return;
    let rotData = this.parseBlock(rotBlock).data;
    if (rotData == null || rotData.type != "VEC3") return;

    //[start-20240326-renhaohsu-modify]//
    // rotData.value.multiply( new THREE.Vector3( 1 , -1 , -1 ) );
    
    // console.log(  Object.getPrototypeOf(rotData.value), rotData.value )
    let _rot = rotData.value.clone()
    _rot.y = -1 * _rot.y
    _rot.z = -1 * _rot.z
    rotData.value.copy( _rot );
    //[end-20240326-renhaohsu-modify]//

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    let tl = gsap.timeline();

    self.timelineDict[ block.id ] = tl ;

    tl.to(target.object3D.rotation, {
        duration: 0.01,
        delay: 0, 
        ease: 'none',
        x : rotData.value.x/180 * Math.PI,
        y : rotData.value.y/180 * Math.PI,
        z : rotData.value.z/180 * Math.PI
    });

    return tl;
}

Logic.prototype.transform_to_look_at_gameobject = function(block){

    let self = this;

    let  obj1Block = this.getBlockByValueName(block, "GAME_OBJECT_A");
    if(obj1Block == null) return;
    let obj1_id = this.parseBlock(obj1Block).data;
    if (obj1_id == null || obj1_id.type != "TEXT") return;

    let  obj2Block = this.getBlockByValueName(block, "GAME_OBJECT_B");
    if(obj2Block == null) return;
    let obj2_id = this.parseBlock(obj2Block).data;
    if (obj2_id == null || obj2_id.type != "TEXT") return;

    let target1 = document.getElementById(obj1_id.value);
    if (target1 == null) return;

    let target2 = document.getElementById(obj2_id.value);
    if (target2 == null) return;

    let targetPos = new THREE.Vector3();
    target2.object3D.getWorldPosition(targetPos);

    let tl = gsap.timeline();

    self.timelineDict[ block.id ] = tl ;

    tl.to(target1.object3D, {
        duration: 0.01,
        delay: 0, 
        ease: 'none',
        onStart: function(){
            target1.object3D.lookAt(targetPos);
        }
    });

    return tl;


}

Logic.prototype.transform_to_look_at = function(block){

    let self = this;

    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let  posBlock = this.getBlockByValueName(block, "POSITION");
    if(posBlock == null) return;
    let pos = this.parseBlock(posBlock).data;
    if (pos == null || pos.type != "VEC3") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    pos.value.multiply( new THREE.Vector3( -1, 1, 1 ) );


    let tl = gsap.timeline();

    self.timelineDict[ block.id ] = tl ;

    tl.to(gsapEmpty, {
        duration: 0.01,
        delay: 0, 
        ease: 'none',
        onStart: function(){
            target.object3D.lookAt(pos.value);
        }
    });

    return tl;
}

Logic.prototype.transform_get_rotation = function(block){
    
    let self = this;

    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    let newData = new Object();
    newData.type = "VEC3";

    newData.value = target.object3D.rotation.clone(); 
    newData.value.x = newData.value.x/Math.PI*180;
    newData.value.y = -newData.value.y/Math.PI*180;
    newData.value.z = -newData.value.z/Math.PI*180;
    
    return newData;
}

Logic.prototype.transform_get_rotation_in_space = function(block) {
    
    let self = this;

    let space = this.getContentByFieldName(block, "SPACE");
    if (space == null) return;

    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    let newData = new Object();
    newData.type = "VEC3";

    switch(space){

        case "SPACE_GLOBAL":
            let quan = new THREE.Quaternion();
            target.object3D.getWorldQuaternion(quan);
            let euler = new THREE.Euler();
            euler.setFromQuaternion(quan, "YXZ");
            newData.value = euler;
            break;

        case "SPACE_LOCAL":
            newData.value = target.object3D.rotation.clone(); 
            break;

    }

    newData.value.x = newData.value.x/Math.PI*180;
    newData.value.y = -newData.value.y/Math.PI*180;
    newData.value.z = -newData.value.z/Math.PI*180;
    
    return newData;
}

Logic.prototype.transform_get_scale = function(block){
    
    let self = this;

    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    let newData = new Object();
    newData.type = "NUM";
    newData.value = target.object3D.scale.clone().x; 
    
    return newData;
}

Logic.prototype.transform_get_scale_in_space = function(block){
    
    let self = this;

    let space = this.getContentByFieldName(block, "SPACE");
    if (space == null) return;

    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    let newData = new Object();
    let tmp = new THREE.Vector3();
    newData.type = "NUM";

    switch(space){

        case "SPACE_GLOBAL":
            target.object3D.getWorldScale(tmp);
            newData.value = tmp.x;
            break;

        case "SPACE_LOCAL":
            newData.value = target.object3D.scale.clone().x;
            break;

    }
    
    return newData;
}

Logic.prototype.transform_get_scale_axis_in_space = function(block){
    
    let self = this;

    let space = this.getContentByFieldName(block, "SPACE");
    if (space == null) return;

    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    let newData = new Object();
    newData.value = new THREE.Vector3();
    newData.type = "VEC3";

    switch(space){

        case "SPACE_GLOBAL":
            newData.value = target.object3D.getWorldScale(newData.value);
            break;

        case "SPACE_LOCAL":
            newData.value = target.object3D.scale.clone()
            break;

    }
    
    return newData;
}

Logic.prototype.transform_set_scale = function(block){
    
    let self = this;

    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let  scaleBlock = this.getBlockByValueName(block, "SCALE");
    if(scaleBlock == null) return;
    let scale = this.parseBlock(scaleBlock).data;
    if (scale == null || scale.type != "NUM") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    let tl = gsap.timeline();

    self.timelineDict[ block.id ] = tl ;

    tl.to(target.object3D.scale, {
        duration: 0.01,
        delay: 0, 
        ease: 'none',
        x : scale.value,
        y : scale.value,
        z : scale.value
    });

    return tl;
}

Logic.prototype.transform_set_scale_by_axis = function(block){

    let self = this;

    let  objBlock = this.getBlockByValueName(block, "GAME_OBJECT");
    if(objBlock == null) return;
    let obj_id = this.parseBlock(objBlock).data;
    if (obj_id == null || obj_id.type != "TEXT") return;

    let  scaleBlock = this.getBlockByValueName(block, "AXIS");
    if(scaleBlock == null) return;
    let scale = this.parseBlock(scaleBlock).data;
    if (scale == null || scale.type != "VEC3") return;

    let target = document.getElementById(obj_id.value);
    if (target == null) return;

    let tl = gsap.timeline();

    self.timelineDict[ block.id ] = tl ;
    
    tl.to(target.object3D.scale, {
        duration: 0.01,
        delay: 0, 
        ease: 'none',
        x : scale.value.x,
        y : scale.value.y,
        z : scale.value.z
    });

    return tl;
}