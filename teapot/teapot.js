var canvas = document.getElementsByTagName( "canvas" )[ 0 ];
var ctx = canvas.getContext( "2d" );

var W = 800, H = 600, nH = H * 1.15;

var VIEWPORT_SCALE = W / 2;
var VIEWPORT_OFFSET = W / 2;
function drawTriangle( ctx, a, b, c, color ) {
    ctx.strokeStyle = "gray";
    ctx.fillStyle = flatShading( a, b, c );
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
            nH - ( VIEWPORT_SCALE * point[ 1 ] + VIEWPORT_OFFSET )
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

function flatShading( a, b, c ) {
    a = $V( [ a[ 0 ], a[ 1 ], a[ 2 ] ] );
    b = $V( [ b[ 0 ], b[ 1 ], b[ 2 ] ] );
    c = $V( [ c[ 0 ], c[ 1 ], c[ 2 ] ] );

    var ab = b.subtract( a );
    var ac = c.subtract( a );
    var n = ab.cross( ac );
    n = n.multiply( 1 / n.distanceFrom( $V( [ 0, 0, 0 ] ) ) );
    var d = n.dot( $V( [ 0, 0, 1 ] ) );
    var v = Math.floor( 255 * d );

    return 'rgb(' + v + ', ' + v + ', ' + v + ')';
}

var ccw = function ( a, b, c ) {
    return ( b[ 0 ] - a[ 0 ] ) * ( c[ 1 ] - a[ 1 ] ) - ( b[ 1 ] - a[ 1 ] ) * ( c[ 0 ] - a[ 0 ] );
};

var project = [
    [ 0.5, 0, 0, 0 ],
    [ 0, 0.5, 0, 0 ],
    [ 0, 0, -0.2, 0 ],
    [ 0, 0, 45, 1 ]
];

var vertices = [];
for ( var i = 0, j = 0; j < oldVertices.length / 3; ++j, i += 3 ) {
    vertices[ j ] = [ oldVertices[ i ], oldVertices[ i + 1 ], oldVertices[ i + 2 ], 1 ];
}

var indices = [];
for ( var i = 0, j = 0; j < oldIndices.length / 3; ++j, i += 3 ) {
    indices[ j ] = [ oldIndices[ i ], oldIndices[ i + 1 ], oldIndices[ i + 2 ] ];
}

var thetaX = 0.0, thetaY = 0.0;

var sortIndices = function () {
    indices.sort( function ( a, b ) {
        var z1 = 0;
        for ( var i = 0; i < 3; ++i ) {
            z1 += vertices[ a[ i ] ][ 2 ];
        }

        var z2 = 0;
        for ( var i = 0; i < 3; ++i ) {
            z2 += vertices[ b[ i ] ][ 2 ];
        }

        return z1 - z2;
    } );
};
sortIndices();

var render = function () {
    ctx.clearRect( 0, 0, W, H );
    // Rotation matrices from http://mariosal.logimus.com/graphics-examples/cube/
    var rotateX = [
        [ 1, 0,                   0,                   0 ],
        [ 0, Math.cos( thetaX ),  Math.sin( thetaX ),  0 ],
        [ 0, -Math.sin( thetaX ), Math.cos( thetaX ),  0 ],
        [ 0, 0,                   0,                   1 ]
    ];
    var rotateY = [
        [ Math.cos( thetaY ), 0, -Math.sin( thetaY ), 0 ],
        [ 0,                  1, 0,                   0 ],
        [ Math.sin( thetaY ), 0, Math.cos( thetaY ),  0 ],
        [ 0,                  0, 0,                   1 ]
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

        var clr = flatShading( a, b, c );
        if ( ccw( a, b, c ) > 0 ) {
            drawTriangle( ctx, a, b, c, clr );
        }
    }
}
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
        sortIndices();
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

document.onmousewheel = function ( e ) {
    var delta = e.wheelDelta / 1200;
    project[ 0 ][ 0 ] += delta;
    project[ 1 ][ 1 ] += delta;
    render();
};
