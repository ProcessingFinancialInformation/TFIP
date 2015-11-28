/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.14.3 - 2015-10-23
 * License: MIT
 */
angular.module("ui.bootstrap", ["ui.bootstrap.tpls","ui.bootstrap.typeahead","ui.bootstrap.position","ui.bootstrap.modal","ui.bootstrap.stackedMap","ui.bootstrap.datepicker","ui.bootstrap.dateparser","ui.bootstrap.pagination"]);
angular.module("ui.bootstrap.tpls", ["template/typeahead/typeahead-match.html","template/typeahead/typeahead-popup.html","template/modal/backdrop.html","template/modal/window.html","template/datepicker/datepicker.html","template/datepicker/day.html","template/datepicker/month.html","template/datepicker/popup.html","template/datepicker/year.html","template/pagination/pager.html","template/pagination/pagination.html"]);
angular.module('ui.bootstrap.typeahead', ['ui.bootstrap.position'])

/**
 * A helper service that can parse typeahead's syntax (string provided by users)
 * Extracted to a separate service for ease of unit testing
 */
  .factory('uibTypeaheadParser', ['$parse', function($parse) {
    //                      00000111000000000000022200000000000000003333333333333330000000000044000
    var TYPEAHEAD_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w\d]*))\s+in\s+([\s\S]+?)$/;
    return {
      parse: function(input) {
        var match = input.match(TYPEAHEAD_REGEXP);
        if (!match) {
          throw new Error(
            'Expected typeahead specification in form of "_modelValue_ (as _label_)? for _item_ in _collection_"' +
              ' but got "' + input + '".');
        }

        return {
          itemName: match[3],
          source: $parse(match[4]),
          viewMapper: $parse(match[2] || match[1]),
          modelMapper: $parse(match[1])
        };
      }
    };
  }])

  .controller('UibTypeaheadController', ['$scope', '$element', '$attrs', '$compile', '$parse', '$q', '$timeout', '$document', '$window', '$rootScope', '$uibPosition', 'uibTypeaheadParser',
    function(originalScope, element, attrs, $compile, $parse, $q, $timeout, $document, $window, $rootScope, $position, typeaheadParser) {
    var HOT_KEYS = [9, 13, 27, 38, 40];
    var eventDebounceTime = 200;
    var modelCtrl, ngModelOptions;
    //SUPPORTED ATTRIBUTES (OPTIONS)

    //minimal no of characters that needs to be entered before typeahead kicks-in
    var minLength = originalScope.$eval(attrs.typeaheadMinLength);
    if (!minLength && minLength !== 0) {
      minLength = 1;
    }

    //minimal wait time after last character typed before typeahead kicks-in
    var waitTime = originalScope.$eval(attrs.typeaheadWaitMs) || 0;

    //should it restrict model values to the ones selected from the popup only?
    var isEditable = originalScope.$eval(attrs.typeaheadEditable) !== false;

    //binding to a variable that indicates if matches are being retrieved asynchronously
    var isLoadingSetter = $parse(attrs.typeaheadLoading).assign || angular.noop;

    //a callback executed when a match is selected
    var onSelectCallback = $parse(attrs.typeaheadOnSelect);

    //should it select highlighted popup value when losing focus?
    var isSelectOnBlur = angular.isDefined(attrs.typeaheadSelectOnBlur) ? originalScope.$eval(attrs.typeaheadSelectOnBlur) : false;

    //binding to a variable that indicates if there were no results after the query is completed
    var isNoResultsSetter = $parse(attrs.typeaheadNoResults).assign || angular.noop;

    var inputFormatter = attrs.typeaheadInputFormatter ? $parse(attrs.typeaheadInputFormatter) : undefined;

    var appendToBody =  attrs.typeaheadAppendToBody ? originalScope.$eval(attrs.typeaheadAppendToBody) : false;

    var appendToElementId =  attrs.typeaheadAppendToElementId || false;

    var focusFirst = originalScope.$eval(attrs.typeaheadFocusFirst) !== false;

    //If input matches an item of the list exactly, select it automatically
    var selectOnExact = attrs.typeaheadSelectOnExact ? originalScope.$eval(attrs.typeaheadSelectOnExact) : false;

    //INTERNAL VARIABLES

    //model setter executed upon match selection
    var parsedModel = $parse(attrs.ngModel);
    var invokeModelSetter = $parse(attrs.ngModel + '($$$p)');
    var $setModelValue = function(scope, newValue) {
      if (angular.isFunction(parsedModel(originalScope)) &&
        ngModelOptions && ngModelOptions.$options && ngModelOptions.$options.getterSetter) {
        return invokeModelSetter(scope, {$$$p: newValue});
      } else {
        return parsedModel.assign(scope, newValue);
      }
    };

    //expressions used by typeahead
    var parserResult = typeaheadParser.parse(attrs.uibTypeahead);

    var hasFocus;

    //Used to avoid bug in iOS webview where iOS keyboard does not fire
    //mousedown & mouseup events
    //Issue #3699
    var selected;

    //create a child scope for the typeahead directive so we are not polluting original scope
    //with typeahead-specific data (matches, query etc.)
    var scope = originalScope.$new();
    var offDestroy = originalScope.$on('$destroy', function() {
      scope.$destroy();
    });
    scope.$on('$destroy', offDestroy);

    // WAI-ARIA
    var popupId = 'typeahead-' + scope.$id + '-' + Math.floor(Math.random() * 10000);
    element.attr({
      'aria-autocomplete': 'list',
      'aria-expanded': false,
      'aria-owns': popupId
    });

    //pop-up element used to display matches
    var popUpEl = angular.element('<div uib-typeahead-popup></div>');
    popUpEl.attr({
      id: popupId,
      matches: 'matches',
      active: 'activeIdx',
      select: 'select(activeIdx)',
      'move-in-progress': 'moveInProgress',
      query: 'query',
      position: 'position'
    });
    //custom item template
    if (angular.isDefined(attrs.typeaheadTemplateUrl)) {
      popUpEl.attr('template-url', attrs.typeaheadTemplateUrl);
    }

    if (angular.isDefined(attrs.typeaheadPopupTemplateUrl)) {
      popUpEl.attr('popup-template-url', attrs.typeaheadPopupTemplateUrl);
    }

    var resetMatches = function() {
      scope.matches = [];
      scope.activeIdx = -1;
      element.attr('aria-expanded', false);
    };

    var getMatchId = function(index) {
      return popupId + '-option-' + index;
    };

    // Indicate that the specified match is the active (pre-selected) item in the list owned by this typeahead.
    // This attribute is added or removed automatically when the `activeIdx` changes.
    scope.$watch('activeIdx', function(index) {
      if (index < 0) {
        element.removeAttr('aria-activedescendant');
      } else {
        element.attr('aria-activedescendant', getMatchId(index));
      }
    });

    var inputIsExactMatch = function(inputValue, index) {
      if (scope.matches.length > index && inputValue) {
        return inputValue.toUpperCase() === scope.matches[index].label.toUpperCase();
      }

      return false;
    };

    var getMatchesAsync = function(inputValue) {
      var locals = {$viewValue: inputValue};
      isLoadingSetter(originalScope, true);
      isNoResultsSetter(originalScope, false);
      $q.when(parserResult.source(originalScope, locals)).then(function(matches) {
        //it might happen that several async queries were in progress if a user were typing fast
        //but we are interested only in responses that correspond to the current view value
        var onCurrentRequest = (inputValue === modelCtrl.$viewValue);
        if (onCurrentRequest && hasFocus) {
          if (matches && matches.length > 0) {
            scope.activeIdx = focusFirst ? 0 : -1;
            isNoResultsSetter(originalScope, false);
            scope.matches.length = 0;

            //transform labels
            for (var i = 0; i < matches.length; i++) {
              locals[parserResult.itemName] = matches[i];
              scope.matches.push({
                id: getMatchId(i),
                label: parserResult.viewMapper(scope, locals),
                model: matches[i]
              });
            }

            scope.query = inputValue;
            //position pop-up with matches - we need to re-calculate its position each time we are opening a window
            //with matches as a pop-up might be absolute-positioned and position of an input might have changed on a page
            //due to other elements being rendered
            recalculatePosition();

            element.attr('aria-expanded', true);

            //Select the single remaining option if user input matches
            if (selectOnExact && scope.matches.length === 1 && inputIsExactMatch(inputValue, 0)) {
              scope.select(0);
            }
          } else {
            resetMatches();
            isNoResultsSetter(originalScope, true);
          }
        }
        if (onCurrentRequest) {
          isLoadingSetter(originalScope, false);
        }
      }, function() {
        resetMatches();
        isLoadingSetter(originalScope, false);
        isNoResultsSetter(originalScope, true);
      });
    };

    // bind events only if appendToBody params exist - performance feature
    if (appendToBody) {
      angular.element($window).bind('resize', fireRecalculating);
      $document.find('body').bind('scroll', fireRecalculating);
    }

    // Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later
    var timeoutEventPromise;

    // Default progress type
    scope.moveInProgress = false;

    function fireRecalculating() {
      if (!scope.moveInProgress) {
        scope.moveInProgress = true;
        scope.$digest();
      }

      // Cancel previous timeout
      if (timeoutEventPromise) {
        $timeout.cancel(timeoutEventPromise);
      }

      // Debounced executing recalculate after events fired
      timeoutEventPromise = $timeout(function() {
        // if popup is visible
        if (scope.matches.length) {
          recalculatePosition();
        }

        scope.moveInProgress = false;
      }, eventDebounceTime);
    }

    // recalculate actual position and set new values to scope
    // after digest loop is popup in right position
    function recalculatePosition() {
      scope.position = appendToBody ? $position.offset(element) : $position.position(element);
      scope.position.top += element.prop('offsetHeight');
    }

    //we need to propagate user's query so we can higlight matches
    scope.query = undefined;

    //Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later
    var timeoutPromise;

    var scheduleSearchWithTimeout = function(inputValue) {
      timeoutPromise = $timeout(function() {
        getMatchesAsync(inputValue);
      }, waitTime);
    };

    var cancelPreviousTimeout = function() {
      if (timeoutPromise) {
        $timeout.cancel(timeoutPromise);
      }
    };

    resetMatches();

    scope.select = function(activeIdx) {
      //called from within the $digest() cycle
      var locals = {};
      var model, item;

      selected = true;
      locals[parserResult.itemName] = item = scope.matches[activeIdx].model;
      model = parserResult.modelMapper(originalScope, locals);
      $setModelValue(originalScope, model);
      modelCtrl.$setValidity('editable', true);
      modelCtrl.$setValidity('parse', true);

      onSelectCallback(originalScope, {
        $item: item,
        $model: model,
        $label: parserResult.viewMapper(originalScope, locals)
      });

      resetMatches();

      //return focus to the input element if a match was selected via a mouse click event
      // use timeout to avoid $rootScope:inprog error
      if (scope.$eval(attrs.typeaheadFocusOnSelect) !== false) {
        $timeout(function() { element[0].focus(); }, 0, false);
      }
    };

    //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
    element.bind('keydown', function(evt) {
      //typeahead is open and an "interesting" key was pressed
      if (scope.matches.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
        return;
      }

      // if there's nothing selected (i.e. focusFirst) and enter or tab is hit, clear the results
      if (scope.activeIdx === -1 && (evt.which === 9 || evt.which === 13)) {
        resetMatches();
        scope.$digest();
        return;
      }

      evt.preventDefault();

      if (evt.which === 40) {
        scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length;
        scope.$digest();
      } else if (evt.which === 38) {
        scope.activeIdx = (scope.activeIdx > 0 ? scope.activeIdx : scope.matches.length) - 1;
        scope.$digest();
      } else if (evt.which === 13 || evt.which === 9) {
        scope.$apply(function () {
          scope.select(scope.activeIdx);
        });
      } else if (evt.which === 27) {
        evt.stopPropagation();

        resetMatches();
        scope.$digest();
      }
    });

    element.bind('blur', function() {
      if (isSelectOnBlur && scope.matches.length && scope.activeIdx !== -1 && !selected) {
        selected = true;
        scope.$apply(function() {
          scope.select(scope.activeIdx);
        });
      }
      hasFocus = false;
      selected = false;
    });

    // Keep reference to click handler to unbind it.
    var dismissClickHandler = function(evt) {
      // Issue #3973
      // Firefox treats right click as a click on document
      if (element[0] !== evt.target && evt.which !== 3 && scope.matches.length !== 0) {
        resetMatches();
        if (!$rootScope.$$phase) {
          scope.$digest();
        }
      }
    };

    $document.bind('click', dismissClickHandler);

    originalScope.$on('$destroy', function() {
      $document.unbind('click', dismissClickHandler);
      if (appendToBody || appendToElementId) {
        $popup.remove();
      }

      if (appendToBody) {
        angular.element($window).unbind('resize', fireRecalculating);
        $document.find('body').unbind('scroll', fireRecalculating);
      }
      // Prevent jQuery cache memory leak
      popUpEl.remove();
    });

    var $popup = $compile(popUpEl)(scope);

    if (appendToBody) {
      $document.find('body').append($popup);
    } else if (appendToElementId !== false) {
      angular.element($document[0].getElementById(appendToElementId)).append($popup);
    } else {
      element.after($popup);
    }

    this.init = function(_modelCtrl, _ngModelOptions) {
      modelCtrl = _modelCtrl;
      ngModelOptions = _ngModelOptions;

      //plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
      //$parsers kick-in on all the changes coming from the view as well as manually triggered by $setViewValue
      modelCtrl.$parsers.unshift(function(inputValue) {
        hasFocus = true;

        if (minLength === 0 || inputValue && inputValue.length >= minLength) {
          if (waitTime > 0) {
            cancelPreviousTimeout();
            scheduleSearchWithTimeout(inputValue);
          } else {
            getMatchesAsync(inputValue);
          }
        } else {
          isLoadingSetter(originalScope, false);
          cancelPreviousTimeout();
          resetMatches();
        }

        if (isEditable) {
          return inputValue;
        } else {
          if (!inputValue) {
            // Reset in case user had typed something previously.
            modelCtrl.$setValidity('editable', true);
            return null;
          } else {
            modelCtrl.$setValidity('editable', false);
            return undefined;
          }
        }
      });

      modelCtrl.$formatters.push(function(modelValue) {
        var candidateViewValue, emptyViewValue;
        var locals = {};

        // The validity may be set to false via $parsers (see above) if
        // the model is restricted to selected values. If the model
        // is set manually it is considered to be valid.
        if (!isEditable) {
          modelCtrl.$setValidity('editable', true);
        }

        if (inputFormatter) {
          locals.$model = modelValue;
          return inputFormatter(originalScope, locals);
        } else {
          //it might happen that we don't have enough info to properly render input value
          //we need to check for this situation and simply return model value if we can't apply custom formatting
          locals[parserResult.itemName] = modelValue;
          candidateViewValue = parserResult.viewMapper(originalScope, locals);
          locals[parserResult.itemName] = undefined;
          emptyViewValue = parserResult.viewMapper(originalScope, locals);

          return candidateViewValue !== emptyViewValue ? candidateViewValue : modelValue;
        }
      });
    };
  }])

  .directive('uibTypeahead', function() {
    return {
      controller: 'UibTypeaheadController',
      require: ['ngModel', '^?ngModelOptions', 'uibTypeahead'],
      link: function(originalScope, element, attrs, ctrls) {
        ctrls[2].init(ctrls[0], ctrls[1]);
      }
    };
  })

  .directive('uibTypeaheadPopup', function() {
    return {
      scope: {
        matches: '=',
        query: '=',
        active: '=',
        position: '&',
        moveInProgress: '=',
        select: '&'
      },
      replace: true,
      templateUrl: function(element, attrs) {
        return attrs.popupTemplateUrl || 'template/typeahead/typeahead-popup.html';
      },
      link: function(scope, element, attrs) {
        scope.templateUrl = attrs.templateUrl;

        scope.isOpen = function() {
          return scope.matches.length > 0;
        };

        scope.isActive = function(matchIdx) {
          return scope.active == matchIdx;
        };

        scope.selectActive = function(matchIdx) {
          scope.active = matchIdx;
        };

        scope.selectMatch = function(activeIdx) {
          scope.select({activeIdx:activeIdx});
        };
      }
    };
  })

  .directive('uibTypeaheadMatch', ['$templateRequest', '$compile', '$parse', function($templateRequest, $compile, $parse) {
    return {
      scope: {
        index: '=',
        match: '=',
        query: '='
      },
      link:function(scope, element, attrs) {
        var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || 'template/typeahead/typeahead-match.html';
        $templateRequest(tplUrl).then(function(tplContent) {
          $compile(tplContent.trim())(scope, function(clonedElement) {
            element.replaceWith(clonedElement);
          });
        });
      }
    };
  }])

  .filter('uibTypeaheadHighlight', ['$sce', '$injector', '$log', function($sce, $injector, $log) {
    var isSanitizePresent;
    isSanitizePresent = $injector.has('$sanitize');

    function escapeRegexp(queryToEscape) {
      // Regex: capture the whole query string and replace it with the string that will be used to match
      // the results, for example if the capture is "a" the result will be \a
      return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }

    function containsHtml(matchItem) {
      return /<.*>/g.test(matchItem);
    }

    return function(matchItem, query) {
      if (!isSanitizePresent && containsHtml(matchItem)) {
        $log.warn('Unsafe use of typeahead please use ngSanitize'); // Warn the user about the danger
      }
      matchItem = query? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem; // Replaces the capture string with a the same string inside of a "strong" tag
      if (!isSanitizePresent) {
        matchItem = $sce.trustAsHtml(matchItem); // If $sanitize is not present we pack the string in a $sce object for the ng-bind-html directive
      }
      return matchItem;
    };
  }]);

