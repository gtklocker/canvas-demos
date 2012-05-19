var ctx = document.getElementsByTagName( 'canvas' )[ 0 ].getContext( '2d' );
var H = 600, W = 300;
var BLOCK_W = W / 10, BLOCK_H = H / 20;

var render = function () {
    ctx.clearRect( 0, 0, W, H );
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    for ( var y = 0; y < 20; ++y ) {
        for ( var x = 0; x < 10; ++x ) {
            ctx.strokeRect( x * BLOCK_W, y * BLOCK_H, BLOCK_W, BLOCK_H );
            if ( board[ x ][ y ] != 0 ) {
                ctx.fillStyle = board[ x ][ y ];
                ctx.fillRect( x * BLOCK_W, y * BLOCK_H, BLOCK_W - 1, BLOCK_H - 1 );
            }
        }
    }
    for ( var y = currentY; y < currentY + 4; ++y ) {
        for ( var x = currentX; x < currentX + 4; ++x ) {
            if ( current[ x - currentX ][ y - currentY ] != 0 ) {
                ctx.fillStyle = current[ x - currentX ][ y - currentY ];
                ctx.fillRect( x * BLOCK_W, y * BLOCK_H, BLOCK_W - 1, BLOCK_H - 1 );
            }
        }
    }
};

newShape();
render();
setInterval( render, 200 );
setInterval( tick, 200 );
document.onkeypress = function ( e ) {
    console.log( e.keyCode );
    keyPress( e.keyCode );
    render();
};
