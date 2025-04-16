// ************************************************************************************************** //
//    Thanks for mayognaise, the author of aframe-gif-shader,                                         //
//	  must part of gifParse are base on this kind person. We will share to THREE.js as soon as we can //
//    github:  https://github.com/mayognaise/aframe-gif-shader                                        //
// ************************************************************************************************** //


var integrate = function() {
	function parseUrl (src) {
		// var parsedSrc = src.match(/\url\((.+)\)/);
		// if (!parsedSrc) { return; }
		// return parsedSrc[1];

		if ( src.indexOf("http") == 0 && src.indexOf("gif") == (src.length-3) ){
			return src;
		}else{
			return;
		}

	}
	var gifData = {};

	function createError(err, src) {
		return { status: 'error', src: src, message: err, timestamp: Date.now() };
	}

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	THREE.gifAnimator = class gifAnimator {
	// var gifAnimator  = window.gifAnimator = class gifAnimator {
	// class gifAnimator{ 
		constructor() {
			this.data = {
				// src:"../t.gif"
				// src:"url(https://s3-ap-northeast-1.amazonaws.com/mifly0makar0assets/Users/fefe/Resource/e516a8437e634d7c866853b48827a45a.gif)",
				src:null,
				autoplay:true, //// 暫時不給調整
				transparent: true,
				opacity:1,
				side:THREE.DoubleSide,
			};
		}
	
		init(data) {
			let self = this;

			Object.keys(data).forEach(function (key) {
				self.data[key] = data[key];
			});

			this.__cnv = document.createElement('canvas');
			this.__cnv.width = 2;
			this.__cnv.height = 2;
			this.__ctx = this.__cnv.getContext('2d');
			this.__texture = new THREE.Texture(this.__cnv); //renders straight from a canvas
			this.__material = {};
			this.__reset();

			if (data.chroma ){
				console.log(" gif-animator.js: ***************************************** chroma= ", data.chroma );
				let chromaKeyMaterial;
				if (data.chroma.mode == "RGB"){
					
					chromaKeyMaterial = new THREE.ChromaKeyMaterial({
						map: this.__texture , 
						keyColor: data.chroma.chromakey.split(","),
						side: THREE.FrontSide, 
						slope: data.chroma.slope,
						threshold: data.chroma.threshold,
					});
				} else if (data.chroma.mode == "HSV"){
					let HSV = data.chroma.HSV.split(",");
					let keyH = parseFloat(HSV[0]);
					let keyS = parseFloat(HSV[1]);
					let keyV = parseFloat(HSV[2]);

					chromaKeyMaterial = new THREE.HSVMattingMaterial({
						map: this.__texture , 
						side: THREE.FrontSide, // DoubleSide
						_keyingColorH: keyH,
						_keyingColorS: keyS,
						_keyingColorV: keyV,
						_deltaH: data.chroma.hue,
						_deltaS: data.chroma.saturation,
						_deltaV: data.chroma.brightness,
					});
				}
				this.material = chromaKeyMaterial;
			}else{
				this.material = new THREE.MeshBasicMaterial({ map: this.__texture });
			}

			this.__addPublicFunctions();
			
			this.update(this.data);

			return this.material;
		}

		update(oldData) {
			// console.log("gif-animator.js: update: " , oldData , this  );
			this.__updateMaterial(oldData);
			this.__updateTexture(oldData);
			return this.material;
		}

		tick(t) {
			setTimeout(function(){
				if (!this.__frames || this.paused()) {
				}else{
					// let t1 = Date.now() - this.__startTime;
					// if (t1 >= this.__nextFrameTime) {
					// 	this.nextFrame();
					// }else{
					// }
					//// 先設定當前時間，再檢查與『上一次更新畫面』的時間差是否已經超過 『gif預設時間軸中下一張圖』的時間，成立則更新gif畫面且紀錄時間
					this.__curTime = Date.now();
					if (this.__curTime - this.__preTime >= this.__nextFrameTime ){
						this.nextFrame();
						this.__preTime = this.__curTime;
					}
				}
				this.tick();
			}.bind(this) , 20 );//// 預設每 20ms 檢查一次是否更新畫面，會跟 editor接近
			
			//// origin flow
			// if (!this.__frames || this.paused()) return;
			// if (Date.now() - this.__startTime >= this.__nextFrameTime) {
			// 	this.nextFrame();
			// }
		}

		__updateMaterial(data) {
			var material = this.material;
			var newData = this.__getMaterialData(data);
			Object.keys(newData).forEach(function (key) {
				material[key] = newData[key];
			});
		}

		__getMaterialData(data) {
			return {
				opacity: data.opacity,
				transparent: data.transparent,
				side: data.side,
				autoplay: data.autoplay,
			};
		}

		__setTexure(data) {
			if (data.status === 'error') {
			//   warn('Error: ' + data.message + '\nsrc: ' + data.src);
			console.warn('Error: ' + data.message + '\nsrc: ' + data.src);
			this.__reset();
			} else if (data.status === 'success' && data.src !== this.__textureSrc) {
			this.__reset();
			/* Texture added or changed */
			this.__ready(data);
			}
		}

		__updateTexture(data) {
			var src = data.src;
			var autoplay = data.autoplay;

			/* autoplay */

			if (typeof autoplay === 'boolean') {
				this.__autoplay = autoplay;
			} else if (typeof autoplay === 'undefined') {
				this.__autoplay = true;
			}
			if (this.__autoplay && this.__frames) {
				this.play();
			}

			/* src */
			if (src) {
				this.__validateSrc(src, this.__setTexure.bind(this));
			} else {
			/* Texture removed */
				this.__reset();
			}
		}

		__validateSrc(src, cb) {

			/* check if src is a url */
			var url = parseUrl(src);
			if (url) {
				this.__getImageSrc(url, cb);
				return;
			}

			// var message = void 0;

			// /* check if src is a query selector */
			// var el = this.__validateAndGetQuerySelector(src);
			// if (!el || (typeof el === 'undefined' ? 'undefined' : _typeof(el)) !== 'object') {
			// 	return;
			// }
			// if (el.error) {
			// 	message = el.error;
			// } else {
			// 	var tagName = el.tagName.toLowerCase();
			// 	if (tagName === 'video') {
			// 		src = el.src;
			// 		message = 'For video, please use `aframe-video-shader`';
			// 	} else if (tagName === 'img') {
			// 		this.__getImageSrc(el.src, cb);
			// 		return;
			// 	} else {
			// 		message = 'For <' + tagName + '> element, please use `aframe-html-shader`';
			// 	}
			// }

			// /* if there is message, create error data */
			// if (message) {
			// 	(function () {
			// 		var srcData = gifData[src];
			// 		var errData = createError(message, src);
			// 		/* callbacks */
			// 		if (srcData && srcData.callbacks) {
			// 			srcData.callbacks.forEach(function (cb) {
			// 				return cb(errData);
			// 			});
			// 		} else {
			// 			cb(errData);
			// 		}
			// 		/* overwrite */
			// 		gifData[src] = errData;
			// 	})();
			// }
		}

		__getImageSrc(src, cb) {

			var _this = this;

			/* if src is same as previous, ignore this */
			if (src === this.__textureSrc) {
				return;
			}

			/* check if we already get the srcData */
			var srcData = gifData[src];
			if (!srcData || !srcData.callbacks) {
				/* create callback */
				srcData = gifData[src] = { callbacks: [] };
				srcData.callbacks.push(cb);
			} else if (srcData.src) {
				cb(srcData);
				return;
			} else if (srcData.callbacks) {
				/* add callback */
				srcData.callbacks.push(cb);
				return;
			}

			var tester = new Image();
			tester.crossOrigin = 'Anonymous';
			tester.addEventListener('load', function (e) {

			/* check if it is gif */
				_this.__getUnit8Array(src, function (arr) {

					if (!arr) {
						onError('This is not gif. Please use `shader:flat` instead');
						return;
					}
					/* parse data */
					// (0, _gifsparser.parseGIF)(arr, function (times, cnt, frames) {
					(0, _this.parseGIF)(arr, function (times, cnt, frames) {

						/* store data */
						var newData = { status: 'success', src: src, times: times, cnt: cnt, frames: frames, timestamp: Date.now() };
						/* callbacks */
						if (srcData.callbacks) {
							srcData.callbacks.forEach(function (cb) {
								return cb(newData);
							});
							/* overwrite */
							gifData[src] = newData;
						}
					}, function (err) {
						return onError(err);
					});
				});
			});
			tester.addEventListener('error', function (e) {
				return onError('Could be the following issue\n - Not Image\n - Not Found\n - Server Error\n - Cross-Origin Issue');
			});
			function onError(message) {
				/* create error data */
				var errData = createError(message, src);
				/* callbacks */
				if (srcData.callbacks) {
					srcData.callbacks.forEach(function (cb) {
						return cb(errData);
					});
					/* overwrite */
					gifData[src] = errData;
				}
			}
			tester.src = src;
		}

		__getUnit8Array(src, cb) {
			if (typeof cb !== 'function') {
				return;
			}

			var xhr = new XMLHttpRequest();
			xhr.open('GET', src);
			xhr.responseType = 'arraybuffer';
			xhr.addEventListener('load', function (e) {
				var uint8Array = new Uint8Array(e.target.response);
				var arr = uint8Array.subarray(0, 4);
				// const header = arr.map(value => value.toString(16)).join('')
				var header = '';
				for (var i = 0; i < arr.length; i++) {
					header += arr[i].toString(16);
				}
				if (header === '47494638') {
					cb(uint8Array);
				} else {
					cb();
				}
			});
			xhr.addEventListener('error', function (e) {
				console.error(e);
				cb();
			});
			xhr.send();
		}

		__validateAndGetQuerySelector(selector) {
			try {
				var el = document.querySelector(selector);
				if (!el) {
					return { error: 'No element was found matching the selector' };
				}
				return el;
			} catch (e) {
				// Capture exception if it's not a valid selector.
				return { error: 'no valid selector' };
			}
		}

		__addPublicFunctions() {
			this.gif = {
				play: this.play.bind(this),
				pause: this.pause.bind(this),
				togglePlayback: this.togglePlayback.bind(this),
				paused: this.paused.bind(this),
				nextFrame: this.nextFrame.bind(this)
			};
		}
		//// current Fei only set [ play, pause ] can be used on public
		pause() {
			this.__paused = true;
		}

		play() {
			this.__paused = false;
		}

		togglePlayback() {
			if (this.paused()) {
				this.play();
			} else {
				this.pause();
			}
		}

		paused() {
			return this.__paused;
		}

		nextFrame() {
			this.__draw();

			/* update next frame time */
			// while (Date.now() - this.__startTime >= this.__nextFrameTime) {
			// 	this.__nextFrameTime += this.__delayTimes[this.__frameIdx++];
			// 	if ((this.__infinity || this.__loopCnt) && this.__frameCnt <= this.__frameIdx) {
			// 		/* go back to the first */
			// 		this.__frameIdx = 0;
			// 	}
			// }

			//// 檢查下一個畫面需要的時間， 假如超出時間軸，則將 frame index 歸零。
			this.__nextFrameTime = this.__delayTimes[this.__frameIdx++];
			if ((this.__infinity || this.__loopCnt) && this.__frameCnt <= this.__frameIdx) {
				this.__frameIdx = 0;
			}
			

		}

		//==============================
		//=           canvas           =
		//==============================

		__clearCanvas() {
			this.__ctx.clearRect(0, 0, this.__width, this.__height);
			this.__texture.needsUpdate = true;
		}

		__draw() {
			// this.__ctx.drawImage(this.__frames[this.__frameIdx], 0, 0, this.__width, this.__height);
			if(this.__frameIdx != 0){
				var lastFrame = this.__frames[this.__frameIdx -1 ]
				// Disposal method indicates if you should clear or not the background.
				// This flag is represented in binary and is a packed field which can also represent transparency.
				// http://matthewflickinger.com/lab/whatsinagif/animation_and_transparency.asp  
				if(lastFrame.disposalMethod == 8 || lastFrame.disposalMethod == 9){
					this.__clearCanvas();
				}
			}
			else{
				this.__clearCanvas();
			}
			var actualFrame = this.__frames[this.__frameIdx];
			this.__ctx.drawImage(actualFrame, 0, 0, this.__width, this.__height)
			this.__texture.needsUpdate = true;
		}

		__ready(_ref) {
			var src = _ref.src;
			var times = _ref.times;
			var cnt = _ref.cnt;
			var frames = _ref.frames;
			// console.log("gif-animator.js: __ready: times=", times, ", cnt=",cnt );
			this.__textureSrc = src;
			this.__delayTimes = times;
			cnt ? this.__loopCnt = cnt : this.__infinity = true;
			this.__frames = frames;
			this.__frameCnt = times.length;
			//// fei 修改之後， __startTime 沒有作用了
			this.__startTime = Date.now();
			//// fei 修改之後， curTime preTime 分別紀錄當前時間和『上一次更新畫面』的時間
			this.__curTime = Date.now();
			this.__preTime = Date.now();

			this.__width = THREE.Math.floorPowerOfTwo(frames[0].width);
			this.__height = THREE.Math.floorPowerOfTwo(frames[0].height);
			this.__cnv.width = this.__width;
			this.__cnv.height = this.__height;
			this.__draw();
			if (this.__autoplay) {
				// console.log("gif-animator.js: __ready: this=", this );
				this.play();
			} else {
				this.pause();
			}
			this.tick();
		}

		__reset() {
			this.pause();
			this.__clearCanvas();
			this.__startTime = 0;
			this.__curTime = 0;
			this.__preTime = 0;
			this.__nextFrameTime = 0;
			this.__frameIdx = 0;
			this.__frameCnt = 0;
			this.__delayTimes = null;
			this.__infinity = false;
			this.__loopCnt = 0;
			this.__frames = null;
			this.__textureSrc = null;
		}

		parseGIF(gif, successCB, errorCB) {

			var pos = 0;
			var delayTimes = [];
			var loadCnt = 0;
			var graphicControl = null;
			var imageData = null;
			var frames = [];
			var loopCnt = 0;
			if (gif[0] === 0x47 && gif[1] === 0x49 && gif[2] === 0x46 && // 'GIF'
		//   gif[3] === 0x38 && gif[4] === 0x39 && gif[5] === 0x61) {
			gif[3] === 0x38 && (gif[4] === 0x39 || gif[4] === 0x37) && gif[5] === 0x61) {		  
				// '89a'
				pos += 13 + +!!(gif[10] & 0x80) * Math.pow(2, (gif[10] & 0x07) + 1) * 3;
				var gifHeader = gif.subarray(0, pos);
				while (gif[pos] && gif[pos] !== 0x3b) {
					var offset = pos,
						blockId = gif[pos];
					if (blockId === 0x21) {
						var label = gif[++pos];
						if ([0x01, 0xfe, 0xf9, 0xff].indexOf(label) !== -1) {
							label === 0xf9 && delayTimes.push((gif[pos + 3] + (gif[pos + 4] << 8)) * 10);
							label === 0xff && (loopCnt = gif[pos + 15] + (gif[pos + 16] << 8));
							while (gif[++pos]) {
								pos += gif[pos];
							}
							label === 0xf9 && (graphicControl = gif.subarray(offset, pos + 1));
						} else {
							errorCB && errorCB('parseGIF: unknown label');break;
						}
					} else if (blockId === 0x2c) {
						pos += 9;
						pos += 1 + +!!(gif[pos] & 0x80) * (Math.pow(2, (gif[pos] & 0x07) + 1) * 3);
						while (gif[++pos]) {
							pos += gif[pos];
						}
						var imageData = gif.subarray(offset, pos + 1);
						// frames.push(URL.createObjectURL(new Blob([gifHeader, graphicControl, imageData])));
						// Each frame should have an image and a flag to indicate how to dispose it.
						var frame = {
							// http://matthewflickinger.com/lab/whatsinagif/animation_and_transparency.asp
							// Disposal method is a flag stored in the 3rd byte of the graphics control
							// This byte is packed and stores more information, only 3 bits of it represent the disposal
							disposalMethod: graphicControl[3],
							blob:URL.createObjectURL(new Blob([gifHeader, graphicControl, imageData]))
						}
						frames.push(frame);
					} else {
						errorCB && errorCB('parseGIF: unknown blockId');break;
					}
					pos++;
				}
			} else {
				errorCB && errorCB('parseGIF: no GIF89a');
			}
			if (frames.length) {
		
				var cnv = document.createElement('canvas');
				var loadImg = function loadImg() {
					frames.forEach(function (src, i) {
						var img = new Image();
						img.onload = function (e, i) {
							if (i === 0) {
								cnv.width = img.width;
								cnv.height = img.height;
							}
							loadCnt++;
							frames[i] = this;
							if (loadCnt === frames.length) {
								loadCnt = 0;
								imageFix(1);
							}
						}.bind(img, null, i);
						// img.src = src;
						img.src = src.blob;
						img.disposalMethod = src.disposalMethod;
					});
				};
				var imageFix = function imageFix(i) {
					var img = new Image();
					img.onload = function (e, i) {
						loadCnt++;
						frames[i] = this;
						if (loadCnt === frames.length) {
							cnv = null;
							successCB && successCB(delayTimes, loopCnt, frames);
						} else {
							imageFix(++i);
						}
					}.bind(img);
					img.src = cnv.toDataURL('image/gif');
				};
				loadImg();
			}
		};

	};

	THREE.gifAnimator.prototype = Object.create( THREE.EventDispatcher.prototype );
	THREE.gifAnimator.prototype.constructor = THREE.gifAnimator;

};

var scope;
if (typeof window !== 'undefined') {
	scope = window;
} else {
	console.error("gif-animator.js: window error", window );
}

var integrateTick = function() {
	if (scope.THREE) {
		integrate();
	} else {
		setTimeout(integrateTick, 50);
	}
};
integrateTick();