/* Deprecated typeahead below */
  
angular.module('ui.bootstrap.typeahead')
  .value('$typeaheadSuppressWarning', false)
  .service('typeaheadParser', ['$parse', 'uibTypeaheadParser', '$log', '$typeaheadSuppressWarning', function($parse, uibTypeaheadParser, $log, $typeaheadSuppressWarning) {
    if (!$typeaheadSuppressWarning) {
      $log.warn('typeaheadParser is now deprecated. Use uibTypeaheadParser instead.');
    }

    return uibTypeaheadParser;
  }])

  .directive('typeahead', ['$compile', '$parse', '$q', '$timeout', '$document', '$window', '$rootScope', '$uibPosition', 'typeaheadParser', '$log', '$typeaheadSuppressWarning',
    function($compile, $parse, $q, $timeout, $document, $window, $rootScope, $position, typeaheadParser, $log, $typeaheadSuppressWarning) {
    var HOT_KEYS = [9, 13, 27, 38, 40];
    var eventDebounceTime = 200;
    return {
      require: ['ngModel', '^?ngModelOptions'],
      link: function(originalScope, element, attrs, ctrls) {
        if (!$typeaheadSuppressWarning) {
          $log.warn('typeahead is now deprecated. Use uib-typeahead instead.');
        }
        var modelCtrl = ctrls[0];
        var ngModelOptions = ctrls[1];
        //SUPPORTED ATTRIBUTES (OPTIONS)

        //minimal no of characters that needs to be entered before typeahead kicks-in
        var minLength = originalScope.$eval(attrs.typeaheadMinLength);
        if (!minLength && minLength !== 0) {
          minLength = 1;
        }

        //minimal wait time after last character typed before typeahead kicks-in
        var waitTime = originalScope.$eval(attrs.typeaheadWaitMs) || 0;

        //should it restrict model values to the ones selected from the popup only?
        var isEditable = originalScope.$eval(attrs.typeaheadEditable) !== false;

        //binding to a variable that indicates if matches are being retrieved asynchronously
        var isLoadingSetter = $parse(attrs.typeaheadLoading).assign || angular.noop;

        //a callback executed when a match is selected
        var onSelectCallback = $parse(attrs.typeaheadOnSelect);

        //should it select highlighted popup value when losing focus?
        var isSelectOnBlur = angular.isDefined(attrs.typeaheadSelectOnBlur) ? originalScope.$eval(attrs.typeaheadSelectOnBlur) : false;

        //binding to a variable that indicates if there were no results after the query is completed
        var isNoResultsSetter = $parse(attrs.typeaheadNoResults).assign || angular.noop;

        var inputFormatter = attrs.typeaheadInputFormatter ? $parse(attrs.typeaheadInputFormatter) : undefined;

        var appendToBody =  attrs.typeaheadAppendToBody ? originalScope.$eval(attrs.typeaheadAppendToBody) : false;

        var appendToElementId =  attrs.typeaheadAppendToElementId || false;

        var focusFirst = originalScope.$eval(attrs.typeaheadFocusFirst) !== false;

        //If input matches an item of the list exactly, select it automatically
        var selectOnExact = attrs.typeaheadSelectOnExact ? originalScope.$eval(attrs.typeaheadSelectOnExact) : false;

        //INTERNAL VARIABLES

        //model setter executed upon match selection
        var parsedModel = $parse(attrs.ngModel);
        var invokeModelSetter = $parse(attrs.ngModel + '($$$p)');
        var $setModelValue = function(scope, newValue) {
          if (angular.isFunction(parsedModel(originalScope)) &&
            ngModelOptions && ngModelOptions.$options && ngModelOptions.$options.getterSetter) {
            return invokeModelSetter(scope, {$$$p: newValue});
          } else {
            return parsedModel.assign(scope, newValue);
          }
        };

        //expressions used by typeahead
        var parserResult = typeaheadParser.parse(attrs.typeahead);

        var hasFocus;

        //Used to avoid bug in iOS webview where iOS keyboard does not fire
        //mousedown & mouseup events
        //Issue #3699
        var selected;

        //create a child scope for the typeahead directive so we are not polluting original scope
        //with typeahead-specific data (matches, query etc.)
        var scope = originalScope.$new();
        var offDestroy = originalScope.$on('$destroy', function() {
			    scope.$destroy();
        });
        scope.$on('$destroy', offDestroy);

        // WAI-ARIA
        var popupId = 'typeahead-' + scope.$id + '-' + Math.floor(Math.random() * 10000);
        element.attr({
          'aria-autocomplete': 'list',
          'aria-expanded': false,
          'aria-owns': popupId
        });

        //pop-up element used to display matches
        var popUpEl = angular.element('<div typeahead-popup></div>');
        popUpEl.attr({
          id: popupId,
          matches: 'matches',
          active: 'activeIdx',
          select: 'select(activeIdx)',
          'move-in-progress': 'moveInProgress',
          query: 'query',
          position: 'position'
        });
        //custom item template
        if (angular.isDefined(attrs.typeaheadTemplateUrl)) {
          popUpEl.attr('template-url', attrs.typeaheadTemplateUrl);
        }

        if (angular.isDefined(attrs.typeaheadPopupTemplateUrl)) {
          popUpEl.attr('popup-template-url', attrs.typeaheadPopupTemplateUrl);
        }

        var resetMatches = function() {
          scope.matches = [];
          scope.activeIdx = -1;
          element.attr('aria-expanded', false);
        };

        var getMatchId = function(index) {
          return popupId + '-option-' + index;
        };

        // Indicate that the specified match is the active (pre-selected) item in the list owned by this typeahead.
        // This attribute is added or removed automatically when the `activeIdx` changes.
        scope.$watch('activeIdx', function(index) {
          if (index < 0) {
            element.removeAttr('aria-activedescendant');
          } else {
            element.attr('aria-activedescendant', getMatchId(index));
          }
        });

        var inputIsExactMatch = function(inputValue, index) {
          if (scope.matches.length > index && inputValue) {
            return inputValue.toUpperCase() === scope.matches[index].label.toUpperCase();
          }

          return false;
        };

        var getMatchesAsync = function(inputValue) {
          var locals = {$viewValue: inputValue};
          isLoadingSetter(originalScope, true);
          isNoResultsSetter(originalScope, false);
          $q.when(parserResult.source(originalScope, locals)).then(function(matches) {
            //it might happen that several async queries were in progress if a user were typing fast
            //but we are interested only in responses that correspond to the current view value
            var onCurrentRequest = (inputValue === modelCtrl.$viewValue);
            if (onCurrentRequest && hasFocus) {
              if (matches && matches.length > 0) {
                scope.activeIdx = focusFirst ? 0 : -1;
                isNoResultsSetter(originalScope, false);
                scope.matches.length = 0;

                //transform labels
                for (var i = 0; i < matches.length; i++) {
                  locals[parserResult.itemName] = matches[i];
                  scope.matches.push({
                    id: getMatchId(i),
                    label: parserResult.viewMapper(scope, locals),
                    model: matches[i]
                  });
                }

                scope.query = inputValue;
                //position pop-up with matches - we need to re-calculate its position each time we are opening a window
                //with matches as a pop-up might be absolute-positioned and position of an input might have changed on a page
                //due to other elements being rendered
                recalculatePosition();

                element.attr('aria-expanded', true);

                //Select the single remaining option if user input matches
                if (selectOnExact && scope.matches.length === 1 && inputIsExactMatch(inputValue, 0)) {
                  scope.select(0);
                }
              } else {
                resetMatches();
                isNoResultsSetter(originalScope, true);
              }
            }
            if (onCurrentRequest) {
              isLoadingSetter(originalScope, false);
            }
          }, function() {
            resetMatches();
            isLoadingSetter(originalScope, false);
            isNoResultsSetter(originalScope, true);
          });
        };

        // bind events only if appendToBody params exist - performance feature
        if (appendToBody) {
          angular.element($window).bind('resize', fireRecalculating);
          $document.find('body').bind('scroll', fireRecalculating);
        }

        // Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later
        var timeoutEventPromise;

        // Default progress type
        scope.moveInProgress = false;

        function fireRecalculating() {
          if (!scope.moveInProgress) {
            scope.moveInProgress = true;
            scope.$digest();
          }

          // Cancel previous timeout
          if (timeoutEventPromise) {
            $timeout.cancel(timeoutEventPromise);
          }

          // Debounced executing recalculate after events fired
          timeoutEventPromise = $timeout(function() {
            // if popup is visible
            if (scope.matches.length) {
              recalculatePosition();
            }

            scope.moveInProgress = false;
          }, eventDebounceTime);
        }

        // recalculate actual position and set new values to scope
        // after digest loop is popup in right position
        function recalculatePosition() {
          scope.position = appendToBody ? $position.offset(element) : $position.position(element);
          scope.position.top += element.prop('offsetHeight');
        }

        resetMatches();

        //we need to propagate user's query so we can higlight matches
        scope.query = undefined;

        //Declare the timeout promise var outside the function scope so that stacked calls can be cancelled later
        var timeoutPromise;

        var scheduleSearchWithTimeout = function(inputValue) {
          timeoutPromise = $timeout(function() {
            getMatchesAsync(inputValue);
          }, waitTime);
        };

        var cancelPreviousTimeout = function() {
          if (timeoutPromise) {
            $timeout.cancel(timeoutPromise);
          }
        };

        //plug into $parsers pipeline to open a typeahead on view changes initiated from DOM
        //$parsers kick-in on all the changes coming from the view as well as manually triggered by $setViewValue
        modelCtrl.$parsers.unshift(function(inputValue) {
          hasFocus = true;

          if (minLength === 0 || inputValue && inputValue.length >= minLength) {
            if (waitTime > 0) {
              cancelPreviousTimeout();
              scheduleSearchWithTimeout(inputValue);
            } else {
              getMatchesAsync(inputValue);
            }
          } else {
            isLoadingSetter(originalScope, false);
            cancelPreviousTimeout();
            resetMatches();
          }

          if (isEditable) {
            return inputValue;
          } else {
            if (!inputValue) {
              // Reset in case user had typed something previously.
              modelCtrl.$setValidity('editable', true);
              return null;
            } else {
              modelCtrl.$setValidity('editable', false);
              return undefined;
            }
          }
        });

        modelCtrl.$formatters.push(function(modelValue) {
          var candidateViewValue, emptyViewValue;
          var locals = {};

          // The validity may be set to false via $parsers (see above) if
          // the model is restricted to selected values. If the model
          // is set manually it is considered to be valid.
          if (!isEditable) {
            modelCtrl.$setValidity('editable', true);
          }

          if (inputFormatter) {
            locals.$model = modelValue;
            return inputFormatter(originalScope, locals);
          } else {
            //it might happen that we don't have enough info to properly render input value
            //we need to check for this situation and simply return model value if we can't apply custom formatting
            locals[parserResult.itemName] = modelValue;
            candidateViewValue = parserResult.viewMapper(originalScope, locals);
            locals[parserResult.itemName] = undefined;
            emptyViewValue = parserResult.viewMapper(originalScope, locals);

            return candidateViewValue !== emptyViewValue ? candidateViewValue : modelValue;
          }
        });

        scope.select = function(activeIdx) {
          //called from within the $digest() cycle
          var locals = {};
          var model, item;

          selected = true;
          locals[parserResult.itemName] = item = scope.matches[activeIdx].model;
          model = parserResult.modelMapper(originalScope, locals);
          $setModelValue(originalScope, model);
          modelCtrl.$setValidity('editable', true);
          modelCtrl.$setValidity('parse', true);

          onSelectCallback(originalScope, {
            $item: item,
            $model: model,
            $label: parserResult.viewMapper(originalScope, locals)
          });

          resetMatches();

          //return focus to the input element if a match was selected via a mouse click event
          // use timeout to avoid $rootScope:inprog error
          if (scope.$eval(attrs.typeaheadFocusOnSelect) !== false) {
            $timeout(function() { element[0].focus(); }, 0, false);
          }
        };

        //bind keyboard events: arrows up(38) / down(40), enter(13) and tab(9), esc(27)
        element.bind('keydown', function(evt) {
          //typeahead is open and an "interesting" key was pressed
          if (scope.matches.length === 0 || HOT_KEYS.indexOf(evt.which) === -1) {
            return;
          }

          // if there's nothing selected (i.e. focusFirst) and enter or tab is hit, clear the results
          if (scope.activeIdx === -1 && (evt.which === 9 || evt.which === 13)) {
            resetMatches();
            scope.$digest();
            return;
          }

          evt.preventDefault();

          if (evt.which === 40) {
            scope.activeIdx = (scope.activeIdx + 1) % scope.matches.length;
            scope.$digest();
          } else if (evt.which === 38) {
            scope.activeIdx = (scope.activeIdx > 0 ? scope.activeIdx : scope.matches.length) - 1;
            scope.$digest();
          } else if (evt.which === 13 || evt.which === 9) {
            scope.$apply(function () {
              scope.select(scope.activeIdx);
            });
          } else if (evt.which === 27) {
            evt.stopPropagation();

            resetMatches();
            scope.$digest();
          }
        });

        element.bind('blur', function() {
          if (isSelectOnBlur && scope.matches.length && scope.activeIdx !== -1 && !selected) {
            selected = true;
            scope.$apply(function() {
              scope.select(scope.activeIdx);
            });
          }
          hasFocus = false;
          selected = false;
        });

        // Keep reference to click handler to unbind it.
        var dismissClickHandler = function(evt) {
          // Issue #3973
          // Firefox treats right click as a click on document
          if (element[0] !== evt.target && evt.which !== 3 && scope.matches.length !== 0) {
            resetMatches();
            if (!$rootScope.$$phase) {
              scope.$digest();
            }
          }
        };

        $document.bind('click', dismissClickHandler);

        originalScope.$on('$destroy', function() {
          $document.unbind('click', dismissClickHandler);
          if (appendToBody || appendToElementId) {
            $popup.remove();
          }

          if (appendToBody) {
            angular.element($window).unbind('resize', fireRecalculating);
            $document.find('body').unbind('scroll', fireRecalculating);
          }
          // Prevent jQuery cache memory leak
          popUpEl.remove();
        });

        var $popup = $compile(popUpEl)(scope);

        if (appendToBody) {
          $document.find('body').append($popup);
        } else if (appendToElementId !== false) {
          angular.element($document[0].getElementById(appendToElementId)).append($popup);
        } else {
          element.after($popup);
        }
      }
    };
  }])
  
  .directive('typeaheadPopup', ['$typeaheadSuppressWarning', '$log', function($typeaheadSuppressWarning, $log) {
    return {
      scope: {
        matches: '=',
        query: '=',
        active: '=',
        position: '&',
        moveInProgress: '=',
        select: '&'
      },
      replace: true,
      templateUrl: function(element, attrs) {
        return attrs.popupTemplateUrl || 'template/typeahead/typeahead-popup.html';
      },
      link: function(scope, element, attrs) {
        
        if (!$typeaheadSuppressWarning) {
          $log.warn('typeahead-popup is now deprecated. Use uib-typeahead-popup instead.');
        }
        scope.templateUrl = attrs.templateUrl;

        scope.isOpen = function() {
          return scope.matches.length > 0;
        };

        scope.isActive = function(matchIdx) {
          return scope.active == matchIdx;
        };

        scope.selectActive = function(matchIdx) {
          scope.active = matchIdx;
        };

        scope.selectMatch = function(activeIdx) {
          scope.select({activeIdx:activeIdx});
        };
      }
    };
  }])
  
  .directive('typeaheadMatch', ['$templateRequest', '$compile', '$parse', '$typeaheadSuppressWarning', '$log', function($templateRequest, $compile, $parse, $typeaheadSuppressWarning, $log) {
    return {
      restrict: 'EA',
      scope: {
        index: '=',
        match: '=',
        query: '='
      },
      link:function(scope, element, attrs) {
        if (!$typeaheadSuppressWarning) {
          $log.warn('typeahead-match is now deprecated. Use uib-typeahead-match instead.');
        }

        var tplUrl = $parse(attrs.templateUrl)(scope.$parent) || 'template/typeahead/typeahead-match.html';
        $templateRequest(tplUrl).then(function(tplContent) {
          $compile(tplContent.trim())(scope, function(clonedElement) {
            element.replaceWith(clonedElement);
          });
        });
      }
    };
  }])
  
  .filter('typeaheadHighlight', ['$sce', '$injector', '$log', '$typeaheadSuppressWarning', function($sce, $injector, $log, $typeaheadSuppressWarning) {
    var isSanitizePresent;
    isSanitizePresent = $injector.has('$sanitize');

    function escapeRegexp(queryToEscape) {
      // Regex: capture the whole query string and replace it with the string that will be used to match
      // the results, for example if the capture is "a" the result will be \a
      return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
    }

    function containsHtml(matchItem) {
      return /<.*>/g.test(matchItem);
    }

    return function(matchItem, query) {
      if (!$typeaheadSuppressWarning) {
        $log.warn('typeaheadHighlight is now deprecated. Use uibTypeaheadHighlight instead.');
      }

      if (!isSanitizePresent && containsHtml(matchItem)) {
        $log.warn('Unsafe use of typeahead please use ngSanitize'); // Warn the user about the danger
      }

      matchItem = query? ('' + matchItem).replace(new RegExp(escapeRegexp(query), 'gi'), '<strong>$&</strong>') : matchItem; // Replaces the capture string with a the same string inside of a "strong" tag
      if (!isSanitizePresent) {
        matchItem = $sce.trustAsHtml(matchItem); // If $sanitize is not present we pack the string in a $sce object for the ng-bind-html directive
      }

      return matchItem;
    };
  }]);

