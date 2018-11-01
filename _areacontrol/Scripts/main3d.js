 $(function() {
      var showcase = $("#showcase"), title = $('#item-title')

      showcase.Cloud9Carousel( {
        yOrigin: 42,
        yRadius: 80,
        mirror: {
          gap: 12,
          height: 0.2
        },
        buttonLeft: $("#navv > .left"),
        buttonRight: $("#navv > .right"),
        autoPlay: 0,
        bringToFront: true,
        onRendered: rendered,
        onLoaded: function() {
          showcase.css( 'visibility', 'visible' )
          showcase.css( 'display', 'none' )
          showcase.fadeIn( 1000 )
        }
      } )

      function rendered( carousel ) {
        title.text( carousel.nearestItem().element.alt )

        // Fade in based on proximity of the item
        var c = Math.cos((carousel.floatIndex() % 1) * 2 * Math.PI)
        title.css('opacity', 0.5 + (0.5 * c))
      }

      //
      // Simulate physical button click effect
      //
      $('#navv > button').click( function( e ) {
        var b = $(e.target).addClass( 'down' )
        setTimeout( function() { b.removeClass( 'down' ) }, 80 )
      } )

      $(document).keydown( function( e ) {
        //
        // More codes: http://www.javascripter.net/faq/keycodes.htm
        //
        switch( e.keyCode ) {
          /* left arrow */
          case 37:
            $('#navv > .left').click()
            break

          /* right arrow */
          case 39:
            $('#navv > .right').click()
        }
      } )
    })