var GAME_OVER = 0;

var shapes = [
   [ 1, 1, 1, 1 ],
   [ 1, 1, 1, 0,
     1 ],
   [ 1, 1, 0, 0,
     1, 1 ],
   [ 1, 0, 0, 0,
     1, 1, 1 ],
   [ 0, 1, 0, 0,
     1, 1, 1 ],
   [ 0, 1, 1, 0,
     1, 1 ],
   [ 1, 1, 0, 0,
     0, 1, 1 ]
];

var color = [
   'cyan',
   'orange',
   'yellow',
   'blue',
   'purple',
   'green',
   'red'
];

var board = [];
var clearBoard = function () {
    for ( var x = 0; x < 10; ++x ) {
        board[ x ] = [];
        for ( var y = 0; y < 20; ++y ) {
            board[ x ][ y ] = 0;
        }
    }
};
clearBoard();

var current = [];
( function () {
    for ( var x = 0; x < 4; ++x ) {
        current[ x ] = [];
        for ( var y = 0; y < 4; ++y ) {
            current[ x ][ y ] = 0;
        }
    }
} )();

var currentY = 0, currentX = 0;

var copyShape = function ( index ) {
    for ( var i = 0; i < 16; ++i ) {
        if ( shapes[ index ].length - 1 >= i && shapes[ index ][ i ] != 0 ) {
            current[ ( i - i % 4 ) / 4 ][ i % 4 ] = color[ index ];
        }
        else {
            current[ ( i - i % 4 ) / 4 ][ i % 4 ] = 0;
        }
    }
};

var newShape = function () {
    copyShape( Math.floor( Math.random() * 10 ) % 7 );
    currentX = 4;
    currentY = -10;
};

var tick = function () {
    if ( !GAME_OVER && valid( currentX, currentY + 1, current ) ) {
        ++currentY;
    }
    else {
        freeze( current );
        //detect if a line has been made
        for ( var y = currentY; y < currentY + 4 && y < board[ 0 ].length; ++y ) {
            var noLine = true;
            for ( var x = 0; x < 10; ++x ) {
                if ( board[ x ][ y ] == 0 ) {
                    noLine = false;
                    break;
                }
            }

            if ( noLine ) {
                console.log( "Line created" );
                for ( var upY = y - 1; upY >= 0; --upY ) {
                    for ( var upX = 0; upX < 10; ++upX ) {
                        board[ upX ][ upY + 1 ] = board[ upX ][ upY ];
                    }
                }
            }
        }

        newShape();
        if ( valid( currentX, currentY + 10, current ) ) {
            currentY += 10;
        }
        else {
            GAME_OVER = 1;
        }
    }
};

var valid = function ( x, y, current ) {
    for ( var i = x; i < x + 4; ++i ) {
        for ( var j = y; j < y + 4; ++j ) {
            if ( current[ i - x ][ j - y ] ) {
                if ( j + 1 > board[ 0 ].length ||
                    i + 1 > board.length ||
                    j < 0 || i < 0 ||
                    board[ i ][ j ] != 0 ) {
                    return false;
                }
            }
        }
    }
    return true;
};

var freeze = function ( current ) {
    var x = currentX, y = currentY;
    for ( var i = x; i < x + 4; ++i ) {
        for ( var j = y; j < y + 4; ++j ) {
            if ( current[ i - x ][ j - y ] ) {
                board[ i ][ j ] = current[ i - x ][ j - y ];
            }
        }
    }
};

var rotate = function ( current ) {
    var newCurrent = [];
    for ( var i = 0; i < 4; ++i ) {
        newCurrent[ i ] = [];
        for ( var j = 0; j < 4; ++j ) {
            newCurrent[ i ][ j ] = current[ 3 - j ][ i ];
        }
    }
    return newCurrent;
};

var keyPress = function ( key ) {
    switch ( key ) {
        case 37: // h
            if ( valid( currentX - 1, currentY, current ) ) {
                --currentX;
            }
            break;
        case 40: // j
            if ( valid( currentX, currentY + 1, current ) ) {
                ++currentY;
            }
            break;
        case 38: // k
            var rotated = rotate( current );
            if ( valid( currentX, currentY + 1, rotated ) ) {
                current = rotated;
            }
            break;
        case 39: // l
            if ( valid( currentX + 1, currentY, current ) ) {
                ++currentX;
            }
            break;
    }
};
