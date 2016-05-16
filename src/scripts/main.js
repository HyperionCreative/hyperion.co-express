(function($){
  'use strict';

  // The calculator's logic
  (function(){
    $(document).on('change', 'input[type="radio"]', function () {
      var thisElement = $(this);

      var changeType = thisElement.attr('name');
      var changeValue = thisElement.attr('id');

      if (changeType === 'number-of-pages') {
        if (changeValue === 'number-of-pages-under-five') {
          updatePrice(2000);
        } else if (changeValue === 'number-of-pages-under-ten') {
          updatePrice(2500);
        } else {
          updatePrice(3000);
        }
      }
    });

    function updatePrice(price) {
      $('#order-details__price').html('&pound;' + price + '.00');
    }
  })();
})(window.jQuery);
