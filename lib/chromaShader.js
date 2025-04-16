/* --------------------------------------------------------
THREE.ObjectControls
version: 1.1
author: Alberto Piras
email: a.piras.ict@gmail.com
github: https://github.com/albertopiras
license: MIT
----------------------------------------------------------*/

/**
 * THREE.ObjectControls
 * @constructor
 * @param camera - The camera.
 * @param domElement - the renderer's dom element
 * @param objectToMove - the object to control.
 */

var vertexShaderRGB = 
	`varying vec2 vUv;
	void main()
	{
		vUv = uv;
		vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
		gl_Position = projectionMatrix * mvPosition;
	}`;

var fragmentShaderRGB = `
	uniform sampler2D texture;
	uniform vec3 color;
	varying vec2 vUv;
	float _threshold = 1.0 ;
	float _slope = 0.3 ;
	float opacity = 1.0;
	void main()
	{
		vec3 tColor = texture2D( texture, vUv ).rgb;
		float a = texture2D( texture, vUv ).a;
		// float a = (length(tColor - color) - 0.5) * 7.0;

		// if (tColor.g > 0.7 && tColor.r < 0.7 && tColor.b < 0.7  ){
		// 	tColor = vec3(0.0, 0.0, 0.0);
		// 	tColor.g = 0.0;
		// 	a = 0.0 ;
		// }
		// gl_FragColor = vec4(tColor, a);

		///////// thonsha method ///////
		float d1, d2, d3, d4, d;
		d1 = abs(length(abs(color.rgb - tColor.rgb)));

		float c1 = abs(length( tColor.g - tColor.r) - length(color.g - color.r));
		float c2 = abs(length( tColor.r - tColor.b) - length(color.r - color.b));
		float c3 = abs(length( tColor.b - tColor.g) - length(color.b - color.g));

		d4 = c1 + c2 + c3;

		d = (d1*2.0 + d4) / 2.0 ;

		float edge0 = _threshold * (1.0 - _slope);
		float alpha = smoothstep(edge0, _threshold, d);
		gl_FragColor = vec4(tColor, alpha );
		if (alpha < opacity){
			gl_FragColor = vec4(tColor, alpha*a);
		} else{
			gl_FragColor = vec4(tColor, opacity*a);
		}

	}
	`;


THREE.ChromaKeyMaterial = function( parameters ) {
	// console.log("chromaShader.js: ChromaKeyMaterial: parameters=", parameters );
	if ( parameters === undefined ) return;
	if ( parameters.map === undefined || parameters.keyColor === undefined ) return;
	if ( parameters.side === undefined)  parameters.side = THREE.FrontSide;

	if ( parameters.slope === undefined)  parameters.slope = 0.3 ;
	if ( parameters.threshold === undefined)  parameters.threshold = 1.0 ;
	
	var fragmentShaderM = fragmentShaderRGB.replace("float _threshold = 1.0", "float _threshold = " + parameters.threshold.toFixed(3) );
	fragmentShaderM = fragmentShaderM.replace("float _slope = 0.3", "float _slope = " + parameters.slope.toFixed(3) );

	// console.log("chromaShader.js: ChromaKeyMaterial: slope / threshold =", parameters.slope, parameters.threshold  );
	// console.log("chromaShader.js: ChromaKeyMaterial: fragmentShaderM =", fragmentShaderM  );

	var self = this;
	THREE.ShaderMaterial.call(self);
	
	var keyColorObject;

	if ( Array.isArray( parameters.keyColor  ) ){ 
		keyColorObject = new THREE.Color( parameters.keyColor[0] , parameters.keyColor[1] , parameters.keyColor[2] );
	}else{
		keyColorObject = new THREE.Color( parameters.keyColor );
	}

	self.setValues({
		uniforms: {
			texture: {
				type: "t",
				value: parameters.map,
			},
			color: {
				type: "c",
				value: keyColorObject
			}
		},
		vertexShader: vertexShaderRGB,
		fragmentShader: fragmentShaderM,

		map: parameters.map, 
		transparent: true,
		side: parameters.side ,
		depthTest: false ,
		depthWrite: false ,
	});
	// console.log(" ************** chromaShader.js: self=", self );
};

