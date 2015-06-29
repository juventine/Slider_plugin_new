function Slider(options) {

	// initial settings for plugin
	var config = {
	visibleImgs : 3,                   //number of visible images in Viewport
	isButtonsVisible : true,           // Flag: buttons visible or invisible
	activeImageNumber : 1              // set active number of Image in Viewport
	};

	// global variables
	var self = this;
	var imageWidthOrig = 300;          // original width of image
	var imageHeightOrig = 200;         // original height of image
	var elementContainer;              // referemce to the element container of DOM
	var visibleImgs; //
	var arrVisibleImgs = [];           // array of visible images in viewport
	var countImages;                   // total number of images
	var arrElemImages = [];            // array of references to the image elements in DOM
	var arrBlockImage = [];            // array of references to div elements (where is located images)
	var deviceType;                    // type of device
	var elementLeftButton;             // reference to the left button
	var elementRightButton;            // reference to the right button
	var elementButtons;								 // reference to the buttons element
	var isDisabled = true;             // flag: button is disabled or no
	var shiftPixels;                   // size of shift of container in pixels ( for one image )
	var oldLeftStyle;                  // current style of shift of container
	var newLeftStyle;                  // new style of shift of container
	var containerImagesWidth;          // width images in container
	var arrMouseMoveCoordinates = [];  // array of coordinates of shift of Container (mouseMove)
	var delta;                         // current delta of shift ( mouseMove )
	var isMouseDownEvent = false;      // flag: is mouseDownEvent now or no

	this.init = function() {
	  	visibleImgs = options.visibleImgs;
	  	setStartConfiguration();
	  	getReferencesDomElements();
	  	countImages = options.countImages;
	  	initViewContainer();
	  	//************* registration of event-handlers
	  	window.addEventListener('resize', setSizeImagesInViewport); // event-handler for onresize event
	  	elementContainer.addEventListener('mousedown', handleMouseDownEvent); // event-handler for mousedown event
	        // onDragStart
	        elementContainer.ondragstart = function() {
		    return false;
		}
	  	setEventHandlersForButtons();
	}

	function setStartConfiguration() {
	  	
	  	if ( options.visibleImgs) {
			visibleImgs = options.visibleImgs;
		}
	
	  	if ( options.activeImageNumber != undefined ) {
	  		config.activeImageNumber = options.activeImageNumber;
		}
	}

	function getReferencesDomElements() {
	  	elementContainer = document.getElementById('container');
	  	arrElemImages = document.getElementsByClassName('imagesContainer');
	  	arrBlockImage = document.getElementsByClassName('block_image');
	  	elementLeftButton = document.querySelector('.arrow.left');
	  	elementRightButton = document.querySelector('.arrow.right');
	  	elementButtons = document.getElementById('buttons');
	 }

 	function initViewContainer() {
 		hideContainer();
 		deviceType = checkDeviceType();
 		checkVisibleImages(); // check what is the maximum of visible images in viewport depending on device
 		setInitVisibleImages(); // set array of visible images at load of slider
 		formImageSize(); // define what is the size of one image in viewport
 		initBuildDom();
 		showContainer();
		setTimeout(setButtonsPosition, 50); // define position of buttons depending on the size of images in viewport
 	}

 	function setEventHandlersForButtons() {
 		if (options.isButtonsVisible == 'true') {
 			elementButtons.addEventListener('click', self.shiftContainer);
 		}
 		else {
 			elementLeftButton.hidden = 'true';
 			elementRightButton.hidden = 'true';
 		}
 	}

	function hideContainer() {
	  elementContainer.hidden = 'true';
	}

	function checkDeviceType() {
	
	    if (window.outerWidth < 481) {
			return 'Mobile';
	    }
	
	    if (window.outerWidth > 481 && window.outerWidth < 1025) {
	    	return 'Tablet';
	    }
	
	    if (window.outerWidth > 1025) {
	    	return 'Desctop';
	    }
	 }


  	function checkVisibleImages() {
		switch( deviceType ) {
			case 'Mobile':
				config.visibleImgs = 1; // for mobiles maximum one image in viewport
				break;
			case 'Tablet':
				if ( visibleImgs > 0 && visibleImgs <= 3 ) {
					config.visibleImgs = visibleImgs;
					break;
				}
				else {
					config.visibleImgs = 3; // maximum 3 images for tablet
					break;
				}
			case 'Desctop':
				if ( visibleImgs > 0 ) {
					config.visibleImgs = visibleImgs;
				}
				else {
					config.visibleImgs = 5; // 5 visible images on default for desctop
					break;
				}
		}
	}

	function setInitVisibleImages() {
	var visibleImage = config.activeImageNumber - 1;

	for( var i = 0 ; i < config.visibleImgs; i++ ) {
		arrVisibleImgs[i] = visibleImage; // initial number of visible image (active image)
		visibleImage =  visibleImage + 1;
		if ( visibleImage == countImages ) {
			visibleImage = 0;
		}
	}
	}

	function formImageSize() {

		// define image width in viewport
		// consider left padding ( 3 px ) of block of images
		var imageWidthDyn = ( window.innerWidth - 3 * ( config.visibleImgs - 1 ) - 6 ) /config.visibleImgs; // size of image in viewport

		// set each image corresponding style of width and height
		for( var i = 0; i < arrElemImages.length; i++ ) {
			arrElemImages[i].style.width = imageWidthDyn + 'px';
			arrElemImages[i].style.height = 'auto';
		}
			shiftPixels = imageWidthDyn + 3;
			containerImagesWidth = shiftPixels * countImages;
	}

	function setButtonsPosition() {
		// define height of the container
		var containerHeight = elementContainer.clientHeight;
		// calculate position for buttons top position. consider height of container, padding of body and sizes of buttons
		var buttonsPositionTop = (containerHeight + 40 - 71 ) / 2 ;
		// set new styles for buttons
		elementLeftButton.style.top = buttonsPositionTop + 'px';
		elementRightButton.style.top = buttonsPositionTop + 'px';
	}

	function showContainer() {
		elementContainer.hidden = '';
	}

	function setSizeImagesInViewport() {
	/*
  	For various kind of devices we need to show corresponding maximum number of images in viewport.
  	Criterion is the width of screen of device

  	1) Size of Viewport for tablets is from 481 to 1025px. For tablets maximum images in viewport === 3
  	2) Size of Viewport for mobiles is < 481px ( width of mobile devices < 480 px). For mobiles maximum images in viewport === 1
  	3) Size of Viewport for desctops take >1025px.
    	*/
        	deviceType = checkDeviceType(); // type of the device
    		checkVisibleImages();
		formImageSize();
		setButtonsPosition();
	}

	function initRebuildDOMContainer() {
		var countElemReposition = config.activeImageNumber - 1;
		var arrElemBlockImage = [];
		var elemReposition; // divContainer for reposition
		arrElemBlockImage = document.getElementsByClassName('block_image');

		for ( i = 0; i < countElemReposition; i++ ) {
			elemReposition = elementContainer.removeChild(arrElemBlockImage[0])
			container.appendChild(elemReposition);
		}
	}

	function initBuildDom() {
		if ( config.activeImageNumber != 1 ) {
			initRebuildDOMContainer();
		}
	}

	this.shiftContainer = function(e) {
		var target = e.target;
	  	var shiftMode = target.getAttribute('data-action');
  		
  		if (isDisabled) {
    		isDisabled = false;
    			if (checkContainer(shiftMode)) {
    			rebuildDOMContainer(shiftMode);
    		}
    		var oldLeftStyle = elementContainer.getBoundingClientRect().left;
    		shiftContainerSmoothly(shiftMode, oldLeftStyle, shiftPixels);
		setVisibleImages(shiftMode);
		}
	}

	function shiftContainerSmoothly(shiftMode, oldLeftStyle, shiftPixels){
	// define number of intervals. shift in one interval mustn't be > 10 px
	  	var numberIntervals = Math.ceil( shiftPixels / 10 ); // 10 -- pixels in one interval
	  	var shiftInterval = shiftPixels / numberIntervals; // value of shift in one interval ( in pixels )
	  	
	  	if( shiftMode == 'shiftLeft' ) {
	  		var newLeftStyle = oldLeftStyle - shiftPixels;
	  		var shiftSize = oldLeftStyle - shiftInterval; // start shift of the container
	  	}
	  	else {
	  		var newLeftStyle = oldLeftStyle + shiftPixels;
	  		var shiftSize = oldLeftStyle + shiftInterval; // start shift of the container
	  	}
	
			var count = 0; // count of calling function timerShift
			// function for "fluent" shift
			var shiftTimer = setInterval( function() {
				count++;
				elementContainer.style.left = shiftSize + 'px';
	
				if( shiftMode == 'shiftLeft' ) {
					shiftSize -= shiftInterval;
				}
				else {
					shiftSize += shiftInterval;
				}
			// check if it's end of shift of container
				if ( count == numberIntervals ) {
					clearInterval( shiftTimer );
					isDisabled = true;
				}
			} , 15);
	}


	function checkContainer(shiftMode) {
		// function for checking if we need to rearrange images in DOM
		switch (shiftMode) {
			case 'shiftLeft':
				var lastRightImage = arrElemImages[countImages - 1];
				// check if last number of visible image == last number of image in container on the right side
				if( arrVisibleImgs[arrVisibleImgs.length - 1] == +lastRightImage.getAttribute('data-number') ) {
					return true;
				}
				else {
					return false;
				}

			case 'shiftRight':
				var lastLeftImage = arrElemImages[0];
				// check if first number of visible image == first number of image in container on the left side
				if( arrVisibleImgs[0] == +lastLeftImage.getAttribute('data-number') ) {
					return true;
				}
				else {
				return false;
				}
		}
	};

	function rebuildDOMContainer(shiftMode) {
		/*Function for rearrangement images in DOM */
		switch (shiftMode) {
			case 'shiftLeft':
				var firstBlockImageElement;
				// calculate shift of the container
				var oldLeftStyle = elementContainer.getBoundingClientRect().left;
				var newLeftStyle = oldLeftStyle + shiftPixels;
				//remove first image from container
				firstBlockImageElement = elementContainer.removeChild(arrBlockImage[0]);
				//************* shift container to the right*******************************************
				elementContainer.style.left = newLeftStyle + 'px';
				//*************************************************************************************
      				elementContainer.appendChild(firstBlockImageElement);
      				break;
  			case 'shiftRight':
  				var lastBlockImageElement = elementContainer.removeChild(arrBlockImage[arrBlockImage.length - 1]);//remove last image from container
		//************ shift container to the right *************************************
				var oldLeftStyle = elementContainer.getBoundingClientRect().left;
				var newLeftStyle = oldLeftStyle - shiftPixels;
				elementContainer.style.left = newLeftStyle + 'px';
		//************* insert element in the beggining of container******************************************************************
  				elementContainer.insertBefore(lastBlockImageElement, arrBlockImage[0]); //
  				break;
    	}
	};

	function setVisibleImages(shiftMode) {
		var elementImage;

		switch (shiftMode) {
			case 'shiftLeft':

				for (var i = 0; i < config.visibleImgs; i++){
					if (i == config.visibleImgs - 1) {
						break;
					}
					arrVisibleImgs[i] = arrVisibleImgs[i+1];
				}

				for (var j = 0; j < countImages; j++) {
					elementImage = arrElemImages[j];

					if (+elementImage.getAttribute('data-number') != arrVisibleImgs[i]) continue;
					else {
						if (j == countImages - 1){
							j = 0;
						}
						elementImage = arrElemImages[j+1];
						arrVisibleImgs[i] = +elementImage.getAttribute('data-number');
						return true;
					}
				}
			case 'shiftRight':
				for (var i = config.visibleImgs - 1; i > 0 ; i-- ){
					arrVisibleImgs[i] = arrVisibleImgs[i-1];
				}

				for (var j = 0; j < countImages; j++) {
					var elementImage = arrElemImages[j];

					if (+elementImage.getAttribute('data-number') != arrVisibleImgs[i]) continue;
					else {
						if (j == 0) {
							j = countImages - 1;
						}
						elementImage = arrElemImages[j-1];
						arrVisibleImgs[i] = +elementImage.getAttribute('data-number');
						return true;
					}
			  	}
	  	}
	}

	function handleMouseDownEvent(e) {
	  	if (isMouseDownEvent != true) {
	  	isMouseDownEvent = true;
	  	var startContainerPos = elementContainer.getBoundingClientRect().left;
	  	var startCoordinateX = e.clientX;
	  	// shiftMode: leftShift or rightShift
	  	var shiftMode;
	  	arrMouseMoveCoordinates.push(startCoordinateX);
	
	  	//******** adding events*******************************************
	  	document.addEventListener('mousemove', handleMouseMoveEvent);
	  	}
	
	  	document.addEventListener('mouseup', handleMouseUpEvent);
	  	//*****************************************************************
	  	function handleMouseMoveEvent(e) {
	 			arrMouseMoveCoordinates.push(e.clientX);
	 			var containerOffsetLeft = checkRebuildDOMContainer(e);
	
				if ( containerOffsetLeft != undefined ) {
					startContainerPos = containerOffsetLeft;
					startCoordinateX = e.clientX;
			  }
	 				moveContainer();
	  	}

	  	function handleMouseUpEvent(e){
	  		moveSmoothlyContainer();
	  		setTimeout(setVisibleImagesMouseUp, 500);
		  	document.removeEventListener('mousemove', handleMouseMoveEvent);
		  	document.removeEventListener('mouseup', handleMouseUpEvent);
		  	isMouseDownEvent = false;
	  	}

	  	function moveContainer() {
	  		var newLeftStyle = startContainerPos + arrMouseMoveCoordinates[arrMouseMoveCoordinates.length - 1] - startCoordinateX;
	  		elementContainer.style.left = newLeftStyle + 'px';
	  	}

	  	function checkRebuildDOMContainer(e){
	  		var containerOffsetLeft = elementContainer.getBoundingClientRect().left;
	  		var previousCoordinateX;
	  		// position of container with images relatively right side of window
	  		var containerOffsetRight = containerImagesWidth - (Math.abs(containerOffsetLeft) + window.innerWidth);
	  		// define delta of moving of container with images
	  		if (arrMouseMoveCoordinates.length <= 2) {
	  			previousCoordinateX = startCoordinateX;
	  		}
	  		else {
	  			previousCoordinateX = arrMouseMoveCoordinates[arrMouseMoveCoordinates.length - 2];
	  		}
	
	  		delta = previousCoordinateX - e.clientX;
	
	  		if (delta < 0) {
	  			shiftMode = 'shiftRight';
	  		}
	  		else if (delta > 0) {
	  			shiftMode = 'shiftLeft';
	  		}

  		//******************* Check if we need to relocate images in DOM **********************//
  		/*There are we have four various situation:
			1) When user smoothly move container with images to the right (1) or to the left side(2)
			2) When user move container to the right(3) or to the left side(4) very fast
  		*/
			// when shift takes place "smoothly" to the left or to the right side
			if ((containerOffsetLeft <= 0 && containerOffsetLeft >= - 5) &&  (delta < 0) ) { // shift to right side
				rebuildDOMContainer(shiftMode);
				setVisibleImages(shiftMode);
			  containerOffsetLeft = elementContainer.getBoundingClientRect().left;
				return containerOffsetLeft;
			}

			if((containerOffsetRight > 0 && containerOffsetRight <= 5) && (delta > 0)) { //shift to the left side
				rebuildDOMContainer(shiftMode);
				setVisibleImages(shiftMode);
				containerOffsetLeft = elementContainer.getBoundingClientRect().left;
				return containerOffsetLeft;
			}

			// when shift takes place very fast to the right or to the left side

			if (delta < 0 && containerOffsetLeft > 0) { // shift to the right side
				var countImgsRelocation = Math.ceil( Math.abs(delta)  / shiftPixels ); // number of images which we need to relocate in DOM
				for ( i = 0; i < countImgsRelocation; i++ ){
					rebuildDOMContainer(shiftMode);
					setVisibleImages(shiftMode);
				}
				containerOffsetLeft = elementContainer.getBoundingClientRect().left;
				return containerOffsetLeft;
			}

			if (delta > 0 && containerOffsetRight < 0) { // shift to the left side
				var countImgsRelocation = Math.ceil( Math.abs(delta)  / shiftPixels ); // number of images which we need to relocate in DOM
				for ( i = 0; i < countImgsRelocation; i++ ){
					rebuildDOMContainer(shiftMode);
					setVisibleImages(shiftMode);
				}
				containerOffsetLeft = elementContainer.getBoundingClientRect().left;
				return containerOffsetLeft;
			}
		}

	  	function moveSmoothlyContainer(){
	  		var shiftSize; // size in pixels which we need to shift "smoothly" container with images
	
	  		if (shiftMode == undefined) {
	  			if (delta < 0) {
	  				shiftMode = 'shiftRight';
	  			}
	  			else if (delta > 0) {
	  				shiftMode = 'shiftLeft';
	  			}
	  		}

		//******** Define size in pixels which we need to shift "smoothly" container with images ******
	  		var containerOffsetLeft = elementContainer.getBoundingClientRect().left;
	
	  		if (!(Math.abs(containerOffsetLeft) % shiftPixels)) {
	  			return true; // if we don't have any reasons to shift our container
	  		}
	
	  		if (Math.abs(containerOffsetLeft) > shiftPixels) {
	  			shiftSize = (Math.abs(containerOffsetLeft) % shiftPixels);
	  		}
	  		else {
	  			shiftSize = Math.abs(containerOffsetLeft);
	  		}
	
	  		if (shiftMode == 'shiftLeft') {
	  			shiftSize = shiftPixels - shiftSize;
	  		}
	
	  		shiftContainerSmoothly(shiftMode, containerOffsetLeft, shiftSize);
	  		//clear array with coordinates of moving container with images
	  		arrMouseMoveCoordinates.length = 0;
  		}
  	}

  	function setVisibleImagesMouseUp() {
		var containerOffsetLeft = elementContainer.getBoundingClientRect().left;
		// calculate number of images which are located outside viewport on the left side
		var imagesNumberLeft =  Math.round(Math.abs(containerOffsetLeft / shiftPixels));
		var j = 0;
		var elementImage;
		for (var i = imagesNumberLeft; i < (visibleImgs + imagesNumberLeft); i++ ){
			elementImage = arrElemImages[i];
			arrVisibleImgs[j] = +elementImage.getAttribute('data-number');
			j++;
		}
	}

  	this.init(); // when create object of class, we initialize

	this.destroy = function() {
		window.removeEventListener('resize', setSizeImagesInViewport);
		window.removeEventListener('mousedown', clickMouseViewport);
		window.addEventListener('click', self.shiftContainer);
	}
}

