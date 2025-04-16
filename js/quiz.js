function quizVR(){
  
    'use strict';
    
    this.moduleLoaded = false;
    this.mdb = null;
    let self = this;
    
    if (!parent.mdb){
        console.log("quiz.js: the parent mdb not existm, error");
    }else{
        this.mdb = parent.mdb;
    };


    ////// 與 DB 相關
    this.setQuizProject = function(projInfo , callback){
        parent.mdb.setQuizProject( projInfo ).then( projRet=>{
            console.log("quiz.js: _setQuizProject: projRet = ", projRet  );
            if (callback) callback(projRet);
        });

    }

    this.getQuizProject = function(proj_id , callback ){
        parent.mdb.getQuizProject( proj_id ).then( projRet=>{
            console.log("quiz.js: _getQuizProject: projRet = ", projRet  );
            if (callback) callback(projRet);
        });
    }

    this.saveQuestion = function( getProjRet , target_id , callback ){

        let gotPointTarget =  getProjRet.collected_points.find(function(item){
            return item == target_id ;
        });
        
        if (gotPointTarget){
            console.log("quiz.js: _addPoint: there alreay are project, and got target: ", gotPointTarget , getProjRet );
            if (callback){
                callback(getProjRet);
            }

        }else{
            console.log("quiz.js: _addPoint: there alreay are project, but no got target: " , gotPointTarget , getProjRet );
            getProjRet.collected_points.push( target_id );
            self.setQuizProject(getProjRet , setProjRet => {
                ////// 只有 get 的event 可以回傳整個資料， put 只會回傳 index 
                parent.mdb.getQuizProject( getProjRet.proj_id ).then( projRet => {
                    console.log("quiz.js: _addPoint: projRet = ", projRet );	
                    if (callback){
                        callback(projRet);                
                    }
                });

                
            }) ;
        }

    }


}

// let aQuizVR = new quizVR();