angular.module('ui.bootstrap.position', [])

/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
  .factory('$uibPosition', ['$document', '$window', function($document, $window) {
    function getStyle(el, cssprop) {
      if (el.currentStyle) { //IE
        return el.currentStyle[cssprop];
      } else if ($window.getComputedStyle) {
        return $window.getComputedStyle(el)[cssprop];
      }
      // finally try and get inline style
      return el.style[cssprop];
    }

    /**
     * Checks if a given element is statically positioned
     * @param element - raw DOM element
     */
    function isStaticPositioned(element) {
      return (getStyle(element, 'position') || 'static' ) === 'static';
    }

    /**
     * returns the closest, non-statically positioned parentOffset of a given element
     * @param element
     */
    var parentOffsetEl = function(element) {
      var docDomEl = $document[0];
      var offsetParent = element.offsetParent || docDomEl;
      while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || docDomEl;
    };

    return {
      /**
       * Provides read-only equivalent of jQuery's position function:
       * http://api.jquery.com/position/
       */
      position: function(element) {
        var elBCR = this.offset(element);
        var offsetParentBCR = { top: 0, left: 0 };
        var offsetParentEl = parentOffsetEl(element[0]);
        if (offsetParentEl != $document[0]) {
          offsetParentBCR = this.offset(angular.element(offsetParentEl));
          offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
          offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
        }

        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: elBCR.top - offsetParentBCR.top,
          left: elBCR.left - offsetParentBCR.left
        };
      },

      /**
       * Provides read-only equivalent of jQuery's offset function:
       * http://api.jquery.com/offset/
       */
      offset: function(element) {
        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
          left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
        };
      },

      /**
       * Provides coordinates for the targetEl in relation to hostEl
       */
      positionElements: function(hostEl, targetEl, positionStr, appendToBody) {
        var positionStrParts = positionStr.split('-');
        var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

        var hostElPos,
          targetElWidth,
          targetElHeight,
          targetElPos;

        hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

        targetElWidth = targetEl.prop('offsetWidth');
        targetElHeight = targetEl.prop('offsetHeight');

        var shiftWidth = {
          center: function() {
            return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
          },
          left: function() {
            return hostElPos.left;
          },
          right: function() {
            return hostElPos.left + hostElPos.width;
          }
        };

        var shiftHeight = {
          center: function() {
            return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
          },
          top: function() {
            return hostElPos.top;
          },
          bottom: function() {
            return hostElPos.top + hostElPos.height;
          }
        };

        switch (pos0) {
          case 'right':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: shiftWidth[pos0]()
            };
            break;
          case 'left':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: hostElPos.left - targetElWidth
            };
            break;
          case 'bottom':
            targetElPos = {
              top: shiftHeight[pos0](),
              left: shiftWidth[pos1]()
            };
            break;
          default:
            targetElPos = {
              top: hostElPos.top - targetElHeight,
              left: shiftWidth[pos1]()
            };
            break;
        }

        return targetElPos;
      }
    };
  }]);

/* Deprecated position below */

angular.module('ui.bootstrap.position')

.value('$positionSuppressWarning', false)

.service('$position', ['$log', '$positionSuppressWarning', '$uibPosition', function($log, $positionSuppressWarning, $uibPosition) {
  if (!$positionSuppressWarning) {
    $log.warn('$position is now deprecated. Use $uibPosition instead.');
  }

  angular.extend(this, $uibPosition);
}]);

angular.module('ui.bootstrap.modal', ['ui.bootstrap.stackedMap'])
/**
 * A helper, internal data structure that stores all references attached to key
 */
  .factory('$$multiMap', function() {
    return {
      createNew: function() {
        var map = {};

        return {
          entries: function() {
            return Object.keys(map).map(function(key) {
              return {
                key: key,
                value: map[key]
              };
            });
          },
          get: function(key) {
            return map[key];
          },
          hasKey: function(key) {
            return !!map[key];
          },
          keys: function() {
            return Object.keys(map);
          },
          put: function(key, value) {
            if (!map[key]) {
              map[key] = [];
            }

            map[key].push(value);
          },
          remove: function(key, value) {
            var values = map[key];

            if (!values) {
              return;
            }

            var idx = values.indexOf(value);

            if (idx !== -1) {
              values.splice(idx, 1);
            }

            if (!values.length) {
              delete map[key];
            }
          }
        };
      }
    };
  })

/**
 * A helper directive for the $modal service. It creates a backdrop element.
 */
  .directive('uibModalBackdrop', [
           '$animate', '$injector', '$uibModalStack',
  function($animate ,  $injector,   $modalStack) {
    var $animateCss = null;

    if ($injector.has('$animateCss')) {
      $animateCss = $injector.get('$animateCss');
    }

    return {
      replace: true,
      templateUrl: 'template/modal/backdrop.html',
      compile: function(tElement, tAttrs) {
        tElement.addClass(tAttrs.backdropClass);
        return linkFn;
      }
    };

    function linkFn(scope, element, attrs) {
      // Temporary fix for prefixing
      element.addClass('modal-backdrop');

      if (attrs.modalInClass) {
        if ($animateCss) {
          $animateCss(element, {
            addClass: attrs.modalInClass
          }).start();
        } else {
          $animate.addClass(element, attrs.modalInClass);
        }

        scope.$on($modalStack.NOW_CLOSING_EVENT, function(e, setIsAsync) {
          var done = setIsAsync();
          if ($animateCss) {
            $animateCss(element, {
              removeClass: attrs.modalInClass
            }).start().then(done);
          } else {
            $animate.removeClass(element, attrs.modalInClass).then(done);
          }
        });
      }
    }
  }])

  .directive('uibModalWindow', [
           '$uibModalStack', '$q', '$animate', '$injector',
  function($modalStack ,  $q ,  $animate,   $injector) {
    var $animateCss = null;

    if ($injector.has('$animateCss')) {
      $animateCss = $injector.get('$animateCss');
    }

    return {
      scope: {
        index: '@'
      },
      replace: true,
      transclude: true,
      templateUrl: function(tElement, tAttrs) {
        return tAttrs.templateUrl || 'template/modal/window.html';
      },
      link: function(scope, element, attrs) {
        element.addClass(attrs.windowClass || '');
        element.addClass(attrs.windowTopClass || '');
        scope.size = attrs.size;

        scope.close = function(evt) {
          var modal = $modalStack.getTop();
          if (modal && modal.value.backdrop && modal.value.backdrop !== 'static' && (evt.target === evt.currentTarget)) {
            evt.preventDefault();
            evt.stopPropagation();
            $modalStack.dismiss(modal.key, 'backdrop click');
          }
        };

        // moved from template to fix issue #2280
        element.on('click', scope.close);

        // This property is only added to the scope for the purpose of detecting when this directive is rendered.
        // We can detect that by using this property in the template associated with this directive and then use
        // {@link Attribute#$observe} on it. For more details please see {@link TableColumnResize}.
        scope.$isRendered = true;

        // Deferred object that will be resolved when this modal is render.
        var modalRenderDeferObj = $q.defer();
        // Observe function will be called on next digest cycle after compilation, ensuring that the DOM is ready.
        // In order to use this way of finding whether DOM is ready, we need to observe a scope property used in modal's template.
        attrs.$observe('modalRender', function(value) {
          if (value == 'true') {
            modalRenderDeferObj.resolve();
          }
        });

        modalRenderDeferObj.promise.then(function() {
          var animationPromise = null;

          if (attrs.modalInClass) {
            if ($animateCss) {
              animationPromise = $animateCss(element, {
                addClass: attrs.modalInClass
              }).start();
            } else {
              animationPromise = $animate.addClass(element, attrs.modalInClass);
            }

            scope.$on($modalStack.NOW_CLOSING_EVENT, function(e, setIsAsync) {
              var done = setIsAsync();
              if ($animateCss) {
                $animateCss(element, {
                  removeClass: attrs.modalInClass
                }).start().then(done);
              } else {
                $animate.removeClass(element, attrs.modalInClass).then(done);
              }
            });
          }


          $q.when(animationPromise).then(function() {
            var inputWithAutofocus = element[0].querySelector('[autofocus]');
            /**
             * Auto-focusing of a freshly-opened modal element causes any child elements
             * with the autofocus attribute to lose focus. This is an issue on touch
             * based devices which will show and then hide the onscreen keyboard.
             * Attempts to refocus the autofocus element via JavaScript will not reopen
             * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
             * the modal element if the modal does not contain an autofocus element.
             */
            if (inputWithAutofocus) {
              inputWithAutofocus.focus();
            } else {
              element[0].focus();
            }
          });

          // Notify {@link $modalStack} that modal is rendered.
          var modal = $modalStack.getTop();
          if (modal) {
            $modalStack.modalRendered(modal.key);
          }
        });
      }
    };
  }])

  .directive('uibModalAnimationClass', function() {
    return {
      compile: function(tElement, tAttrs) {
        if (tAttrs.modalAnimation) {
          tElement.addClass(tAttrs.uibModalAnimationClass);
        }
      }
    };
  })

  .directive('uibModalTransclude', function() {
    return {
      link: function($scope, $element, $attrs, controller, $transclude) {
        $transclude($scope.$parent, function(clone) {
          $element.empty();
          $element.append(clone);
        });
      }
    };
  })

  .factory('$uibModalStack', [
             '$animate', '$timeout', '$document', '$compile', '$rootScope',
             '$q',
             '$injector',
             '$$multiMap',
             '$$stackedMap',
    function($animate ,  $timeout ,  $document ,  $compile ,  $rootScope ,
              $q,
              $injector,
              $$multiMap,
              $$stackedMap) {
      var $animateCss = null;

      if ($injector.has('$animateCss')) {
        $animateCss = $injector.get('$animateCss');
      }

      var OPENED_MODAL_CLASS = 'modal-open';

      var backdropDomEl, backdropScope;
      var openedWindows = $$stackedMap.createNew();
      var openedClasses = $$multiMap.createNew();
      var $modalStack = {
        NOW_CLOSING_EVENT: 'modal.stack.now-closing'
      };

      //Modal focus behavior
      var focusableElementList;
      var focusIndex = 0;
      var tababbleSelector = 'a[href], area[href], input:not([disabled]), ' +
        'button:not([disabled]),select:not([disabled]), textarea:not([disabled]), ' +
        'iframe, object, embed, *[tabindex], *[contenteditable=true]';

      function backdropIndex() {
        var topBackdropIndex = -1;
        var opened = openedWindows.keys();
        for (var i = 0; i < opened.length; i++) {
          if (openedWindows.get(opened[i]).value.backdrop) {
            topBackdropIndex = i;
          }
        }
        return topBackdropIndex;
      }

      $rootScope.$watch(backdropIndex, function(newBackdropIndex) {
        if (backdropScope) {
          backdropScope.index = newBackdropIndex;
        }
      });

      function removeModalWindow(modalInstance, elementToReceiveFocus) {
        var body = $document.find('body').eq(0);
        var modalWindow = openedWindows.get(modalInstance).value;

        //clean up the stack
        openedWindows.remove(modalInstance);

        removeAfterAnimate(modalWindow.modalDomEl, modalWindow.modalScope, function() {
          var modalBodyClass = modalWindow.openedClass || OPENED_MODAL_CLASS;
          openedClasses.remove(modalBodyClass, modalInstance);
          body.toggleClass(modalBodyClass, openedClasses.hasKey(modalBodyClass));
          toggleTopWindowClass(true);
        });
        checkRemoveBackdrop();

        //move focus to specified element if available, or else to body
        if (elementToReceiveFocus && elementToReceiveFocus.focus) {
          elementToReceiveFocus.focus();
        } else {
          body.focus();
        }
      }

      // Add or remove "windowTopClass" from the top window in the stack
      function toggleTopWindowClass(toggleSwitch) {
        var modalWindow;

        if (openedWindows.length() > 0) {
          modalWindow = openedWindows.top().value;
          modalWindow.modalDomEl.toggleClass(modalWindow.windowTopClass || '', toggleSwitch);
        }
      }

      function checkRemoveBackdrop() {
        //remove backdrop if no longer needed
        if (backdropDomEl && backdropIndex() == -1) {
          var backdropScopeRef = backdropScope;
          removeAfterAnimate(backdropDomEl, backdropScope, function() {
            backdropScopeRef = null;
          });
          backdropDomEl = undefined;
          backdropScope = undefined;
        }
      }

      function removeAfterAnimate(domEl, scope, done) {
        var asyncDeferred;
        var asyncPromise = null;
        var setIsAsync = function() {
          if (!asyncDeferred) {
            asyncDeferred = $q.defer();
            asyncPromise = asyncDeferred.promise;
          }

          return function asyncDone() {
            asyncDeferred.resolve();
          };
        };
        scope.$broadcast($modalStack.NOW_CLOSING_EVENT, setIsAsync);

        // Note that it's intentional that asyncPromise might be null.
        // That's when setIsAsync has not been called during the
        // NOW_CLOSING_EVENT broadcast.
        return $q.when(asyncPromise).then(afterAnimating);

        function afterAnimating() {
          if (afterAnimating.done) {
            return;
          }
          afterAnimating.done = true;

          if ($animateCss) {
            $animateCss(domEl, {
              event: 'leave'
            }).start().then(function() {
              domEl.remove();
            });
          } else {
            $animate.leave(domEl);
          }
          scope.$destroy();
          if (done) {
            done();
          }
        }
      }

      $document.bind('keydown', function(evt) {
        if (evt.isDefaultPrevented()) {
          return evt;
        }

        var modal = openedWindows.top();
        if (modal && modal.value.keyboard) {
          switch (evt.which) {
            case 27: {
              evt.preventDefault();
              $rootScope.$apply(function() {
                $modalStack.dismiss(modal.key, 'escape key press');
              });
              break;
            }
            case 9: {
              $modalStack.loadFocusElementList(modal);
              var focusChanged = false;
              if (evt.shiftKey) {
                if ($modalStack.isFocusInFirstItem(evt)) {
                  focusChanged = $modalStack.focusLastFocusableElement();
                }
              } else {
                if ($modalStack.isFocusInLastItem(evt)) {
                  focusChanged = $modalStack.focusFirstFocusableElement();
                }
              }

              if (focusChanged) {
                evt.preventDefault();
                evt.stopPropagation();
              }
              break;
            }
          }
        }
      });

      $modalStack.open = function(modalInstance, modal) {
        var modalOpener = $document[0].activeElement,
          modalBodyClass = modal.openedClass || OPENED_MODAL_CLASS;

        toggleTopWindowClass(false);

        openedWindows.add(modalInstance, {
          deferred: modal.deferred,
          renderDeferred: modal.renderDeferred,
          modalScope: modal.scope,
          backdrop: modal.backdrop,
          keyboard: modal.keyboard,
          openedClass: modal.openedClass,
          windowTopClass: modal.windowTopClass
        });

        openedClasses.put(modalBodyClass, modalInstance);

        var body = $document.find('body').eq(0),
            currBackdropIndex = backdropIndex();

        if (currBackdropIndex >= 0 && !backdropDomEl) {
          backdropScope = $rootScope.$new(true);
          backdropScope.index = currBackdropIndex;
          var angularBackgroundDomEl = angular.element('<div uib-modal-backdrop="modal-backdrop"></div>');
          angularBackgroundDomEl.attr('backdrop-class', modal.backdropClass);
          if (modal.animation) {
            angularBackgroundDomEl.attr('modal-animation', 'true');
          }
          backdropDomEl = $compile(angularBackgroundDomEl)(backdropScope);
          body.append(backdropDomEl);
        }

        var angularDomEl = angular.element('<div uib-modal-window="modal-window"></div>');
        angularDomEl.attr({
          'template-url': modal.windowTemplateUrl,
          'window-class': modal.windowClass,
          'window-top-class': modal.windowTopClass,
          'size': modal.size,
          'index': openedWindows.length() - 1,
          'animate': 'animate'
        }).html(modal.content);
        if (modal.animation) {
          angularDomEl.attr('modal-animation', 'true');
        }

        var modalDomEl = $compile(angularDomEl)(modal.scope);
        openedWindows.top().value.modalDomEl = modalDomEl;
        openedWindows.top().value.modalOpener = modalOpener;
        body.append(modalDomEl);
        body.addClass(modalBodyClass);

        $modalStack.clearFocusListCache();
      };

      function broadcastClosing(modalWindow, resultOrReason, closing) {
        return !modalWindow.value.modalScope.$broadcast('modal.closing', resultOrReason, closing).defaultPrevented;
      }

      $modalStack.close = function(modalInstance, result) {
        var modalWindow = openedWindows.get(modalInstance);
        if (modalWindow && broadcastClosing(modalWindow, result, true)) {
          modalWindow.value.modalScope.$$uibDestructionScheduled = true;
          modalWindow.value.deferred.resolve(result);
          removeModalWindow(modalInstance, modalWindow.value.modalOpener);
          return true;
        }
        return !modalWindow;
      };

      $modalStack.dismiss = function(modalInstance, reason) {
        var modalWindow = openedWindows.get(modalInstance);
        if (modalWindow && broadcastClosing(modalWindow, reason, false)) {
          modalWindow.value.modalScope.$$uibDestructionScheduled = true;
          modalWindow.value.deferred.reject(reason);
          removeModalWindow(modalInstance, modalWindow.value.modalOpener);
          return true;
        }
        return !modalWindow;
      };

      $modalStack.dismissAll = function(reason) {
        var topModal = this.getTop();
        while (topModal && this.dismiss(topModal.key, reason)) {
          topModal = this.getTop();
        }
      };

      $modalStack.getTop = function() {
        return openedWindows.top();
      };

      $modalStack.modalRendered = function(modalInstance) {
        var modalWindow = openedWindows.get(modalInstance);
        if (modalWindow) {
          modalWindow.value.renderDeferred.resolve();
        }
      };

      $modalStack.focusFirstFocusableElement = function() {
        if (focusableElementList.length > 0) {
          focusableElementList[0].focus();
          return true;
        }
        return false;
      };
      $modalStack.focusLastFocusableElement = function() {
        if (focusableElementList.length > 0) {
          focusableElementList[focusableElementList.length - 1].focus();
          return true;
        }
        return false;
      };

      $modalStack.isFocusInFirstItem = function(evt) {
        if (focusableElementList.length > 0) {
          return (evt.target || evt.srcElement) == focusableElementList[0];
        }
        return false;
      };

      $modalStack.isFocusInLastItem = function(evt) {
        if (focusableElementList.length > 0) {
          return (evt.target || evt.srcElement) == focusableElementList[focusableElementList.length - 1];
        }
        return false;
      };

      $modalStack.clearFocusListCache = function() {
        focusableElementList = [];
        focusIndex = 0;
      };

      $modalStack.loadFocusElementList = function(modalWindow) {
        if (focusableElementList === undefined || !focusableElementList.length) {
          if (modalWindow) {
            var modalDomE1 = modalWindow.value.modalDomEl;
            if (modalDomE1 && modalDomE1.length) {
              focusableElementList = modalDomE1[0].querySelectorAll(tababbleSelector);
            }
          }
        }
      };

      return $modalStack;
    }])

  .provider('$uibModal', function() {
    var $modalProvider = {
      options: {
        animation: true,
        backdrop: true, //can also be false or 'static'
        keyboard: true
      },
      $get: ['$injector', '$rootScope', '$q', '$templateRequest', '$controller', '$uibModalStack', '$modalSuppressWarning', '$log',
        function ($injector, $rootScope, $q, $templateRequest, $controller, $modalStack, $modalSuppressWarning, $log) {
          var $modal = {};

          function getTemplatePromise(options) {
            return options.template ? $q.when(options.template) :
              $templateRequest(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl);
          }

          function getResolvePromises(resolves) {
            var promisesArr = [];
            angular.forEach(resolves, function(value) {
              if (angular.isFunction(value) || angular.isArray(value)) {
                promisesArr.push($q.when($injector.invoke(value)));
              } else if (angular.isString(value)) {
                promisesArr.push($q.when($injector.get(value)));
              } else {
                promisesArr.push($q.when(value));
              }
            });
            return promisesArr;
          }

          var promiseChain = null;
          $modal.getPromiseChain = function() {
            return promiseChain;
          };

          $modal.open = function(modalOptions) {
            var modalResultDeferred = $q.defer();
            var modalOpenedDeferred = $q.defer();
            var modalRenderDeferred = $q.defer();

            //prepare an instance of a modal to be injected into controllers and returned to a caller
            var modalInstance = {
              result: modalResultDeferred.promise,
              opened: modalOpenedDeferred.promise,
              rendered: modalRenderDeferred.promise,
              close: function (result) {
                return $modalStack.close(modalInstance, result);
              },
              dismiss: function (reason) {
                return $modalStack.dismiss(modalInstance, reason);
              }
            };

            //merge and clean up options
            modalOptions = angular.extend({}, $modalProvider.options, modalOptions);
            modalOptions.resolve = modalOptions.resolve || {};

            //verify options
            if (!modalOptions.template && !modalOptions.templateUrl) {
              throw new Error('One of template or templateUrl options is required.');
            }

            var templateAndResolvePromise =
              $q.all([getTemplatePromise(modalOptions)].concat(getResolvePromises(modalOptions.resolve)));

            function resolveWithTemplate() {
              return templateAndResolvePromise;
            }

            // Wait for the resolution of the existing promise chain.
            // Then switch to our own combined promise dependency (regardless of how the previous modal fared).
            // Then add to $modalStack and resolve opened.
            // Finally clean up the chain variable if no subsequent modal has overwritten it.
            var samePromise;
            samePromise = promiseChain = $q.all([promiseChain])
              .then(resolveWithTemplate, resolveWithTemplate)
              .then(function resolveSuccess(tplAndVars) {

                var modalScope = (modalOptions.scope || $rootScope).$new();
                modalScope.$close = modalInstance.close;
                modalScope.$dismiss = modalInstance.dismiss;

                modalScope.$on('$destroy', function() {
                  if (!modalScope.$$uibDestructionScheduled) {
                    modalScope.$dismiss('$uibUnscheduledDestruction');
                  }
                });

                var ctrlInstance, ctrlLocals = {};
                var resolveIter = 1;

                //controllers
                if (modalOptions.controller) {
                  ctrlLocals.$scope = modalScope;
                  ctrlLocals.$uibModalInstance = modalInstance;
                  Object.defineProperty(ctrlLocals, '$modalInstance', {
                    get: function() {
                      if (!$modalSuppressWarning) {
                        $log.warn('$modalInstance is now deprecated. Use $uibModalInstance instead.');
                      }

                      return modalInstance;
                    }
                  });
                  angular.forEach(modalOptions.resolve, function(value, key) {
                    ctrlLocals[key] = tplAndVars[resolveIter++];
                  });

                  ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                  if (modalOptions.controllerAs) {
                    if (modalOptions.bindToController) {
                      angular.extend(ctrlInstance, modalScope);
                    }

                    modalScope[modalOptions.controllerAs] = ctrlInstance;
                  }
                }

                $modalStack.open(modalInstance, {
                  scope: modalScope,
                  deferred: modalResultDeferred,
                  renderDeferred: modalRenderDeferred,
                  content: tplAndVars[0],
                  animation: modalOptions.animation,
                  backdrop: modalOptions.backdrop,
                  keyboard: modalOptions.keyboard,
                  backdropClass: modalOptions.backdropClass,
                  windowTopClass: modalOptions.windowTopClass,
                  windowClass: modalOptions.windowClass,
                  windowTemplateUrl: modalOptions.windowTemplateUrl,
                  size: modalOptions.size,
                  openedClass: modalOptions.openedClass
                });
                modalOpenedDeferred.resolve(true);

            }, function resolveError(reason) {
              modalOpenedDeferred.reject(reason);
              modalResultDeferred.reject(reason);
            })
            .finally(function() {
              if (promiseChain === samePromise) {
                promiseChain = null;
              }
            });

            return modalInstance;
          };

          return $modal;
        }
      ]
    };

    return $modalProvider;
  });

