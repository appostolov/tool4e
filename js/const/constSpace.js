define(function(){
	
	return {
	    frameRate: 60,
	    rowndView: 60,
	    cursor: {
	        mousedown: 'crosshair',
	        mouseup: 'default'
	    },
	    defaultObjectImg: 'c/u/img/default_object.JPG',
	    presenceRange: 100000,
	    spaceRange: 1000000000000,//100000,
		rotation: {
            vell: [[0], [0], [0]],
            acc: 0.001,
            maxVell: 1,
            envPress: 0.0005
        },
        globalSystem: [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
      ],
        motion: {
            vell: [[0], [0], [0]],
            acc: 100,
            maxVell: 5000,
            envPress: 50,

            keyboard: {
                38: {
                    on: false,
                    ax: 2,
                    dir: 1
                },
                39: {
                    on: false,
                    ax: 0,
                    dir: 1
                },
                40: {
                    on: false,
                    ax: 2,
                    dir: -1
                },
                37: {
                    on: false,
                    ax: 0,
                    dir: -1
                },
                87: {
                    on: false,
                    ax: 2,
                    dir: 1
                },
                68: {
                    on: false,
                    ax: 0,
                    dir: 1
                },
                83: {
                    on: false,
                    ax: 2,
                    dir: -1
                },
                65: {
                    on: false,
                    ax: 0,
                    dir: -1
                }
             }
        }
	}
});