THREE.ChromaKeyMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );
THREE.ChromaKeyMaterial.prototype.constructor = THREE.ChromaKeyMaterial;

var vertexShaderHSV = 
	`
	varying vec2 vUV;
	void main(void) {
		vUV = uv;
    	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
	}
	`
	;

var fragmentShaderHSV = `
	uniform sampler2D src;
	float opacity=1.0;
	varying vec2 vUV;
	uniform float _keyingColorH;
	uniform float _keyingColorS;
	uniform float _keyingColorV;
	uniform float _deltaH;
	uniform float _deltaS;
	uniform float _deltaV;

	vec3 rgb2hsv(vec3 c){
		vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
		vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
		vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
		float d = q.x - min(q.w, q.y);
		float e = 1.0e-10;
		return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
	}

	void main(){
		vec3 tColor = texture2D( src, vUV ).rgb;
		float a = texture2D( src, vUV ).a;
		vec3 HSV = rgb2hsv(tColor);
		float h = abs(HSV.x - _keyingColorH);
		float s = abs(HSV.y - _keyingColorS);
		float v = abs(HSV.z - _keyingColorV);
		float alpha = opacity;
		if (h <= _deltaH * 0.5 && s <= _deltaS && v <= _deltaV){
			alpha = smoothstep((_deltaH * 0.5) * 0.8, _deltaH* 0.6 ,h);
		}

		gl_FragColor = vec4(tColor, alpha*a);
	}

	`;


THREE.HSVMattingMaterial = function( parameters ) {
	// console.log("chromaShader.js: HSVMattingMaterial: parameters=", parameters );
	if ( parameters === undefined ) return;
	if ( parameters.map === undefined ) return;
	if ( parameters.side === undefined)  parameters.side = THREE.FrontSide;

	if ( parameters._keyingColorH === undefined)  parameters._keyingColorH = 0.33 ;
	if ( parameters._keyingColorS === undefined)  parameters._keyingColorS = 1.0 ;
	if ( parameters._keyingColorV === undefined)  parameters._keyingColorV = 0.75 ;

	if ( parameters._deltaH === undefined)  parameters._deltaH = 0.2 ;
	if ( parameters._deltaS === undefined)  parameters._deltaS = 0.1 ;
	if ( parameters._deltaV === undefined)  parameters._deltaV = 0.1 ;
	
	console.log(" ***************************************** parameters = ", parameters );
	// console.log("chromaShader.js: HSVMattingMaterial: slope / threshold =", parameters.slope, parameters.threshold  );
	// console.log("chromaShader.js: HSVMattingMaterial: fragmentShaderM =", fragmentShaderM  );

	var self = this;
	THREE.ShaderMaterial.call(self);
	
	var keyColorObject;

	if ( Array.isArray( parameters.keyColor  ) ){ 
		keyColorObject = new THREE.Color( parameters.keyColor[0] , parameters.keyColor[1] , parameters.keyColor[2] );
	}else{
		keyColorObject = new THREE.Color( parameters.keyColor );
	}

	self.setValues({
		uniforms: {
			src: {
				type: "t",
				value: parameters.map,
			},
			color: {
				type: "c",
				value: keyColorObject
			},
			_keyingColorH: {
				type:"number",
				value:parameters._keyingColorH,
			},
			_keyingColorS: {
				type:"number",
				value:parameters._keyingColorS,
			},
			_keyingColorV: {
				type:"number",
				value:parameters._keyingColorV,
			},
			_deltaH: {
				type:"number",
				value:parameters._deltaH,
			},
			_deltaS: {
				type:"number",
				value:parameters._deltaS,
			},
			_deltaV: {
				type:"number",
				value:parameters._deltaV,
			},
		},
		vertexShader: vertexShaderHSV,
		fragmentShader: fragmentShaderHSV ,

		map: parameters.map, 
		transparent: true,
		side: parameters.side ,

		depthTest: false ,
		depthWrite: false ,
	});
	
};
THREE.HSVMattingMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );
THREE.HSVMattingMaterial.prototype.constructor = THREE.HSVMattingMaterial;