/* deprecated modal below */

angular.module('ui.bootstrap.modal')

  .value('$modalSuppressWarning', false)

  /**
   * A helper directive for the $modal service. It creates a backdrop element.
   */
  .directive('modalBackdrop', [
    '$animate', '$injector', '$modalStack', '$log', '$modalSuppressWarning',
    function($animate ,  $injector,   $modalStack, $log, $modalSuppressWarning) {
      var $animateCss = null;

      if ($injector.has('$animateCss')) {
        $animateCss = $injector.get('$animateCss');
      }

      return {
        replace: true,
        templateUrl: 'template/modal/backdrop.html',
        compile: function(tElement, tAttrs) {
          tElement.addClass(tAttrs.backdropClass);
          return linkFn;
        }
      };

      function linkFn(scope, element, attrs) {
        if (!$modalSuppressWarning) {
          $log.warn('modal-backdrop is now deprecated. Use uib-modal-backdrop instead.');
        }
        element.addClass('modal-backdrop');

        if (attrs.modalInClass) {
          if ($animateCss) {
            $animateCss(element, {
              addClass: attrs.modalInClass
            }).start();
          } else {
            $animate.addClass(element, attrs.modalInClass);
          }

          scope.$on($modalStack.NOW_CLOSING_EVENT, function(e, setIsAsync) {
            var done = setIsAsync();
            if ($animateCss) {
              $animateCss(element, {
                removeClass: attrs.modalInClass
              }).start().then(done);
            } else {
              $animate.removeClass(element, attrs.modalInClass).then(done);
            }
          });
        }
      }
    }])

  .directive('modalWindow', [
    '$modalStack', '$q', '$animate', '$injector', '$log', '$modalSuppressWarning',
    function($modalStack ,  $q ,  $animate,   $injector, $log, $modalSuppressWarning) {
      var $animateCss = null;

      if ($injector.has('$animateCss')) {
        $animateCss = $injector.get('$animateCss');
      }

      return {
        scope: {
          index: '@'
        },
        replace: true,
        transclude: true,
        templateUrl: function(tElement, tAttrs) {
          return tAttrs.templateUrl || 'template/modal/window.html';
        },
        link: function(scope, element, attrs) {
          if (!$modalSuppressWarning) {
            $log.warn('modal-window is now deprecated. Use uib-modal-window instead.');
          }
          element.addClass(attrs.windowClass || '');
          element.addClass(attrs.windowTopClass || '');
          scope.size = attrs.size;

          scope.close = function(evt) {
            var modal = $modalStack.getTop();
            if (modal && modal.value.backdrop && modal.value.backdrop !== 'static' && (evt.target === evt.currentTarget)) {
              evt.preventDefault();
              evt.stopPropagation();
              $modalStack.dismiss(modal.key, 'backdrop click');
            }
          };

          // moved from template to fix issue #2280
          element.on('click', scope.close);

          // This property is only added to the scope for the purpose of detecting when this directive is rendered.
          // We can detect that by using this property in the template associated with this directive and then use
          // {@link Attribute#$observe} on it. For more details please see {@link TableColumnResize}.
          scope.$isRendered = true;

          // Deferred object that will be resolved when this modal is render.
          var modalRenderDeferObj = $q.defer();
          // Observe function will be called on next digest cycle after compilation, ensuring that the DOM is ready.
          // In order to use this way of finding whether DOM is ready, we need to observe a scope property used in modal's template.
          attrs.$observe('modalRender', function(value) {
            if (value == 'true') {
              modalRenderDeferObj.resolve();
            }
          });

          modalRenderDeferObj.promise.then(function() {
            var animationPromise = null;

            if (attrs.modalInClass) {
              if ($animateCss) {
                animationPromise = $animateCss(element, {
                  addClass: attrs.modalInClass
                }).start();
              } else {
                animationPromise = $animate.addClass(element, attrs.modalInClass);
              }

              scope.$on($modalStack.NOW_CLOSING_EVENT, function(e, setIsAsync) {
                var done = setIsAsync();
                if ($animateCss) {
                  $animateCss(element, {
                    removeClass: attrs.modalInClass
                  }).start().then(done);
                } else {
                  $animate.removeClass(element, attrs.modalInClass).then(done);
                }
              });
            }


            $q.when(animationPromise).then(function() {
              var inputWithAutofocus = element[0].querySelector('[autofocus]');
              /**
               * Auto-focusing of a freshly-opened modal element causes any child elements
               * with the autofocus attribute to lose focus. This is an issue on touch
               * based devices which will show and then hide the onscreen keyboard.
               * Attempts to refocus the autofocus element via JavaScript will not reopen
               * the onscreen keyboard. Fixed by updated the focusing logic to only autofocus
               * the modal element if the modal does not contain an autofocus element.
               */
              if (inputWithAutofocus) {
                inputWithAutofocus.focus();
              } else {
                element[0].focus();
              }
            });

            // Notify {@link $modalStack} that modal is rendered.
            var modal = $modalStack.getTop();
            if (modal) {
              $modalStack.modalRendered(modal.key);
            }
          });
        }
      };
    }])

  .directive('modalAnimationClass', [
    '$log', '$modalSuppressWarning',
    function ($log, $modalSuppressWarning) {
      return {
        compile: function(tElement, tAttrs) {
          if (!$modalSuppressWarning) {
            $log.warn('modal-animation-class is now deprecated. Use uib-modal-animation-class instead.');
          }
          if (tAttrs.modalAnimation) {
            tElement.addClass(tAttrs.modalAnimationClass);
          }
        }
      };
    }])

  .directive('modalTransclude', [
    '$log', '$modalSuppressWarning',
    function ($log, $modalSuppressWarning) {
    return {
      link: function($scope, $element, $attrs, controller, $transclude) {
        if (!$modalSuppressWarning) {
          $log.warn('modal-transclude is now deprecated. Use uib-modal-transclude instead.');
        }
        $transclude($scope.$parent, function(clone) {
          $element.empty();
          $element.append(clone);
        });
      }
    };
  }])

  .service('$modalStack', [
    '$animate', '$timeout', '$document', '$compile', '$rootScope',
    '$q',
    '$injector',
    '$$multiMap',
    '$$stackedMap',
    '$uibModalStack',
    '$log',
    '$modalSuppressWarning',
    function($animate ,  $timeout ,  $document ,  $compile ,  $rootScope ,
             $q,
             $injector,
             $$multiMap,
             $$stackedMap,
             $uibModalStack,
             $log,
             $modalSuppressWarning) {
      if (!$modalSuppressWarning) {
        $log.warn('$modalStack is now deprecated. Use $uibModalStack instead.');
      }

      angular.extend(this, $uibModalStack);
    }])

  .provider('$modal', ['$uibModalProvider', function($uibModalProvider) {
    angular.extend(this, $uibModalProvider);

    this.$get = ['$injector', '$log', '$modalSuppressWarning',
      function ($injector, $log, $modalSuppressWarning) {
        if (!$modalSuppressWarning) {
          $log.warn('$modal is now deprecated. Use $uibModal instead.');
        }

        return $injector.invoke($uibModalProvider.$get);
      }];
  }]);

