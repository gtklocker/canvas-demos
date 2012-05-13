var canvas = document.getElementById( "canv" );
var ctx = canvas.getContext( "2d" );

var VIEWPORT_SCALE = 400;
var VIEWPORT_OFFSET = 400;
function drawTriangle( ctx, a, b, c, color ) {
    ctx.strokeStyle = 'black';
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
            800 - ( VIEWPORT_SCALE * point[ 1 ] + VIEWPORT_OFFSET )
        ];
    };
    a = viewportTransform( a );
    b = viewportTransform( b );
    c = viewportTransform( c );

    ctx.moveTo( a[ 0 ], a[ 1 ] );
    ctx.lineTo( b[ 0 ], b[ 1 ] );
    ctx.lineTo( c[ 0 ], c[ 1 ] );
    ctx.closePath();
    //ctx.fill();
    ctx.stroke();
}

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

vertices = $M( vertices ).x( $M( project ) ).elements;

for ( var index = 0; index < indices.length; ++index ) {
    var v = function ( i ) {
        return vertices[ indices[ index ][ i ] ];
    };
    drawTriangle( ctx, v( 0 ), v( 1 ), v( 2 ), "black" );
}
