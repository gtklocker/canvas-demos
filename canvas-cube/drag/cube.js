var canvas = document.getElementsByTagName( "canvas" )[ 0 ];
var ctx = canvas.getContext( "2d" );

var W = 800, H = 600;

var VIEWPORT_SCALE = W / 2;
var VIEWPORT_OFFSET = W / 2;
function drawTriangle( ctx, a, b, c, color ) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    var finalProjection = function ( point ) {
        return [
            point[ 0 ] / point[ 2 ],
            point[ 1 ] / point[ 2 ]
        ];
    };
    var viewportTransform = function ( point ) {
        point = finalProjection( point );
        return [
            VIEWPORT_SCALE * point[ 0 ] + VIEWPORT_OFFSET,
            H - ( VIEWPORT_SCALE * point[ 1 ] + VIEWPORT_OFFSET )
        ];
    };
    a = viewportTransform( a );
    b = viewportTransform( b );
    c = viewportTransform( c );

    ctx.moveTo( a[ 0 ], a[ 1 ] );
    ctx.lineTo( b[ 0 ], b[ 1 ] );
    ctx.lineTo( c[ 0 ], c[ 1 ] );
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

var ccw = function ( a, b, c ) {
    return ( b[ 0 ] - a[ 0 ] ) * ( c[ 1 ] - a[ 1 ] ) - ( b[ 1 ] - a[ 1 ] ) * ( c[ 0 ] - a[ 0 ] );
};

var vertices = [
    [ -1, 1, 1, 1 ],
    [ 1, 1, 1, 1 ],
    [ 1, -1, 1, 1 ],
    [ -1, -1, 1, 1 ],
    [ -1, 1, -1, 1 ],
    [ 1, 1, -1, 1  ],
    [ 1, -1, -1, 1 ],
    [ -1, -1, -1, 1 ]
];

var indices = [
    // front
    [ 0, 3, 1 ],
    [ 2, 1, 3 ],

    // back
    [ 4, 5, 7 ],
    [ 6, 7, 5 ],

    // right
    [ 2, 5, 1 ],
    [ 2, 6, 5 ],

    // left
    [ 3, 0, 4 ],
    [ 3, 4, 7 ],

    // top
    [ 0, 5, 4 ],
    [ 0, 1, 5 ],

    // bottom
    [ 3, 7, 6 ],
    [ 3, 6, 2 ]
];

var project = [
    [ 1, 0, 0, 0 ],
    [ 0, 1, 0, 0 ],
    [ 0, 0, -0.5, 0 ],
    [ 0, 0, 4, 1 ]
];

var colors = [ "gray", "blue", "red", "orange", "purple", "white" ];
var render = function () {
    ctx.clearRect( 0, 0, W, H );
    // Rotation matrices from http://mariosal.logimus.com/graphics-examples/cube/
    var rotateX = [
        [ 1, 0,                  0,                  0 ],
        [ 0, Math.cos( thetaX ),  Math.sin( thetaX ),  0 ],
        [ 0, -Math.sin( thetaX ), Math.cos( thetaX ),  0 ],
        [ 0, 0,                  0,                  1 ]
    ];
    var rotateY = [
        [ Math.cos( thetaY ), 0, -Math.sin( thetaY ), 0 ],
        [ 0,                 1, 0,                  0 ],
        [ Math.sin( thetaY ), 0, Math.cos( thetaY ),  0 ],
        [ 0,                 0, 0,                  1 ]
    ];
    vertices = $M( vertices ).x( $M( rotateX ) ).elements;
    vertices = $M( vertices ).x( $M( rotateY ) ).elements;
    var projectVertices = $M( vertices ).x( $M( project ) ).elements;

    for ( var index = 0; index < indices.length; ++index ) {
        var v = function ( i ) {
            return projectVertices[ indices[ index ][ i ] ];
        };
        var a = v( 0 );
        var b = v( 1 );
        var c = v( 2 );

        if ( ccw( a, b, c ) > 0.5 ) {
            drawTriangle( ctx, a, b, c, colors[ index / 2 ] );
        }
    }
}
var thetaX = 0.0, thetaY = 0.0;
render();

var mousePos, oldTheta;
document.onmousedown = function ( e ) {
    mousePos = {
        x: e.clientX,
        y: e.clientY
    };
    document.onmousemove = function ( e ) {
        thetaY = -( mousePos.x - e.clientX ) / 100;
        thetaX = -( mousePos.y - e.clientY ) / 100;
        render();
        mousePos = {
            x: e.clientX,
            y: e.clientY
        };
    };
};

document.onmouseup = function ( e ) {
    thetaX = 0.0;
    thetaY = 0.0;
    document.onmousemove = function ( e ) {
    }
};