angular.module('ui.bootstrap.stackedMap', [])
/**
 * A helper, internal data structure that acts as a map but also allows getting / removing
 * elements in the LIFO order
 */
  .factory('$$stackedMap', function() {
    return {
      createNew: function() {
        var stack = [];

        return {
          add: function(key, value) {
            stack.push({
              key: key,
              value: value
            });
          },
          get: function(key) {
            for (var i = 0; i < stack.length; i++) {
              if (key == stack[i].key) {
                return stack[i];
              }
            }
          },
          keys: function() {
            var keys = [];
            for (var i = 0; i < stack.length; i++) {
              keys.push(stack[i].key);
            }
            return keys;
          },
          top: function() {
            return stack[stack.length - 1];
          },
          remove: function(key) {
            var idx = -1;
            for (var i = 0; i < stack.length; i++) {
              if (key == stack[i].key) {
                idx = i;
                break;
              }
            }
            return stack.splice(idx, 1)[0];
          },
          removeTop: function() {
            return stack.splice(stack.length - 1, 1)[0];
          },
          length: function() {
            return stack.length;
          }
        };
      }
    };
  });
angular.module('ui.bootstrap.datepicker', ['ui.bootstrap.dateparser', 'ui.bootstrap.position'])

.value('$datepickerSuppressError', false)

.constant('uibDatepickerConfig', {
  formatDay: 'dd',
  formatMonth: 'MMMM',
  formatYear: 'yyyy',
  formatDayHeader: 'EEE',
  formatDayTitle: 'MMMM yyyy',
  formatMonthTitle: 'yyyy',
  datepickerMode: 'day',
  minMode: 'day',
  maxMode: 'year',
  showWeeks: true,
  startingDay: 0,
  yearRange: 20,
  minDate: null,
  maxDate: null,
  shortcutPropagation: false
})

.controller('UibDatepickerController', ['$scope', '$attrs', '$parse', '$interpolate', '$log', 'dateFilter', 'uibDatepickerConfig', '$datepickerSuppressError', function($scope, $attrs, $parse, $interpolate, $log, dateFilter, datepickerConfig, $datepickerSuppressError) {
  var self = this,
      ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl;

  // Modes chain
  this.modes = ['day', 'month', 'year'];

  // Configuration attributes
  angular.forEach(['formatDay', 'formatMonth', 'formatYear', 'formatDayHeader', 'formatDayTitle', 'formatMonthTitle',
                   'showWeeks', 'startingDay', 'yearRange', 'shortcutPropagation'], function(key, index) {
    self[key] = angular.isDefined($attrs[key]) ? (index < 6 ? $interpolate($attrs[key])($scope.$parent) : $scope.$parent.$eval($attrs[key])) : datepickerConfig[key];
  });

  // Watchable date attributes
  angular.forEach(['minDate', 'maxDate'], function(key) {
    if ($attrs[key]) {
      $scope.$parent.$watch($parse($attrs[key]), function(value) {
        self[key] = value ? new Date(value) : null;
        self.refreshView();
      });
    } else {
      self[key] = datepickerConfig[key] ? new Date(datepickerConfig[key]) : null;
    }
  });

  angular.forEach(['minMode', 'maxMode'], function(key) {
    if ($attrs[key]) {
      $scope.$parent.$watch($parse($attrs[key]), function(value) {
        self[key] = angular.isDefined(value) ? value : $attrs[key];
        $scope[key] = self[key];
        if ((key == 'minMode' && self.modes.indexOf($scope.datepickerMode) < self.modes.indexOf(self[key])) || (key == 'maxMode' && self.modes.indexOf($scope.datepickerMode) > self.modes.indexOf(self[key]))) {
          $scope.datepickerMode = self[key];
        }
      });
    } else {
      self[key] = datepickerConfig[key] || null;
      $scope[key] = self[key];
    }
  });

  $scope.datepickerMode = $scope.datepickerMode || datepickerConfig.datepickerMode;
  $scope.uniqueId = 'datepicker-' + $scope.$id + '-' + Math.floor(Math.random() * 10000);

  if (angular.isDefined($attrs.initDate)) {
    this.activeDate = $scope.$parent.$eval($attrs.initDate) || new Date();
    $scope.$parent.$watch($attrs.initDate, function(initDate) {
      if (initDate && (ngModelCtrl.$isEmpty(ngModelCtrl.$modelValue) || ngModelCtrl.$invalid)) {
        self.activeDate = initDate;
        self.refreshView();
      }
    });
  } else {
    this.activeDate = new Date();
  }

  $scope.isActive = function(dateObject) {
    if (self.compare(dateObject.date, self.activeDate) === 0) {
      $scope.activeDateId = dateObject.uid;
      return true;
    }
    return false;
  };

  this.init = function(ngModelCtrl_) {
    ngModelCtrl = ngModelCtrl_;

    ngModelCtrl.$render = function() {
      self.render();
    };
  };

  this.render = function() {
    if (ngModelCtrl.$viewValue) {
      var date = new Date(ngModelCtrl.$viewValue),
          isValid = !isNaN(date);

      if (isValid) {
        this.activeDate = date;
      } else if (!$datepickerSuppressError) {
        $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
      }
    }
    this.refreshView();
  };

  this.refreshView = function() {
    if (this.element) {
      this._refreshView();

      var date = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
      ngModelCtrl.$setValidity('dateDisabled', !date || (this.element && !this.isDisabled(date)));
    }
  };

  this.createDateObject = function(date, format) {
    var model = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
    return {
      date: date,
      label: dateFilter(date, format),
      selected: model && this.compare(date, model) === 0,
      disabled: this.isDisabled(date),
      current: this.compare(date, new Date()) === 0,
      customClass: this.customClass(date)
    };
  };

  this.isDisabled = function(date) {
    return ((this.minDate && this.compare(date, this.minDate) < 0) || (this.maxDate && this.compare(date, this.maxDate) > 0) || ($attrs.dateDisabled && $scope.dateDisabled({date: date, mode: $scope.datepickerMode})));
  };

  this.customClass = function(date) {
    return $scope.customClass({date: date, mode: $scope.datepickerMode});
  };

  // Split array into smaller arrays
  this.split = function(arr, size) {
    var arrays = [];
    while (arr.length > 0) {
      arrays.push(arr.splice(0, size));
    }
    return arrays;
  };

  $scope.select = function(date) {
    if ($scope.datepickerMode === self.minMode) {
      var dt = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : new Date(0, 0, 0, 0, 0, 0, 0);
      dt.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      ngModelCtrl.$setViewValue(dt);
      ngModelCtrl.$render();
    } else {
      self.activeDate = date;
      $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) - 1];
    }
  };

  $scope.move = function(direction) {
    var year = self.activeDate.getFullYear() + direction * (self.step.years || 0),
        month = self.activeDate.getMonth() + direction * (self.step.months || 0);
    self.activeDate.setFullYear(year, month, 1);
    self.refreshView();
  };

  $scope.toggleMode = function(direction) {
    direction = direction || 1;

    if (($scope.datepickerMode === self.maxMode && direction === 1) || ($scope.datepickerMode === self.minMode && direction === -1)) {
      return;
    }

    $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) + direction];
  };

  // Key event mapper
  $scope.keys = { 13: 'enter', 32: 'space', 33: 'pageup', 34: 'pagedown', 35: 'end', 36: 'home', 37: 'left', 38: 'up', 39: 'right', 40: 'down' };

  var focusElement = function() {
    self.element[0].focus();
  };

  // Listen for focus requests from popup directive
  $scope.$on('uib:datepicker.focus', focusElement);

  $scope.keydown = function(evt) {
    var key = $scope.keys[evt.which];

    if (!key || evt.shiftKey || evt.altKey) {
      return;
    }

    evt.preventDefault();
    if (!self.shortcutPropagation) {
      evt.stopPropagation();
    }

    if (key === 'enter' || key === 'space') {
      if (self.isDisabled(self.activeDate)) {
        return; // do nothing
      }
      $scope.select(self.activeDate);
    } else if (evt.ctrlKey && (key === 'up' || key === 'down')) {
      $scope.toggleMode(key === 'up' ? 1 : -1);
    } else {
      self.handleKeyDown(key, evt);
      self.refreshView();
    }
  };
}])

.controller('UibDaypickerController', ['$scope', '$element', 'dateFilter', function(scope, $element, dateFilter) {
  var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  this.step = { months: 1 };
  this.element = $element;
  function getDaysInMonth(year, month) {
    return ((month === 1) && (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0))) ? 29 : DAYS_IN_MONTH[month];
  }

  this.init = function(ctrl) {
    angular.extend(ctrl, this);
    scope.showWeeks = ctrl.showWeeks;
    ctrl.refreshView();
  };

  this.getDates = function(startDate, n) {
    var dates = new Array(n), current = new Date(startDate), i = 0, date;
    while (i < n) {
      date = new Date(current);
      dates[i++] = date;
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  this._refreshView = function() {
    var year = this.activeDate.getFullYear(),
      month = this.activeDate.getMonth(),
      firstDayOfMonth = new Date(this.activeDate);

    firstDayOfMonth.setFullYear(year, month, 1);

    var difference = this.startingDay - firstDayOfMonth.getDay(),
      numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : - difference,
      firstDate = new Date(firstDayOfMonth);

    if (numDisplayedFromPreviousMonth > 0) {
      firstDate.setDate(-numDisplayedFromPreviousMonth + 1);
    }

    // 42 is the number of days on a six-month calendar
    var days = this.getDates(firstDate, 42);
    for (var i = 0; i < 42; i ++) {
      days[i] = angular.extend(this.createDateObject(days[i], this.formatDay), {
        secondary: days[i].getMonth() !== month,
        uid: scope.uniqueId + '-' + i
      });
    }

    scope.labels = new Array(7);
    for (var j = 0; j < 7; j++) {
      scope.labels[j] = {
        abbr: dateFilter(days[j].date, this.formatDayHeader),
        full: dateFilter(days[j].date, 'EEEE')
      };
    }

    scope.title = dateFilter(this.activeDate, this.formatDayTitle);
    scope.rows = this.split(days, 7);

    if (scope.showWeeks) {
      scope.weekNumbers = [];
      var thursdayIndex = (4 + 7 - this.startingDay) % 7,
          numWeeks = scope.rows.length;
      for (var curWeek = 0; curWeek < numWeeks; curWeek++) {
        scope.weekNumbers.push(
          getISO8601WeekNumber(scope.rows[curWeek][thursdayIndex].date));
      }
    }
  };

  this.compare = function(date1, date2) {
    return (new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()));
  };

  function getISO8601WeekNumber(date) {
    var checkDate = new Date(date);
    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
    var time = checkDate.getTime();
    checkDate.setMonth(0); // Compare with Jan 1
    checkDate.setDate(1);
    return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
  }

  this.handleKeyDown = function(key, evt) {
    var date = this.activeDate.getDate();

    if (key === 'left') {
      date = date - 1;   // up
    } else if (key === 'up') {
      date = date - 7;   // down
    } else if (key === 'right') {
      date = date + 1;   // down
    } else if (key === 'down') {
      date = date + 7;
    } else if (key === 'pageup' || key === 'pagedown') {
      var month = this.activeDate.getMonth() + (key === 'pageup' ? - 1 : 1);
      this.activeDate.setMonth(month, 1);
      date = Math.min(getDaysInMonth(this.activeDate.getFullYear(), this.activeDate.getMonth()), date);
    } else if (key === 'home') {
      date = 1;
    } else if (key === 'end') {
      date = getDaysInMonth(this.activeDate.getFullYear(), this.activeDate.getMonth());
    }
    this.activeDate.setDate(date);
  };
}])

.controller('UibMonthpickerController', ['$scope', '$element', 'dateFilter', function(scope, $element, dateFilter) {
  this.step = { years: 1 };
  this.element = $element;

  this.init = function(ctrl) {
    angular.extend(ctrl, this);
    ctrl.refreshView();
  };

  this._refreshView = function() {
    var months = new Array(12),
        year = this.activeDate.getFullYear(),
        date;

    for (var i = 0; i < 12; i++) {
      date = new Date(this.activeDate);
      date.setFullYear(year, i, 1);
      months[i] = angular.extend(this.createDateObject(date, this.formatMonth), {
        uid: scope.uniqueId + '-' + i
      });
    }

    scope.title = dateFilter(this.activeDate, this.formatMonthTitle);
    scope.rows = this.split(months, 3);
  };

  this.compare = function(date1, date2) {
    return new Date(date1.getFullYear(), date1.getMonth()) - new Date(date2.getFullYear(), date2.getMonth());
  };

  this.handleKeyDown = function(key, evt) {
    var date = this.activeDate.getMonth();

    if (key === 'left') {
      date = date - 1;   // up
    } else if (key === 'up') {
      date = date - 3;   // down
    } else if (key === 'right') {
      date = date + 1;   // down
    } else if (key === 'down') {
      date = date + 3;
    } else if (key === 'pageup' || key === 'pagedown') {
      var year = this.activeDate.getFullYear() + (key === 'pageup' ? - 1 : 1);
      this.activeDate.setFullYear(year);
    } else if (key === 'home') {
      date = 0;
    } else if (key === 'end') {
      date = 11;
    }
    this.activeDate.setMonth(date);
  };
}])

.controller('UibYearpickerController', ['$scope', '$element', 'dateFilter', function(scope, $element, dateFilter) {
  var range;
  this.element = $element;

  function getStartingYear(year) {
    return parseInt((year - 1) / range, 10) * range + 1;
  }

  this.yearpickerInit = function() {
    range = this.yearRange;
    this.step = { years: range };
  };

  this._refreshView = function() {
    var years = new Array(range), date;

    for (var i = 0, start = getStartingYear(this.activeDate.getFullYear()); i < range; i++) {
      date = new Date(this.activeDate);
      date.setFullYear(start + i, 0, 1);
      years[i] = angular.extend(this.createDateObject(date, this.formatYear), {
        uid: scope.uniqueId + '-' + i
      });
    }

    scope.title = [years[0].label, years[range - 1].label].join(' - ');
    scope.rows = this.split(years, 5);
  };

  this.compare = function(date1, date2) {
    return date1.getFullYear() - date2.getFullYear();
  };

  this.handleKeyDown = function(key, evt) {
    var date = this.activeDate.getFullYear();

    if (key === 'left') {
      date = date - 1;   // up
    } else if (key === 'up') {
      date = date - 5;   // down
    } else if (key === 'right') {
      date = date + 1;   // down
    } else if (key === 'down') {
      date = date + 5;
    } else if (key === 'pageup' || key === 'pagedown') {
      date += (key === 'pageup' ? - 1 : 1) * this.step.years;
    } else if (key === 'home') {
      date = getStartingYear(this.activeDate.getFullYear());
    } else if (key === 'end') {
      date = getStartingYear(this.activeDate.getFullYear()) + range - 1;
    }
    this.activeDate.setFullYear(date);
  };
}])

.directive('uibDatepicker', function() {
  return {
    replace: true,
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'template/datepicker/datepicker.html';
    },
    scope: {
      datepickerMode: '=?',
      dateDisabled: '&',
      customClass: '&',
      shortcutPropagation: '&?'
    },
    require: ['uibDatepicker', '^ngModel'],
    controller: 'UibDatepickerController',
    controllerAs: 'datepicker',
    link: function(scope, element, attrs, ctrls) {
      var datepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      datepickerCtrl.init(ngModelCtrl);
    }
  };
})

.directive('uibDaypicker', function() {
  return {
    replace: true,
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'template/datepicker/day.html';
    },
    require: ['^?uibDatepicker', 'uibDaypicker', '^?datepicker'],
    controller: 'UibDaypickerController',
    link: function(scope, element, attrs, ctrls) {
      var datepickerCtrl = ctrls[0] || ctrls[2],
        daypickerCtrl = ctrls[1];

      daypickerCtrl.init(datepickerCtrl);
    }
  };
})

.directive('uibMonthpicker', function() {
  return {
    replace: true,
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'template/datepicker/month.html';
    },
    require: ['^?uibDatepicker', 'uibMonthpicker', '^?datepicker'],
    controller: 'UibMonthpickerController',
    link: function(scope, element, attrs, ctrls) {
      var datepickerCtrl = ctrls[0] || ctrls[2],
        monthpickerCtrl = ctrls[1];

      monthpickerCtrl.init(datepickerCtrl);
    }
  };
})

.directive('uibYearpicker', function() {
  return {
    replace: true,
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'template/datepicker/year.html';
    },
    require: ['^?uibDatepicker', 'uibYearpicker', '^?datepicker'],
    controller: 'UibYearpickerController',
    link: function(scope, element, attrs, ctrls) {
      var ctrl = ctrls[0] || ctrls[2];
      angular.extend(ctrl, ctrls[1]);
      ctrl.yearpickerInit();

      ctrl.refreshView();
    }
  };
})

