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
( function () {
    for ( var x = 0; x < 10; ++x ) {
        board[ x ] = [];
        for ( var y = 0; y < 20; ++y ) {
            board[ x ][ y ] = 0;
        }
    }
} )();

var current = [];
( function () {
    for ( var x = 0; x < 4; ++x ) {
        current[ x ] = [];
        for ( var y = 0; y < 4; ++y ) {
            current[ x ][ y ] = 0;
        }
    }
} )();

var currentY = 0, currentX = 4;

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
    currentX = 5;
    currentY = 0;
};

var tick = function () {
    if ( valid( currentX, currentY + 1, current ) ) {
        ++currentY;
    }
    else {
        freeze( current );
        newShape();
    }
};

var valid = function ( x, y, current ) {
    for ( var i = x; i < x + 4; ++i ) {
        for ( var j = y; j < y + 4; ++j ) {
            if ( current[ i - x ][ j - y ] ) {
                if ( board[ i ][ j ] ||
                    j < 0 || i < 0 ||
                    i + 1 > board.length ||
                    j + 1 > board[ i ].length ) {
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
        case 104: // h
            if ( valid( currentX - 1, currentY, current ) ) {
                --currentX;
            }
            break;
        case 106: // j
            if ( valid( currentX, currentY + 1, current ) ) {
                ++currentY;
            }
            break;
        case 107: // k
            var rotated = rotate( current );
            if ( valid( currentX, currentY + 1, rotated ) ) {
                current = rotated;
            }
            break;
        case 108: // l
            if ( valid( currentX + 1, currentY, current ) ) {
                ++currentX;
            }
            break;
    }
};
