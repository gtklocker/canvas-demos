var Sine = function( canvas ) {
    canvas.width = window.innerWidth - 2;
    canvas.height = 200;
    this.ctx = canvas.getContext( '2d' );
    this.W = canvas.width;
    this.H = canvas.height;
    this.theta = 10 * Math.PI;
    this.moves = 0;
    var self = this;

    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 2;
    setInterval( function() {
        self.moves = 0;
        self.ctx.clearRect( 0, 0, self.W, self.H );

        self.ctx.beginPath();
        for ( var phi = self.theta; phi <= 2 * self.theta; phi += Math.PI / 18 ) {
            self.line( phi - self.theta, Math.sin( phi ) );
        }
        self.ctx.stroke();
        self.theta += 0.1;
    }, 20 );
};

Sine.prototype = {
    translate: function( x, y ) {
        return {
            x: x * 50,
            y: 100 + y * 50
        };
    },

    line: function( x, y ) {
        trans = this.translate( x, y );
        if ( !this.moves ) {
            this.ctx.moveTo( trans.x, trans.y );
        }
        else {
            this.ctx.lineTo( trans.x, trans.y );
        }

        ++this.moves;
    }
};