.constant('uibDatepickerPopupConfig', {
  datepickerPopup: 'yyyy-MM-dd',
  datepickerPopupTemplateUrl: 'template/datepicker/popup.html',
  datepickerTemplateUrl: 'template/datepicker/datepicker.html',
  html5Types: {
    date: 'yyyy-MM-dd',
    'datetime-local': 'yyyy-MM-ddTHH:mm:ss.sss',
    'month': 'yyyy-MM'
  },
  currentText: 'Today',
  clearText: 'Clear',
  closeText: 'Done',
  closeOnDateSelection: true,
  appendToBody: false,
  showButtonBar: true,
  onOpenFocus: true
})

.controller('UibDatepickerPopupController', ['$scope', '$element', '$attrs', '$compile', '$parse', '$document', '$rootScope', '$uibPosition', 'dateFilter', 'uibDateParser', 'uibDatepickerPopupConfig', '$timeout',
function(scope, element, attrs, $compile, $parse, $document, $rootScope, $position, dateFilter, dateParser, datepickerPopupConfig, $timeout) {
  var self = this;
  var cache = {},
    isHtml5DateInput = false;
  var dateFormat, closeOnDateSelection, appendToBody, onOpenFocus,
    datepickerPopupTemplateUrl, datepickerTemplateUrl, popupEl, datepickerEl,
    ngModel, $popup;

  scope.watchData = {};

  this.init = function(_ngModel_) {
    ngModel = _ngModel_;
    closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? scope.$parent.$eval(attrs.closeOnDateSelection) : datepickerPopupConfig.closeOnDateSelection;
    appendToBody = angular.isDefined(attrs.datepickerAppendToBody) ? scope.$parent.$eval(attrs.datepickerAppendToBody) : datepickerPopupConfig.appendToBody;
    onOpenFocus = angular.isDefined(attrs.onOpenFocus) ? scope.$parent.$eval(attrs.onOpenFocus) : datepickerPopupConfig.onOpenFocus;
    datepickerPopupTemplateUrl = angular.isDefined(attrs.datepickerPopupTemplateUrl) ? attrs.datepickerPopupTemplateUrl : datepickerPopupConfig.datepickerPopupTemplateUrl;
    datepickerTemplateUrl = angular.isDefined(attrs.datepickerTemplateUrl) ? attrs.datepickerTemplateUrl : datepickerPopupConfig.datepickerTemplateUrl;

    scope.showButtonBar = angular.isDefined(attrs.showButtonBar) ? scope.$parent.$eval(attrs.showButtonBar) : datepickerPopupConfig.showButtonBar;

    if (datepickerPopupConfig.html5Types[attrs.type]) {
      dateFormat = datepickerPopupConfig.html5Types[attrs.type];
      isHtml5DateInput = true;
    } else {
      dateFormat = attrs.datepickerPopup || attrs.uibDatepickerPopup || datepickerPopupConfig.datepickerPopup;
      attrs.$observe('uibDatepickerPopup', function(value, oldValue) {
          var newDateFormat = value || datepickerPopupConfig.datepickerPopup;
          // Invalidate the $modelValue to ensure that formatters re-run
          // FIXME: Refactor when PR is merged: https://github.com/angular/angular.js/pull/10764
          if (newDateFormat !== dateFormat) {
            dateFormat = newDateFormat;
            ngModel.$modelValue = null;

            if (!dateFormat) {
              throw new Error('uibDatepickerPopup must have a date format specified.');
            }
          }
      });
    }

    if (!dateFormat) {
      throw new Error('uibDatepickerPopup must have a date format specified.');
    }

    if (isHtml5DateInput && attrs.datepickerPopup) {
      throw new Error('HTML5 date input types do not support custom formats.');
    }

    // popup element used to display calendar
    popupEl = angular.element('<div uib-datepicker-popup-wrap><div uib-datepicker></div></div>');
    popupEl.attr({
      'ng-model': 'date',
      'ng-change': 'dateSelection(date)',
      'template-url': datepickerPopupTemplateUrl
    });

    // datepicker element
    datepickerEl = angular.element(popupEl.children()[0]);
    datepickerEl.attr('template-url', datepickerTemplateUrl);

    if (isHtml5DateInput) {
      if (attrs.type === 'month') {
        datepickerEl.attr('datepicker-mode', '"month"');
        datepickerEl.attr('min-mode', 'month');
      }
    }

    if (attrs.datepickerOptions) {
      var options = scope.$parent.$eval(attrs.datepickerOptions);
      if (options && options.initDate) {
        scope.initDate = options.initDate;
        datepickerEl.attr('init-date', 'initDate');
        delete options.initDate;
      }
      angular.forEach(options, function(value, option) {
        datepickerEl.attr(cameltoDash(option), value);
      });
    }

    angular.forEach(['minMode', 'maxMode', 'minDate', 'maxDate', 'datepickerMode', 'initDate', 'shortcutPropagation'], function(key) {
      if (attrs[key]) {
        var getAttribute = $parse(attrs[key]);
        scope.$parent.$watch(getAttribute, function(value) {
          scope.watchData[key] = value;
          if (key === 'minDate' || key === 'maxDate') {
            cache[key] = new Date(value);
          }
        });
        datepickerEl.attr(cameltoDash(key), 'watchData.' + key);

        // Propagate changes from datepicker to outside
        if (key === 'datepickerMode') {
          var setAttribute = getAttribute.assign;
          scope.$watch('watchData.' + key, function(value, oldvalue) {
            if (angular.isFunction(setAttribute) && value !== oldvalue) {
              setAttribute(scope.$parent, value);
            }
          });
        }
      }
    });
    if (attrs.dateDisabled) {
      datepickerEl.attr('date-disabled', 'dateDisabled({ date: date, mode: mode })');
    }

    if (attrs.showWeeks) {
      datepickerEl.attr('show-weeks', attrs.showWeeks);
    }

    if (attrs.customClass) {
      datepickerEl.attr('custom-class', 'customClass({ date: date, mode: mode })');
    }

    if (!isHtml5DateInput) {
      // Internal API to maintain the correct ng-invalid-[key] class
      ngModel.$$parserName = 'date';
      ngModel.$validators.date = validator;
      ngModel.$parsers.unshift(parseDate);
      ngModel.$formatters.push(function(value) {
        scope.date = value;
        return ngModel.$isEmpty(value) ? value : dateFilter(value, dateFormat);
      });
    } else {
      ngModel.$formatters.push(function(value) {
        scope.date = value;
        return value;
      });
    }

    // Detect changes in the view from the text box
    ngModel.$viewChangeListeners.push(function() {
      scope.date = dateParser.parse(ngModel.$viewValue, dateFormat, scope.date);
    });

    element.bind('keydown', inputKeydownBind);

    $popup = $compile(popupEl)(scope);
    // Prevent jQuery cache memory leak (template is now redundant after linking)
    popupEl.remove();

    if (appendToBody) {
      $document.find('body').append($popup);
    } else {
      element.after($popup);
    }

    scope.$on('$destroy', function() {
      if (scope.isOpen === true) {
        if (!$rootScope.$$phase) {
          scope.$apply(function() {
            scope.isOpen = false;
          });
        }
      }

      $popup.remove();
      element.unbind('keydown', inputKeydownBind);
      $document.unbind('click', documentClickBind);
    });
  };

  scope.getText = function(key) {
    return scope[key + 'Text'] || datepickerPopupConfig[key + 'Text'];
  };

  scope.isDisabled = function(date) {
    if (date === 'today') {
      date = new Date();
    }

    return ((scope.watchData.minDate && scope.compare(date, cache.minDate) < 0) ||
      (scope.watchData.maxDate && scope.compare(date, cache.maxDate) > 0));
  };

  scope.compare = function(date1, date2) {
    return (new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()));
  };

  // Inner change
  scope.dateSelection = function(dt) {
    if (angular.isDefined(dt)) {
      scope.date = dt;
    }
    var date = scope.date ? dateFilter(scope.date, dateFormat) : null; // Setting to NULL is necessary for form validators to function
    element.val(date);
    ngModel.$setViewValue(date);

    if (closeOnDateSelection) {
      scope.isOpen = false;
      element[0].focus();
    }
  };

  scope.keydown = function(evt) {
    if (evt.which === 27) {
      scope.isOpen = false;
      element[0].focus();
    }
  };

  scope.select = function(date) {
    if (date === 'today') {
      var today = new Date();
      if (angular.isDate(scope.date)) {
        date = new Date(scope.date);
        date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate());
      } else {
        date = new Date(today.setHours(0, 0, 0, 0));
      }
    }
    scope.dateSelection(date);
  };

  scope.close = function() {
    scope.isOpen = false;
    element[0].focus();
  };

  scope.$watch('isOpen', function(value) {
    if (value) {
      scope.position = appendToBody ? $position.offset(element) : $position.position(element);
      scope.position.top = scope.position.top + element.prop('offsetHeight');

      $timeout(function() {
        if (onOpenFocus) {
          scope.$broadcast('uib:datepicker.focus');
        }
        $document.bind('click', documentClickBind);
      }, 0, false);
    } else {
      $document.unbind('click', documentClickBind);
    }
  });

  function cameltoDash(string) {
    return string.replace(/([A-Z])/g, function($1) { return '-' + $1.toLowerCase(); });
  }

  function parseDate(viewValue) {
    if (angular.isNumber(viewValue)) {
      // presumably timestamp to date object
      viewValue = new Date(viewValue);
    }

    if (!viewValue) {
      return null;
    } else if (angular.isDate(viewValue) && !isNaN(viewValue)) {
      return viewValue;
    } else if (angular.isString(viewValue)) {
      var date = dateParser.parse(viewValue, dateFormat, scope.date);
      if (isNaN(date)) {
        return undefined;
      } else {
        return date;
      }
    } else {
      return undefined;
    }
  }

  function validator(modelValue, viewValue) {
    var value = modelValue || viewValue;

    if (!attrs.ngRequired && !value) {
      return true;
    }

    if (angular.isNumber(value)) {
      value = new Date(value);
    }
    if (!value) {
      return true;
    } else if (angular.isDate(value) && !isNaN(value)) {
      return true;
    } else if (angular.isString(value)) {
      var date = dateParser.parse(value, dateFormat);
      return !isNaN(date);
    } else {
      return false;
    }
  }

  function documentClickBind(event) {
    var popup = $popup[0];
    var dpContainsTarget = element[0].contains(event.target);
    // The popup node may not be an element node
    // In some browsers (IE) only element nodes have the 'contains' function
    var popupContainsTarget = popup.contains !== undefined && popup.contains(event.target);
    if (scope.isOpen && !(dpContainsTarget || popupContainsTarget)) {
      scope.$apply(function() {
        scope.isOpen = false;
      });
    }
  }

  function inputKeydownBind(evt) {
    if (evt.which === 27 && scope.isOpen) {
      evt.preventDefault();
      evt.stopPropagation();
      scope.$apply(function() {
        scope.isOpen = false;
      });
      element[0].focus();
    } else if (evt.which === 40 && !scope.isOpen) {
      evt.preventDefault();
      evt.stopPropagation();
      scope.$apply(function() {
        scope.isOpen = true;
      });
    }
  }
}])

.directive('uibDatepickerPopup', function() {
  return {
    require: ['ngModel', 'uibDatepickerPopup'],
    controller: 'UibDatepickerPopupController',
    scope: {
      isOpen: '=?',
      currentText: '@',
      clearText: '@',
      closeText: '@',
      dateDisabled: '&',
      customClass: '&'
    },
    link: function(scope, element, attrs, ctrls) {
      var ngModel = ctrls[0],
        ctrl = ctrls[1];

      ctrl.init(ngModel);
    }
  };
})

.directive('uibDatepickerPopupWrap', function() {
  return {
    replace: true,
    transclude: true,
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'template/datepicker/popup.html';
    }
  };
});

/* Deprecated datepicker below */

angular.module('ui.bootstrap.datepicker')

.value('$datepickerSuppressWarning', false)

.controller('DatepickerController', ['$scope', '$attrs', '$parse', '$interpolate', '$log', 'dateFilter', 'uibDatepickerConfig', '$datepickerSuppressError', '$datepickerSuppressWarning', function($scope, $attrs, $parse, $interpolate, $log, dateFilter, datepickerConfig, $datepickerSuppressError, $datepickerSuppressWarning) {
  if (!$datepickerSuppressWarning) {
    $log.warn('DatepickerController is now deprecated. Use UibDatepickerController instead.');
  }

  var self = this,
    ngModelCtrl = { $setViewValue: angular.noop }; // nullModelCtrl;

  this.modes = ['day', 'month', 'year'];

  angular.forEach(['formatDay', 'formatMonth', 'formatYear', 'formatDayHeader', 'formatDayTitle', 'formatMonthTitle',
    'showWeeks', 'startingDay', 'yearRange', 'shortcutPropagation'], function(key, index) {
    self[key] = angular.isDefined($attrs[key]) ? (index < 6 ? $interpolate($attrs[key])($scope.$parent) : $scope.$parent.$eval($attrs[key])) : datepickerConfig[key];
  });

  angular.forEach(['minDate', 'maxDate'], function(key) {
    if ($attrs[key]) {
      $scope.$parent.$watch($parse($attrs[key]), function(value) {
        self[key] = value ? new Date(value) : null;
        self.refreshView();
      });
    } else {
      self[key] = datepickerConfig[key] ? new Date(datepickerConfig[key]) : null;
    }
  });

  angular.forEach(['minMode', 'maxMode'], function(key) {
    if ($attrs[key]) {
      $scope.$parent.$watch($parse($attrs[key]), function(value) {
        self[key] = angular.isDefined(value) ? value : $attrs[key];
        $scope[key] = self[key];
        if ((key == 'minMode' && self.modes.indexOf($scope.datepickerMode) < self.modes.indexOf(self[key])) || (key == 'maxMode' && self.modes.indexOf($scope.datepickerMode) > self.modes.indexOf(self[key]))) {
          $scope.datepickerMode = self[key];
        }
      });
    } else {
      self[key] = datepickerConfig[key] || null;
      $scope[key] = self[key];
    }
  });

  $scope.datepickerMode = $scope.datepickerMode || datepickerConfig.datepickerMode;
  $scope.uniqueId = 'datepicker-' + $scope.$id + '-' + Math.floor(Math.random() * 10000);

  if (angular.isDefined($attrs.initDate)) {
    this.activeDate = $scope.$parent.$eval($attrs.initDate) || new Date();
    $scope.$parent.$watch($attrs.initDate, function(initDate) {
      if (initDate && (ngModelCtrl.$isEmpty(ngModelCtrl.$modelValue) || ngModelCtrl.$invalid)) {
        self.activeDate = initDate;
        self.refreshView();
      }
    });
  } else {
    this.activeDate = new Date();
  }

  $scope.isActive = function(dateObject) {
    if (self.compare(dateObject.date, self.activeDate) === 0) {
      $scope.activeDateId = dateObject.uid;
      return true;
    }
    return false;
  };

  this.init = function(ngModelCtrl_) {
    ngModelCtrl = ngModelCtrl_;

    ngModelCtrl.$render = function() {
      self.render();
    };
  };

  this.render = function() {
    if (ngModelCtrl.$viewValue) {
      var date = new Date(ngModelCtrl.$viewValue),
        isValid = !isNaN(date);

      if (isValid) {
        this.activeDate = date;
      } else if (!$datepickerSuppressError) {
        $log.error('Datepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
      }
    }
    this.refreshView();
  };

  this.refreshView = function() {
    if (this.element) {
      this._refreshView();

      var date = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
      ngModelCtrl.$setValidity('dateDisabled', !date || (this.element && !this.isDisabled(date)));
    }
  };

  this.createDateObject = function(date, format) {
    var model = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null;
    return {
      date: date,
      label: dateFilter(date, format),
      selected: model && this.compare(date, model) === 0,
      disabled: this.isDisabled(date),
      current: this.compare(date, new Date()) === 0,
      customClass: this.customClass(date)
    };
  };

  this.isDisabled = function(date) {
    return ((this.minDate && this.compare(date, this.minDate) < 0) || (this.maxDate && this.compare(date, this.maxDate) > 0) || ($attrs.dateDisabled && $scope.dateDisabled({date: date, mode: $scope.datepickerMode})));
  };

  this.customClass = function(date) {
    return $scope.customClass({date: date, mode: $scope.datepickerMode});
  };

  // Split array into smaller arrays
  this.split = function(arr, size) {
    var arrays = [];
    while (arr.length > 0) {
      arrays.push(arr.splice(0, size));
    }
    return arrays;
  };

  this.fixTimeZone = function(date) {
    var hours = date.getHours();
    date.setHours(hours === 23 ? hours + 2 : 0);
  };

  $scope.select = function(date) {
    if ($scope.datepickerMode === self.minMode) {
      var dt = ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : new Date(0, 0, 0, 0, 0, 0, 0);
      dt.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      ngModelCtrl.$setViewValue(dt);
      ngModelCtrl.$render();
    } else {
      self.activeDate = date;
      $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) - 1];
    }
  };

  $scope.move = function(direction) {
    var year = self.activeDate.getFullYear() + direction * (self.step.years || 0),
      month = self.activeDate.getMonth() + direction * (self.step.months || 0);
    self.activeDate.setFullYear(year, month, 1);
    self.refreshView();
  };

  $scope.toggleMode = function(direction) {
    direction = direction || 1;

    if (($scope.datepickerMode === self.maxMode && direction === 1) || ($scope.datepickerMode === self.minMode && direction === -1)) {
      return;
    }

    $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) + direction];
  };

  // Key event mapper
  $scope.keys = { 13: 'enter', 32: 'space', 33: 'pageup', 34: 'pagedown', 35: 'end', 36: 'home', 37: 'left', 38: 'up', 39: 'right', 40: 'down' };

  var focusElement = function() {
    self.element[0].focus();
  };

  $scope.$on('uib:datepicker.focus', focusElement);

  $scope.keydown = function(evt) {
    var key = $scope.keys[evt.which];

    if (!key || evt.shiftKey || evt.altKey) {
      return;
    }

    evt.preventDefault();
    if (!self.shortcutPropagation) {
      evt.stopPropagation();
    }

    if (key === 'enter' || key === 'space') {
      if (self.isDisabled(self.activeDate)) {
        return; // do nothing
      }
      $scope.select(self.activeDate);
    } else if (evt.ctrlKey && (key === 'up' || key === 'down')) {
      $scope.toggleMode(key === 'up' ? 1 : -1);
    } else {
      self.handleKeyDown(key, evt);
      self.refreshView();
    }
  };
}])

