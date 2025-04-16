class CommonTools {

    static url = "https://ssl-api-makar-v3-apps.miflyservice.com/Makar/";

    


    // source: https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve

    // Standard Normal variate using Box-Muller transform.
    static gaussianRandom(mean=0, stdev=1) {
        const u = 1 - Math.random(); // Converting [0,1) to (0,1]
        const v = Math.random();
        const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        // Transform to the desired mean and standard deviation:
        return z * stdev + mean;
    }



    static sendPost(destination, dataObject) {
        // Reference: https://developers.google.com/web/fundamentals/primers/promises?hl=zh-tw

        let self = this;

        return new Promise(function(resolve, reject) {

            let request = {
                ver: self.webVersion,
                cid: 5,
                data: dataObject
            };
            
            fetch( destination, {
                body: JSON.stringify( request ),
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                cache: 'no-cache',
                credentials: 'same-origin',
                mode: 'cors', // no-cors, cors, *same-origin  
            }).then( res => res.json() ).then(function( response ){

                setTimeout( function(){
                    resolve( response );
                }, 1 ) 

            })
        });
    }

    static async getProjectInfoList ( project_ids, login_id ) {

        if ( !Array.isArray( project_ids ) ){
            console.warn( '_getProjectInfoList_: error',  project_ids )
            return false;
        }

        let specificUrl = this.url + "WebXR/GetProjects";
        let data = {
            "login_user_id": login_id,
            "project_ids": project_ids,
        };
        let result = this.sendPost(specificUrl, data);
    
        return await result;
    }

}

export default CommonTools;