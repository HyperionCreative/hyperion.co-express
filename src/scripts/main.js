(function ($) {
  'use strict';

  // Form submission logic
  (function () {
    $(document).on('submit', '#calculator-form', function (event) {
      var thisElement = $(this);

      var formData = thisElement.serializeObject();
      var errorMessage = getErrorMessage(formData);

      if (errorMessage === null) {
        $('.error-message').removeClass('show');

        $.ajax({
          type: 'post',
          url: 'http://localhost:9001/php/email-sender.php',

          dataType: 'json',
          data: {
            shownPrice: $('.order-details .order-details__price').eq(0).text(),
            formData: thisElement.serialize()
          },

          error: function () {
            $('#calculator-page').html('<h2 class="title calculator-page__message">Something went wrong. You could try contacting us <a href="http://www.hyperion.co/contact/">here</a>.<h2>');
            $('#calculator-page').addClass('big-message');
          },
          success: function () {
            $('#calculator-page').html('<h2 class="title calculator-page__message">We got your details and we\'ll be in touch within one day (usually a few hours).<h2>');
            $('#calculator-page').addClass('big-message');
          }
        });
      } else {
        $('.error-message > .error-message__text').text(errorMessage);
        $('.error-message').addClass('show');
      }

      event.preventDefault();
    });

    $(document).on('change, input', '#calculator-form', function () {
      var thisElement = $(this);

      var formData = thisElement.serializeObject();
      var errorMessage = getErrorMessage(formData);

      if (errorMessage === null) {
        $('.error-message').removeClass('show');
      } else if ($('.error-message').hasClass('show')) {
        $('.error-message > .error-message__text').text(errorMessage);
      }
    });

    $(document).on('click', '.calculator-summary .submit-calculator', function () {
      $('#calculator-form').submit();
    });

    // http://stackoverflow.com/questions/1184624/convert-form-data-to-javascript-object-with-jquery
    $.fn.serializeObject = function () {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function () {
        if (o[this.name] !== undefined) {
          if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
        } else {
          o[this.name] = this.value || '';
        }
      });
      return o;
    };

    // http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
    function validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    function getErrorMessage(formData) {
      if (Object.keys(formData).length !== 6 || formData.email.length === 0) {
        return 'All fields are mandatory';
      } else if (!validateEmail(formData.email)) {
        return 'The email address is not valid';
      } else {
        return null;
      }
    }
  })();

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
      'website-type': $('.order-details__website-type'),
      'number-of-pages': $('.order-details__number-of-pages'),
      'need-cms': $('.order-details__need-cms'),
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

            $('.order-details__price').html('&pound;' + selectedOptionsPrice + '.00');
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
          $('.order-details__first-comma').show();
        } else {
          $('.order-details__first-comma').hide();
        }

        // Adds a new line if the first one is present
        if ((websiteTypeSummary.length > 0 || numberOfPagesSummary.length > 0) && needCmsSummary.length > 0) {
          $('.order-details__first-line-breaker').show();
        } else {
          $('.order-details__first-line-breaker').hide();
        }
      })();
    });
  })();
})(window.jQuery);