.directive('datepicker', ['$log', '$datepickerSuppressWarning', function($log, $datepickerSuppressWarning) {
  return {
    replace: true,
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'template/datepicker/datepicker.html';
    },
    scope: {
      datepickerMode: '=?',
      dateDisabled: '&',
      customClass: '&',
      shortcutPropagation: '&?'
    },
    require: ['datepicker', '^ngModel'],
    controller: 'DatepickerController',
    controllerAs: 'datepicker',
    link: function(scope, element, attrs, ctrls) {
      if (!$datepickerSuppressWarning) {
        $log.warn('datepicker is now deprecated. Use uib-datepicker instead.');
      }

      var datepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      datepickerCtrl.init(ngModelCtrl);
    }
  };
}])

.directive('daypicker', ['$log', '$datepickerSuppressWarning', function($log, $datepickerSuppressWarning) {
  return {
    replace: true,
    templateUrl: 'template/datepicker/day.html',
    require: ['^datepicker', 'daypicker'],
    controller: 'UibDaypickerController',
    link: function(scope, element, attrs, ctrls) {
      if (!$datepickerSuppressWarning) {
        $log.warn('daypicker is now deprecated. Use uib-daypicker instead.');
      }

      var datepickerCtrl = ctrls[0],
        daypickerCtrl = ctrls[1];

      daypickerCtrl.init(datepickerCtrl);
    }
  };
}])

.directive('monthpicker', ['$log', '$datepickerSuppressWarning', function($log, $datepickerSuppressWarning) {
  return {
    replace: true,
    templateUrl: 'template/datepicker/month.html',
    require: ['^datepicker', 'monthpicker'],
    controller: 'UibMonthpickerController',
    link: function(scope, element, attrs, ctrls) {
      if (!$datepickerSuppressWarning) {
        $log.warn('monthpicker is now deprecated. Use uib-monthpicker instead.');
      }

      var datepickerCtrl = ctrls[0],
        monthpickerCtrl = ctrls[1];

      monthpickerCtrl.init(datepickerCtrl);
    }
  };
}])

.directive('yearpicker', ['$log', '$datepickerSuppressWarning', function($log, $datepickerSuppressWarning) {
  return {
    replace: true,
    templateUrl: 'template/datepicker/year.html',
    require: ['^datepicker', 'yearpicker'],
    controller: 'UibYearpickerController',
    link: function(scope, element, attrs, ctrls) {
      if (!$datepickerSuppressWarning) {
        $log.warn('yearpicker is now deprecated. Use uib-yearpicker instead.');
      }

      var ctrl = ctrls[0];
      angular.extend(ctrl, ctrls[1]);
      ctrl.yearpickerInit();

      ctrl.refreshView();
    }
  };
}])

.directive('datepickerPopup', ['$log', '$datepickerSuppressWarning', function($log, $datepickerSuppressWarning) {
  return {
    require: ['ngModel', 'datepickerPopup'],
    controller: 'UibDatepickerPopupController',
    scope: {
      isOpen: '=?',
      currentText: '@',
      clearText: '@',
      closeText: '@',
      dateDisabled: '&',
      customClass: '&'
    },
    link: function(scope, element, attrs, ctrls) {
      if (!$datepickerSuppressWarning) {
        $log.warn('datepicker-popup is now deprecated. Use uib-datepicker-popup instead.');
      }

      var ngModel = ctrls[0],
        ctrl = ctrls[1];

      ctrl.init(ngModel);
    }
  };
}])

.directive('datepickerPopupWrap', ['$log', '$datepickerSuppressWarning', function($log, $datepickerSuppressWarning) {
  return {
    replace: true,
    transclude: true,
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'template/datepicker/popup.html';
    },
    link: function() {
      if (!$datepickerSuppressWarning) {
        $log.warn('datepicker-popup-wrap is now deprecated. Use uib-datepicker-popup-wrap instead.');
      }
    }
  };
}]);

angular.module('ui.bootstrap.dateparser', [])

.service('uibDateParser', ['$log', '$locale', 'orderByFilter', function($log, $locale, orderByFilter) {
  // Pulled from https://github.com/mbostock/d3/blob/master/src/format/requote.js
  var SPECIAL_CHARACTERS_REGEXP = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

  var localeId;
  var formatCodeToRegex;

  this.init = function() {
    localeId = $locale.id;

    this.parsers = {};

    formatCodeToRegex = {
      'yyyy': {
        regex: '\\d{4}',
        apply: function(value) { this.year = +value; }
      },
      'yy': {
        regex: '\\d{2}',
        apply: function(value) { this.year = +value + 2000; }
      },
      'y': {
        regex: '\\d{1,4}',
        apply: function(value) { this.year = +value; }
      },
      'MMMM': {
        regex: $locale.DATETIME_FORMATS.MONTH.join('|'),
        apply: function(value) { this.month = $locale.DATETIME_FORMATS.MONTH.indexOf(value); }
      },
      'MMM': {
        regex: $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
        apply: function(value) { this.month = $locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value); }
      },
      'MM': {
        regex: '0[1-9]|1[0-2]',
        apply: function(value) { this.month = value - 1; }
      },
      'M': {
        regex: '[1-9]|1[0-2]',
        apply: function(value) { this.month = value - 1; }
      },
      'dd': {
        regex: '[0-2][0-9]{1}|3[0-1]{1}',
        apply: function(value) { this.date = +value; }
      },
      'd': {
        regex: '[1-2]?[0-9]{1}|3[0-1]{1}',
        apply: function(value) { this.date = +value; }
      },
      'EEEE': {
        regex: $locale.DATETIME_FORMATS.DAY.join('|')
      },
      'EEE': {
        regex: $locale.DATETIME_FORMATS.SHORTDAY.join('|')
      },
      'HH': {
        regex: '(?:0|1)[0-9]|2[0-3]',
        apply: function(value) { this.hours = +value; }
      },
      'hh': {
        regex: '0[0-9]|1[0-2]',
        apply: function(value) { this.hours = +value; }
      },
      'H': {
        regex: '1?[0-9]|2[0-3]',
        apply: function(value) { this.hours = +value; }
      },
      'h': {
        regex: '[0-9]|1[0-2]',
        apply: function(value) { this.hours = +value; }
      },
      'mm': {
        regex: '[0-5][0-9]',
        apply: function(value) { this.minutes = +value; }
      },
      'm': {
        regex: '[0-9]|[1-5][0-9]',
        apply: function(value) { this.minutes = +value; }
      },
      'sss': {
        regex: '[0-9][0-9][0-9]',
        apply: function(value) { this.milliseconds = +value; }
      },
      'ss': {
        regex: '[0-5][0-9]',
        apply: function(value) { this.seconds = +value; }
      },
      's': {
        regex: '[0-9]|[1-5][0-9]',
        apply: function(value) { this.seconds = +value; }
      },
      'a': {
        regex: $locale.DATETIME_FORMATS.AMPMS.join('|'),
        apply: function(value) {
          if (this.hours === 12) {
            this.hours = 0;
          }

          if (value === 'PM') {
            this.hours += 12;
          }
        }
      }
    };
  };

  this.init();

  function createParser(format) {
    var map = [], regex = format.split('');

    angular.forEach(formatCodeToRegex, function(data, code) {
      var index = format.indexOf(code);

      if (index > -1) {
        format = format.split('');

        regex[index] = '(' + data.regex + ')';
        format[index] = '$'; // Custom symbol to define consumed part of format
        for (var i = index + 1, n = index + code.length; i < n; i++) {
          regex[i] = '';
          format[i] = '$';
        }
        format = format.join('');

        map.push({ index: index, apply: data.apply });
      }
    });

    return {
      regex: new RegExp('^' + regex.join('') + '$'),
      map: orderByFilter(map, 'index')
    };
  }

  this.parse = function(input, format, baseDate) {
    if (!angular.isString(input) || !format) {
      return input;
    }

    format = $locale.DATETIME_FORMATS[format] || format;
    format = format.replace(SPECIAL_CHARACTERS_REGEXP, '\\$&');

    if ($locale.id !== localeId) {
      this.init();
    }

    if (!this.parsers[format]) {
      this.parsers[format] = createParser(format);
    }

    var parser = this.parsers[format],
        regex = parser.regex,
        map = parser.map,
        results = input.match(regex);

    if (results && results.length) {
      var fields, dt;
      if (angular.isDate(baseDate) && !isNaN(baseDate.getTime())) {
        fields = {
          year: baseDate.getFullYear(),
          month: baseDate.getMonth(),
          date: baseDate.getDate(),
          hours: baseDate.getHours(),
          minutes: baseDate.getMinutes(),
          seconds: baseDate.getSeconds(),
          milliseconds: baseDate.getMilliseconds()
        };
      } else {
        if (baseDate) {
          $log.warn('dateparser:', 'baseDate is not a valid date');
        }
        fields = { year: 1900, month: 0, date: 1, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 };
      }

      for (var i = 1, n = results.length; i < n; i++) {
        var mapper = map[i-1];
        if (mapper.apply) {
          mapper.apply.call(fields, results[i]);
        }
      }

      if (isValid(fields.year, fields.month, fields.date)) {
        if (angular.isDate(baseDate) && !isNaN(baseDate.getTime())) {
          dt = new Date(baseDate);
          dt.setFullYear(fields.year, fields.month, fields.date,
            fields.hours, fields.minutes, fields.seconds,
            fields.milliseconds || 0);
        } else {
          dt = new Date(fields.year, fields.month, fields.date,
            fields.hours, fields.minutes, fields.seconds,
            fields.milliseconds || 0);
        }
      }

      return dt;
    }
  };

  // Check if date is valid for specific month (and year for February).
  // Month: 0 = Jan, 1 = Feb, etc
  function isValid(year, month, date) {
    if (date < 1) {
      return false;
    }

    if (month === 1 && date > 28) {
      return date === 29 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
    }

    if (month === 3 || month === 5 || month === 8 || month === 10) {
      return date < 31;
    }

    return true;
  }
}]);

/* Deprecated dateparser below */

angular.module('ui.bootstrap.dateparser')

.value('$dateParserSuppressWarning', false)

.service('dateParser', ['$log', '$dateParserSuppressWarning', 'uibDateParser', function($log, $dateParserSuppressWarning, uibDateParser) {
  if (!$dateParserSuppressWarning) {
    $log.warn('dateParser is now deprecated. Use uibDateParser instead.');
  }

  angular.extend(this, uibDateParser);
}]);

angular.module('ui.bootstrap.pagination', [])
.controller('UibPaginationController', ['$scope', '$attrs', '$parse', function($scope, $attrs, $parse) {
  var self = this,
      ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
      setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

  this.init = function(ngModelCtrl_, config) {
    ngModelCtrl = ngModelCtrl_;
    this.config = config;

    ngModelCtrl.$render = function() {
      self.render();
    };

    if ($attrs.itemsPerPage) {
      $scope.$parent.$watch($parse($attrs.itemsPerPage), function(value) {
        self.itemsPerPage = parseInt(value, 10);
        $scope.totalPages = self.calculateTotalPages();
      });
    } else {
      this.itemsPerPage = config.itemsPerPage;
    }

    $scope.$watch('totalItems', function() {
      $scope.totalPages = self.calculateTotalPages();
    });

    $scope.$watch('totalPages', function(value) {
      setNumPages($scope.$parent, value); // Readonly variable

      if ( $scope.page > value ) {
        $scope.selectPage(value);
      } else {
        ngModelCtrl.$render();
      }
    });
  };

  this.calculateTotalPages = function() {
    var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
    return Math.max(totalPages || 0, 1);
  };

  this.render = function() {
    $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
  };

  $scope.selectPage = function(page, evt) {
    if (evt) {
      evt.preventDefault();
    }

    var clickAllowed = !$scope.ngDisabled || !evt;
    if (clickAllowed && $scope.page !== page && page > 0 && page <= $scope.totalPages) {
      if (evt && evt.target) {
        evt.target.blur();
      }
      ngModelCtrl.$setViewValue(page);
      ngModelCtrl.$render();
    }
  };

  $scope.getText = function(key) {
    return $scope[key + 'Text'] || self.config[key + 'Text'];
  };

  $scope.noPrevious = function() {
    return $scope.page === 1;
  };

  $scope.noNext = function() {
    return $scope.page === $scope.totalPages;
  };
}])

.constant('uibPaginationConfig', {
  itemsPerPage: 10,
  boundaryLinks: false,
  directionLinks: true,
  firstText: 'First',
  previousText: 'Previous',
  nextText: 'Next',
  lastText: 'Last',
  rotate: true
})

.directive('uibPagination', ['$parse', 'uibPaginationConfig', function($parse, paginationConfig) {
  return {
    restrict: 'EA',
    scope: {
      totalItems: '=',
      firstText: '@',
      previousText: '@',
      nextText: '@',
      lastText: '@',
      ngDisabled:'='
    },
    require: ['uibPagination', '?ngModel'],
    controller: 'UibPaginationController',
    controllerAs: 'pagination',
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'template/pagination/pagination.html';
    },
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
         return; // do nothing if no ng-model
      }

      // Setup configuration parameters
      var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
          rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
      scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
      scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks;

      paginationCtrl.init(ngModelCtrl, paginationConfig);

      if (attrs.maxSize) {
        scope.$parent.$watch($parse(attrs.maxSize), function(value) {
          maxSize = parseInt(value, 10);
          paginationCtrl.render();
        });
      }

      // Create page object used in template
      function makePage(number, text, isActive) {
        return {
          number: number,
          text: text,
          active: isActive
        };
      }

      function getPages(currentPage, totalPages) {
        var pages = [];

        // Default page limits
        var startPage = 1, endPage = totalPages;
        var isMaxSized = angular.isDefined(maxSize) && maxSize < totalPages;

        // recompute if maxSize
        if (isMaxSized) {
          if (rotate) {
            // Current page is displayed in the middle of the visible ones
            startPage = Math.max(currentPage - Math.floor(maxSize/2), 1);
            endPage   = startPage + maxSize - 1;

            // Adjust if limit is exceeded
            if (endPage > totalPages) {
              endPage   = totalPages;
              startPage = endPage - maxSize + 1;
            }
          } else {
            // Visible pages are paginated with maxSize
            startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

            // Adjust last page if limit is exceeded
            endPage = Math.min(startPage + maxSize - 1, totalPages);
          }
        }

        // Add page number links
        for (var number = startPage; number <= endPage; number++) {
          var page = makePage(number, number, number === currentPage);
          pages.push(page);
        }

        // Add links to move between page sets
        if (isMaxSized && ! rotate) {
          if (startPage > 1) {
            var previousPageSet = makePage(startPage - 1, '...', false);
            pages.unshift(previousPageSet);
          }

          if (endPage < totalPages) {
            var nextPageSet = makePage(endPage + 1, '...', false);
            pages.push(nextPageSet);
          }
        }

        return pages;
      }

      var originalRender = paginationCtrl.render;
      paginationCtrl.render = function() {
        originalRender();
        if (scope.page > 0 && scope.page <= scope.totalPages) {
          scope.pages = getPages(scope.page, scope.totalPages);
        }
      };
    }
  };
}])

