(function ($) {
  'use strict';

  // The calculator's logic
  (function () {
    var BASE_PRICE = 2000;
    var PRICE_OPTIONS = {
      'website-type': {
        'new': 500,
        'redesign': 0
      },
      'number-of-pages': {
        'under-five': 0,
        'under-ten': 500,
        'above-ten': 1000
      },
      'give-credits': {
        'yes': -250,
        'no': 0
      }
    };
    var PRICE_OPTIONS_KEYS = Object.keys(PRICE_OPTIONS);

    var selectedOptionsPrice = BASE_PRICE;
    var selectedOptions = {
      'website-type': 'redesign',
      'number-of-pages': 'under-five',
      'give-credits': 'no'
    };

    var summaryElements = {
      'website-type': $('#order-details__website-type'),
      'number-of-pages': $('#order-details__number-of-pages'),
      'need-cms': $('#order-details__need-cms'),
    };

    $(document).on('change', 'input[type="radio"]', function () {
      var thisElement = $(this);

      var inputName = thisElement.attr('name');
      var inputId = thisElement.attr('id');

      var desiredOption = inputId.replace(inputName + '-', '');

      // Updates the price
      (function () {
        if (PRICE_OPTIONS_KEYS.indexOf(inputName) === -1) {
          // An option which doesn't affect the price!
        } else {
          if (selectedOptions[inputName] === desiredOption) {
            // The option is already selected and a price update is unnecessary
          } else {
            var oldOption = selectedOptions[inputName];
            selectedOptions[inputName] = desiredOption;

            var oldPriceModifier = PRICE_OPTIONS[inputName][oldOption];
            var newPriceModifier = PRICE_OPTIONS[inputName][desiredOption];

            selectedOptionsPrice -= oldPriceModifier;
            selectedOptionsPrice += newPriceModifier;

            $('#order-details__price').html('&pound;' + selectedOptionsPrice + '.00');
          }
        }
      })();

      // Sets the order summary
      (function () {
        if (inputName === 'website-type') {
          summaryElements[inputName].text(desiredOption === 'new' ? 'New Project' : 'Redesign Project');
        } else if (inputName === 'number-of-pages') {
          summaryElements[inputName].text(desiredOption === 'under-five' ? '1-5 Pages' : (desiredOption === 'under-ten' ? '5-10 Pages' : '10+ Pages'));
        } else if (inputName === 'need-cms') {
          summaryElements[inputName].text(desiredOption === 'yes' ? 'Built with CMS' : (desiredOption === 'no' ? 'Built without CMS' : 'Unsure about CMS'));
        }
      })();

      // Paginates the order summary
      (function () {
        var websiteTypeSummary = summaryElements['website-type'].text();
        var numberOfPagesSummary = summaryElements['number-of-pages'].text();
        var needCmsSummary = summaryElements['need-cms'].text();

        if (websiteTypeSummary.length > 0 && numberOfPagesSummary.length > 0) {
          $('#order-details__first-comma').show();
        } else {
          $('#order-details__first-comma').hide();
        }

        // Adds a new line if the first one is present
        if ((websiteTypeSummary.length > 0 || numberOfPagesSummary.length > 0) && needCmsSummary.length > 0) {
          $('#order-details__first-line-breaker').show();
        } else {
          $('#order-details__first-line-breaker').hide();
        }
      })();
    });
  })();
})(window.jQuery);