.constant('uibPagerConfig', {
  itemsPerPage: 10,
  previousText: '« Previous',
  nextText: 'Next »',
  align: true
})

.directive('uibPager', ['uibPagerConfig', function(pagerConfig) {
  return {
    restrict: 'EA',
    scope: {
      totalItems: '=',
      previousText: '@',
      nextText: '@',
      ngDisabled: '='
    },
    require: ['uibPager', '?ngModel'],
    controller: 'UibPaginationController',
    controllerAs: 'pagination',
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'template/pagination/pager.html';
    },
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
         return; // do nothing if no ng-model
      }

      scope.align = angular.isDefined(attrs.align) ? scope.$parent.$eval(attrs.align) : pagerConfig.align;
      paginationCtrl.init(ngModelCtrl, pagerConfig);
    }
  };
}]);

/* Deprecated Pagination Below */

angular.module('ui.bootstrap.pagination')
.value('$paginationSuppressWarning', false)
.controller('PaginationController', ['$scope', '$attrs', '$parse', '$log', '$paginationSuppressWarning', function($scope, $attrs, $parse, $log, $paginationSuppressWarning) {
  if (!$paginationSuppressWarning) {
    $log.warn('PaginationController is now deprecated. Use UibPaginationController instead.');
  }

  var self = this,
    ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
    setNumPages = $attrs.numPages ? $parse($attrs.numPages).assign : angular.noop;

  this.init = function(ngModelCtrl_, config) {
    ngModelCtrl = ngModelCtrl_;
    this.config = config;

    ngModelCtrl.$render = function() {
      self.render();
    };

    if ($attrs.itemsPerPage) {
      $scope.$parent.$watch($parse($attrs.itemsPerPage), function(value) {
        self.itemsPerPage = parseInt(value, 10);
        $scope.totalPages = self.calculateTotalPages();
      });
    } else {
      this.itemsPerPage = config.itemsPerPage;
    }

    $scope.$watch('totalItems', function() {
      $scope.totalPages = self.calculateTotalPages();
    });

    $scope.$watch('totalPages', function(value) {
      setNumPages($scope.$parent, value); // Readonly variable

      if ( $scope.page > value ) {
        $scope.selectPage(value);
      } else {
        ngModelCtrl.$render();
      }
    });
  };

  this.calculateTotalPages = function() {
    var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil($scope.totalItems / this.itemsPerPage);
    return Math.max(totalPages || 0, 1);
  };

  this.render = function() {
    $scope.page = parseInt(ngModelCtrl.$viewValue, 10) || 1;
  };

  $scope.selectPage = function(page, evt) {
    if (evt) {
      evt.preventDefault();
    }

    var clickAllowed = !$scope.ngDisabled || !evt;
    if (clickAllowed && $scope.page !== page && page > 0 && page <= $scope.totalPages) {
      if (evt && evt.target) {
        evt.target.blur();
      }
      ngModelCtrl.$setViewValue(page);
      ngModelCtrl.$render();
    }
  };

  $scope.getText = function(key) {
    return $scope[key + 'Text'] || self.config[key + 'Text'];
  };

  $scope.noPrevious = function() {
    return $scope.page === 1;
  };

  $scope.noNext = function() {
    return $scope.page === $scope.totalPages;
  };
}])
.directive('pagination', ['$parse', 'uibPaginationConfig', '$log', '$paginationSuppressWarning', function($parse, paginationConfig, $log, $paginationSuppressWarning) {
  return {
    restrict: 'EA',
    scope: {
      totalItems: '=',
      firstText: '@',
      previousText: '@',
      nextText: '@',
      lastText: '@',
      ngDisabled:'='
    },
    require: ['pagination', '?ngModel'],
    controller: 'PaginationController',
    controllerAs: 'pagination',
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'template/pagination/pagination.html';
    },
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      if (!$paginationSuppressWarning) {
        $log.warn('pagination is now deprecated. Use uib-pagination instead.');
      }
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
         return; // do nothing if no ng-model
      }

      // Setup configuration parameters
      var maxSize = angular.isDefined(attrs.maxSize) ? scope.$parent.$eval(attrs.maxSize) : paginationConfig.maxSize,
          rotate = angular.isDefined(attrs.rotate) ? scope.$parent.$eval(attrs.rotate) : paginationConfig.rotate;
      scope.boundaryLinks = angular.isDefined(attrs.boundaryLinks) ? scope.$parent.$eval(attrs.boundaryLinks) : paginationConfig.boundaryLinks;
      scope.directionLinks = angular.isDefined(attrs.directionLinks) ? scope.$parent.$eval(attrs.directionLinks) : paginationConfig.directionLinks;

      paginationCtrl.init(ngModelCtrl, paginationConfig);

      if (attrs.maxSize) {
        scope.$parent.$watch($parse(attrs.maxSize), function(value) {
          maxSize = parseInt(value, 10);
          paginationCtrl.render();
        });
      }

      // Create page object used in template
      function makePage(number, text, isActive) {
        return {
          number: number,
          text: text,
          active: isActive
        };
      }

      function getPages(currentPage, totalPages) {
        var pages = [];

        // Default page limits
        var startPage = 1, endPage = totalPages;
        var isMaxSized = angular.isDefined(maxSize) && maxSize < totalPages;

        // recompute if maxSize
        if (isMaxSized) {
          if (rotate) {
            // Current page is displayed in the middle of the visible ones
            startPage = Math.max(currentPage - Math.floor(maxSize/2), 1);
            endPage   = startPage + maxSize - 1;

            // Adjust if limit is exceeded
            if (endPage > totalPages) {
              endPage   = totalPages;
              startPage = endPage - maxSize + 1;
            }
          } else {
            // Visible pages are paginated with maxSize
            startPage = ((Math.ceil(currentPage / maxSize) - 1) * maxSize) + 1;

            // Adjust last page if limit is exceeded
            endPage = Math.min(startPage + maxSize - 1, totalPages);
          }
        }

        // Add page number links
        for (var number = startPage; number <= endPage; number++) {
          var page = makePage(number, number, number === currentPage);
          pages.push(page);
        }

        // Add links to move between page sets
        if (isMaxSized && ! rotate) {
          if (startPage > 1) {
            var previousPageSet = makePage(startPage - 1, '...', false);
            pages.unshift(previousPageSet);
          }

          if (endPage < totalPages) {
            var nextPageSet = makePage(endPage + 1, '...', false);
            pages.push(nextPageSet);
          }
        }

        return pages;
      }

      var originalRender = paginationCtrl.render;
      paginationCtrl.render = function() {
        originalRender();
        if (scope.page > 0 && scope.page <= scope.totalPages) {
          scope.pages = getPages(scope.page, scope.totalPages);
        }
      };
    }
  };
}])

.directive('pager', ['uibPagerConfig', '$log', '$paginationSuppressWarning', function(pagerConfig, $log, $paginationSuppressWarning) {
  return {
    restrict: 'EA',
    scope: {
      totalItems: '=',
      previousText: '@',
      nextText: '@',
      ngDisabled: '='
    },
    require: ['pager', '?ngModel'],
    controller: 'PaginationController',
    controllerAs: 'pagination',
    templateUrl: function(element, attrs) {
      return attrs.templateUrl || 'template/pagination/pager.html';
    },
    replace: true,
    link: function(scope, element, attrs, ctrls) {
      if (!$paginationSuppressWarning) {
        $log.warn('pager is now deprecated. Use uib-pager instead.');
      }
      var paginationCtrl = ctrls[0], ngModelCtrl = ctrls[1];

      if (!ngModelCtrl) {
         return; // do nothing if no ng-model
      }

      scope.align = angular.isDefined(attrs.align) ? scope.$parent.$eval(attrs.align) : pagerConfig.align;
      paginationCtrl.init(ngModelCtrl, pagerConfig);
    }
  };
}]);

angular.module("template/typeahead/typeahead-match.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/typeahead/typeahead-match.html",
    "<a href tabindex=\"-1\" ng-bind-html=\"match.label | uibTypeaheadHighlight:query\"></a>\n" +
    "");
}]);

angular.module("template/typeahead/typeahead-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/typeahead/typeahead-popup.html",
    "<ul class=\"dropdown-menu\" ng-show=\"isOpen() && !moveInProgress\" ng-style=\"{top: position().top+'px', left: position().left+'px'}\" style=\"display: block;\" role=\"listbox\" aria-hidden=\"{{!isOpen()}}\">\n" +
    "    <li ng-repeat=\"match in matches track by $index\" ng-class=\"{active: isActive($index) }\" ng-mouseenter=\"selectActive($index)\" ng-click=\"selectMatch($index)\" role=\"option\" id=\"{{::match.id}}\">\n" +
    "        <div uib-typeahead-match index=\"$index\" match=\"match\" query=\"query\" template-url=\"templateUrl\"></div>\n" +
    "    </li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("template/modal/backdrop.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/modal/backdrop.html",
    "<div uib-modal-animation-class=\"fade\"\n" +
    "     modal-in-class=\"in\"\n" +
    "     ng-style=\"{'z-index': 1040 + (index && 1 || 0) + index*10}\"\n" +
    "></div>\n" +
    "");
}]);

angular.module("template/modal/window.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/modal/window.html",
    "<div modal-render=\"{{$isRendered}}\" tabindex=\"-1\" role=\"dialog\" class=\"modal\"\n" +
    "    uib-modal-animation-class=\"fade\"\n" +
    "    modal-in-class=\"in\"\n" +
    "    ng-style=\"{'z-index': 1050 + index*10, display: 'block'}\">\n" +
    "    <div class=\"modal-dialog\" ng-class=\"size ? 'modal-' + size : ''\"><div class=\"modal-content\" uib-modal-transclude></div></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/datepicker/datepicker.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/datepicker/datepicker.html",
    "<div ng-switch=\"datepickerMode\" role=\"application\" ng-keydown=\"keydown($event)\">\n" +
    "  <uib-daypicker ng-switch-when=\"day\" tabindex=\"0\"></uib-daypicker>\n" +
    "  <uib-monthpicker ng-switch-when=\"month\" tabindex=\"0\"></uib-monthpicker>\n" +
    "  <uib-yearpicker ng-switch-when=\"year\" tabindex=\"0\"></uib-yearpicker>\n" +
    "</div>");
}]);

angular.module("template/datepicker/day.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/datepicker/day.html",
    "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
    "      <th colspan=\"{{::5 + showWeeks}}\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
    "    </tr>\n" +
    "    <tr>\n" +
    "      <th ng-if=\"showWeeks\" class=\"text-center\"></th>\n" +
    "      <th ng-repeat=\"label in ::labels track by $index\" class=\"text-center\"><small aria-label=\"{{::label.full}}\">{{::label.abbr}}</small></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr ng-repeat=\"row in rows track by $index\">\n" +
    "      <td ng-if=\"showWeeks\" class=\"text-center h6\"><em>{{ weekNumbers[$index] }}</em></td>\n" +
    "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\" ng-class=\"::dt.customClass\">\n" +
    "        <button type=\"button\" style=\"min-width:100%;\" class=\"btn btn-default btn-sm\" ng-class=\"{'btn-info': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"::{'text-muted': dt.secondary, 'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
}]);

angular.module("template/datepicker/month.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/datepicker/month.html",
    "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
    "      <th><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr ng-repeat=\"row in rows track by $index\">\n" +
    "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\" ng-class=\"::dt.customClass\">\n" +
    "        <button type=\"button\" style=\"min-width:100%;\" class=\"btn btn-default\" ng-class=\"{'btn-info': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
}]);

angular.module("template/datepicker/popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/datepicker/popup.html",
    "<ul class=\"dropdown-menu\" dropdown-nested ng-if=\"isOpen\" style=\"display: block\" ng-style=\"{top: position.top+'px', left: position.left+'px'}\" ng-keydown=\"keydown($event)\" ng-click=\"$event.stopPropagation()\">\n" +
    "	<li ng-transclude></li>\n" +
    "	<li ng-if=\"showButtonBar\" style=\"padding:10px 9px 2px\">\n" +
    "		<span class=\"btn-group pull-left\">\n" +
    "			<button type=\"button\" class=\"btn btn-sm btn-info\" ng-click=\"select('today')\" ng-disabled=\"isDisabled('today')\">{{ getText('current') }}</button>\n" +
    "			<button type=\"button\" class=\"btn btn-sm btn-danger\" ng-click=\"select(null)\">{{ getText('clear') }}</button>\n" +
    "		</span>\n" +
    "		<button type=\"button\" class=\"btn btn-sm btn-success pull-right\" ng-click=\"close()\">{{ getText('close') }}</button>\n" +
    "	</li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("template/datepicker/year.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/datepicker/year.html",
    "<table role=\"grid\" aria-labelledby=\"{{::uniqueId}}-title\" aria-activedescendant=\"{{activeDateId}}\">\n" +
    "  <thead>\n" +
    "    <tr>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-left\" ng-click=\"move(-1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-left\"></i></button></th>\n" +
    "      <th colspan=\"3\"><button id=\"{{::uniqueId}}-title\" role=\"heading\" aria-live=\"assertive\" aria-atomic=\"true\" type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"toggleMode()\" ng-disabled=\"datepickerMode === maxMode\" tabindex=\"-1\" style=\"width:100%;\"><strong>{{title}}</strong></button></th>\n" +
    "      <th><button type=\"button\" class=\"btn btn-default btn-sm pull-right\" ng-click=\"move(1)\" tabindex=\"-1\"><i class=\"glyphicon glyphicon-chevron-right\"></i></button></th>\n" +
    "    </tr>\n" +
    "  </thead>\n" +
    "  <tbody>\n" +
    "    <tr ng-repeat=\"row in rows track by $index\">\n" +
    "      <td ng-repeat=\"dt in row track by dt.date\" class=\"text-center\" role=\"gridcell\" id=\"{{::dt.uid}}\" ng-class=\"::dt.customClass\">\n" +
    "        <button type=\"button\" style=\"min-width:100%;\" class=\"btn btn-default\" ng-class=\"{'btn-info': dt.selected, active: isActive(dt)}\" ng-click=\"select(dt.date)\" ng-disabled=\"dt.disabled\" tabindex=\"-1\"><span ng-class=\"::{'text-info': dt.current}\">{{::dt.label}}</span></button>\n" +
    "      </td>\n" +
    "    </tr>\n" +
    "  </tbody>\n" +
    "</table>\n" +
    "");
}]);

angular.module("template/pagination/pager.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/pagination/pager.html",
    "<ul class=\"pager\">\n" +
    "  <li ng-class=\"{disabled: noPrevious()||ngDisabled, previous: align}\"><a href ng-click=\"selectPage(page - 1, $event)\">{{::getText('previous')}}</a></li>\n" +
    "  <li ng-class=\"{disabled: noNext()||ngDisabled, next: align}\"><a href ng-click=\"selectPage(page + 1, $event)\">{{::getText('next')}}</a></li>\n" +
    "</ul>\n" +
    "");
}]);

angular.module("template/pagination/pagination.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/pagination/pagination.html",
    "<ul class=\"pagination\">\n" +
    "  <li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"pagination-first\"><a href ng-click=\"selectPage(1, $event)\">{{::getText('first')}}</a></li>\n" +
    "  <li ng-if=\"::directionLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"pagination-prev\"><a href ng-click=\"selectPage(page - 1, $event)\">{{::getText('previous')}}</a></li>\n" +
    "  <li ng-repeat=\"page in pages track by $index\" ng-class=\"{active: page.active,disabled: ngDisabled&&!page.active}\" class=\"pagination-page\"><a href ng-click=\"selectPage(page.number, $event)\">{{page.text}}</a></li>\n" +
    "  <li ng-if=\"::directionLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"pagination-next\"><a href ng-click=\"selectPage(page + 1, $event)\">{{::getText('next')}}</a></li>\n" +
    "  <li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"pagination-last\"><a href ng-click=\"selectPage(totalPages, $event)\">{{::getText('last')}}</a></li>\n" +
    "</ul>\n" +
    "");
}]);
