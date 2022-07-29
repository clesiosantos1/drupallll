/**
 * @file
 * JavaScript behaviors for CodeMirror integration.
 */

(function ($, Drupal) {

  'use strict';

  // @see http://codemirror.net/doc/manual.html#config
  Drupal.webform = Drupal.webform || {};
  Drupal.webform.codeMirror = Drupal.webform.codeMirror || {};
  Drupal.webform.codeMirror.options = Drupal.webform.codeMirror.options || {};

  /**
   * Initialize CodeMirror editor.
   *
   * @type {Drupal~behavior}
   */
  Drupal.behaviors.webformCodeMirror = {
    attach: function (context) {
      if (!window.CodeMirror) {
        return;
      }

      // Webform CodeMirror editor.
      $(context).find('textarea.js-webform-codemirror').once('webform-codemirror').each(function () {
        var $input = $(this);

        // Open all closed details, so that editor height is correctly calculated.
        var $details = $input.parents('details:not([open])');
        $details.attr('open', 'open');

        // #59 HTML5 required attribute breaks hack for webform submission.
        // https://github.com/marijnh/CodeMirror-old/issues/59
        $input.removeAttr('required');

        var options = $.extend({
          mode: $input.attr('data-webform-codemirror-mode'),
          lineNumbers: true,
          lineWrapping: ($input.attr('wrap') !== 'off'),
          viewportMargin: Infinity,
          readOnly: !!($input.prop('readonly') || $input.prop('disabled')),
          extraKeys: {
            // Setting for using spaces instead of tabs - https://github.com/codemirror/CodeMirror/issues/988
            Tab: function (cm) {
              var spaces = Array(cm.getOption('indentUnit') + 1).join(' ');
              cm.replaceSelection(spaces, 'end', '+element');
            },
            // On 'Escape' move to the next tabbable input.
            // @see http://bgrins.github.io/codemirror-accessible/
            Esc: function (cm) {
              // Must show and then textarea so that we can determine
              // its tabindex.
              var textarea = $(cm.getTextArea());
              $(textarea).show().addClass('visually-hidden');
              var $tabbable = $(':tabbable');
              var tabindex = $tabbable.index(textarea);
              $(textarea).hide().removeClass('visually-hidden');

              // Tabindex + 2 accounts for the CodeMirror's iframe.
              $tabbable.eq(tabindex + 2).trigger('focus');
            }

          }
        }, Drupal.webform.codeMirror.options);

        var editor = CodeMirror.fromTextArea(this, options);

        // Now, close details.
        $details.removeAttr('open');

        // Apply the textarea's min/max-height to the CodeMirror editor.
        if ($input.css('min-height')) {
          var minHeight = $input.css('min-height');
          $(editor.getWrapperElement())
            .css('min-height', minHeight)
            .find('.CodeMirror-scroll')
            .css('min-height', minHeight);
        }
        if ($input.css('max-height')) {
          var maxHeight = $input.css('max-height');
          $(editor.getWrapperElement())
            .css('max-height', maxHeight)
            .find('.CodeMirror-scroll')
            .css('max-height', maxHeight);
        }

        // Issue #2764443: CodeMirror is not setting submitted value when
        // rendered within a webform UI dialog or within an Ajaxified element.
        var changeTimer = null;
        editor.on('change', function () {
          if (changeTimer) {
            window.clearTimeout(changeTimer);
            changeTimer = null;
          }
          changeTimer = setTimeout(function () {editor.save();}, 500);
        });

        // Update CodeMirror when the textarea's value has changed.
        // @see webform.states.js
        $input.on('change', function () {
          editor.getDoc().setValue($input.val());
        });

        // Set CodeMirror to be readonly when the textarea is disabled.
        // @see webform.states.js
        $input.on('webform:disabled', function () {
          editor.setOption('readOnly', $input.is(':disabled'));
        });

        // Delay refreshing CodeMirror for 500 millisecond while the dialog is
        // still being rendered.
        // @see http://stackoverflow.com/questions/8349571/codemirror-editor-is-not-loading-content-until-clicked
        setTimeout(function () {
          // Show tab panel and open details.
          var $tabPanel = $input.parents('.ui-tabs-panel:hidden');
          var $details = $input.parents('details:not([open])');

          if (!$tabPanel.length && $details.length) {
            return;
          }

          $tabPanel.show();
          $details.attr('open', 'open');

          editor.refresh();

          // Hide tab panel and close details.
          $tabPanel.hide();
          $details.removeAttr('open');
        }, 500);
      });

      // Webform CodeMirror syntax coloring.
      if (window.CodeMirror.runMode) {
        $(context).find('.js-webform-codemirror-runmode').once('webform-codemirror-runmode').each(function () {
          // Mode Runner - http://codemirror.net/demo/runmode.html
          CodeMirror.runMode($(this).addClass('cm-s-default').text(), $(this).attr('data-webform-codemirror-mode'), this);
        });
      }

    }
  };

})(jQuery, Drupal);
;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal, drupalSettings) {
  var handleFragmentLinkClickOrHashChange = function handleFragmentLinkClickOrHashChange(e, $target) {
    $target.parents('.vertical-tabs__pane').each(function (index, pane) {
      $(pane).data('verticalTab').focus();
    });
  };

  Drupal.behaviors.verticalTabs = {
    attach: function attach(context) {
      var width = drupalSettings.widthBreakpoint || 640;
      var mq = "(max-width: ".concat(width, "px)");

      if (window.matchMedia(mq).matches) {
        return;
      }

      $(once('vertical-tabs-fragments', 'body')).on('formFragmentLinkClickOrHashChange.verticalTabs', handleFragmentLinkClickOrHashChange);
      once('vertical-tabs', '[data-vertical-tabs-panes]', context).forEach(function (verticalTab) {
        var $this = $(verticalTab).addClass('vertical-tabs__panes');
        var focusID = $this.find(':hidden.vertical-tabs__active-tab').val();
        var tabFocus;
        var $details = $this.find('> details');

        if ($details.length === 0) {
          return;
        }

        var tabList = $('<ul class="vertical-tabs__menu"></ul>');
        $this.wrap('<div class="vertical-tabs clearfix"></div>').before(tabList);
        $details.each(function () {
          var $that = $(this);
          var verticalTab = new Drupal.verticalTab({
            title: $that.find('> summary').text(),
            details: $that
          });
          tabList.append(verticalTab.item);
          $that.removeClass('collapsed').attr('open', true).addClass('vertical-tabs__pane').data('verticalTab', verticalTab);

          if (this.id === focusID) {
            tabFocus = $that;
          }
        });
        $(tabList).find('> li').eq(0).addClass('first');
        $(tabList).find('> li').eq(-1).addClass('last');

        if (!tabFocus) {
          var $locationHash = $this.find(window.location.hash);

          if (window.location.hash && $locationHash.length) {
            tabFocus = $locationHash.closest('.vertical-tabs__pane');
          } else {
            tabFocus = $this.find('> .vertical-tabs__pane').eq(0);
          }
        }

        if (tabFocus.length) {
          tabFocus.data('verticalTab').focus();
        }
      });
    }
  };

  Drupal.verticalTab = function (settings) {
    var self = this;
    $.extend(this, settings, Drupal.theme('verticalTab', settings));
    this.link.attr('href', "#".concat(settings.details.attr('id')));
    this.link.on('click', function (e) {
      e.preventDefault();
      self.focus();
    });
    this.link.on('keydown', function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        self.focus();
        $('.vertical-tabs__pane :input:visible:enabled').eq(0).trigger('focus');
      }
    });
    this.details.on('summaryUpdated', function () {
      self.updateSummary();
    }).trigger('summaryUpdated');
  };

  Drupal.verticalTab.prototype = {
    focus: function focus() {
      this.details.siblings('.vertical-tabs__pane').each(function () {
        var tab = $(this).data('verticalTab');
        tab.details.hide();
        tab.item.removeClass('is-selected');
      }).end().show().siblings(':hidden.vertical-tabs__active-tab').val(this.details.attr('id'));
      this.item.addClass('is-selected');
      $('#active-vertical-tab').remove();
      this.link.append("<span id=\"active-vertical-tab\" class=\"visually-hidden\">".concat(Drupal.t('(active tab)'), "</span>"));
    },
    updateSummary: function updateSummary() {
      this.summary.html(this.details.drupalGetSummary());
    },
    tabShow: function tabShow() {
      this.item.show();
      this.item.closest('.js-form-type-vertical-tabs').show();
      this.item.parent().children('.vertical-tabs__menu-item').removeClass('first').filter(':visible').eq(0).addClass('first');
      this.details.removeClass('vertical-tab--hidden').show();
      this.focus();
      return this;
    },
    tabHide: function tabHide() {
      this.item.hide();
      this.item.parent().children('.vertical-tabs__menu-item').removeClass('first').filter(':visible').eq(0).addClass('first');
      this.details.addClass('vertical-tab--hidden').hide();
      var $firstTab = this.details.siblings('.vertical-tabs__pane:not(.vertical-tab--hidden)').eq(0);

      if ($firstTab.length) {
        $firstTab.data('verticalTab').focus();
      } else {
        this.item.closest('.js-form-type-vertical-tabs').hide();
      }

      return this;
    }
  };

  Drupal.theme.verticalTab = function (settings) {
    var tab = {};
    tab.item = $('<li class="vertical-tabs__menu-item" tabindex="-1"></li>').append(tab.link = $('<a href="#"></a>').append(tab.title = $('<strong class="vertical-tabs__menu-item-title"></strong>').text(settings.title)).append(tab.summary = $('<span class="vertical-tabs__menu-item-summary"></span>')));
    return tab;
  };
})(jQuery, Drupal, drupalSettings);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal) {
  Drupal.theme.progressBar = function (id) {
    return "<div id=\"".concat(id, "\" class=\"progress\" aria-live=\"polite\">") + '<div class="progress__label">&nbsp;</div>' + '<div class="progress__track"><div class="progress__bar"></div></div>' + '<div class="progress__percentage"></div>' + '<div class="progress__description">&nbsp;</div>' + '</div>';
  };

  Drupal.ProgressBar = function (id, updateCallback, method, errorCallback) {
    this.id = id;
    this.method = method || 'GET';
    this.updateCallback = updateCallback;
    this.errorCallback = errorCallback;
    this.element = $(Drupal.theme('progressBar', id));
  };

  $.extend(Drupal.ProgressBar.prototype, {
    setProgress: function setProgress(percentage, message, label) {
      if (percentage >= 0 && percentage <= 100) {
        $(this.element).find('div.progress__bar').css('width', "".concat(percentage, "%"));
        $(this.element).find('div.progress__percentage').html("".concat(percentage, "%"));
      }

      $('div.progress__description', this.element).html(message);
      $('div.progress__label', this.element).html(label);

      if (this.updateCallback) {
        this.updateCallback(percentage, message, this);
      }
    },
    startMonitoring: function startMonitoring(uri, delay) {
      this.delay = delay;
      this.uri = uri;
      this.sendPing();
    },
    stopMonitoring: function stopMonitoring() {
      clearTimeout(this.timer);
      this.uri = null;
    },
    sendPing: function sendPing() {
      if (this.timer) {
        clearTimeout(this.timer);
      }

      if (this.uri) {
        var pb = this;
        var uri = this.uri;

        if (uri.indexOf('?') === -1) {
          uri += '?';
        } else {
          uri += '&';
        }

        uri += '_format=json';
        $.ajax({
          type: this.method,
          url: uri,
          data: '',
          dataType: 'json',
          success: function success(progress) {
            if (progress.status === 0) {
              pb.displayError(progress.data);
              return;
            }

            pb.setProgress(progress.percentage, progress.message, progress.label);
            pb.timer = setTimeout(function () {
              pb.sendPing();
            }, pb.delay);
          },
          error: function error(xmlhttp) {
            var e = new Drupal.AjaxError(xmlhttp, pb.uri);
            pb.displayError("<pre>".concat(e.message, "</pre>"));
          }
        });
      }
    },
    displayError: function displayError(string) {
      var error = $('<div class="messages messages--error"></div>').html(string);
      $(this.element).before(error).hide();

      if (this.errorCallback) {
        this.errorCallback(this);
      }
    }
  });
})(jQuery, Drupal);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, once) {
  var deprecatedMessageSuffix = "is deprecated in Drupal 9.3.0 and will be removed in Drupal 10.0.0. Use the core/once library instead. See https://www.drupal.org/node/3158256";
  var originalJQOnce = $.fn.once;
  var originalJQRemoveOnce = $.fn.removeOnce;

  $.fn.once = function jQueryOnce(id) {
    Drupal.deprecationError({
      message: "jQuery.once() ".concat(deprecatedMessageSuffix)
    });
    return originalJQOnce.apply(this, [id]);
  };

  $.fn.removeOnce = function jQueryRemoveOnce(id) {
    Drupal.deprecationError({
      message: "jQuery.removeOnce() ".concat(deprecatedMessageSuffix)
    });
    return originalJQRemoveOnce.apply(this, [id]);
  };

  var drupalOnce = once;

  function augmentedOnce(id, selector, context) {
    originalJQOnce.apply($(selector, context), [id]);
    return drupalOnce(id, selector, context);
  }

  function remove(id, selector, context) {
    originalJQRemoveOnce.apply($(selector, context), [id]);
    return drupalOnce.remove(id, selector, context);
  }

  window.once = Object.assign(augmentedOnce, drupalOnce, {
    remove: remove
  });
})(jQuery, once);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

(function ($, window, Drupal, drupalSettings, _ref) {
  var isFocusable = _ref.isFocusable,
      tabbable = _ref.tabbable;
  Drupal.behaviors.AJAX = {
    attach: function attach(context, settings) {
      function loadAjaxBehavior(base) {
        var elementSettings = settings.ajax[base];

        if (typeof elementSettings.selector === 'undefined') {
          elementSettings.selector = "#".concat(base);
        }

        once('drupal-ajax', $(elementSettings.selector)).forEach(function (el) {
          elementSettings.element = el;
          elementSettings.base = base;
          Drupal.ajax(elementSettings);
        });
      }

      Object.keys(settings.ajax || {}).forEach(function (base) {
        return loadAjaxBehavior(base);
      });
      Drupal.ajax.bindAjaxLinks(document.body);
      once('ajax', '.use-ajax-submit').forEach(function (el) {
        var elementSettings = {};
        elementSettings.url = $(el.form).attr('action');
        elementSettings.setClick = true;
        elementSettings.event = 'click';
        elementSettings.progress = {
          type: 'throbber'
        };
        elementSettings.base = el.id;
        elementSettings.element = el;
        Drupal.ajax(elementSettings);
      });
    },
    detach: function detach(context, settings, trigger) {
      if (trigger === 'unload') {
        Drupal.ajax.expired().forEach(function (instance) {
          Drupal.ajax.instances[instance.instanceIndex] = null;
        });
      }
    }
  };

  Drupal.AjaxError = function (xmlhttp, uri, customMessage) {
    var statusCode;
    var statusText;
    var responseText;

    if (xmlhttp.status) {
      statusCode = "\n".concat(Drupal.t('An AJAX HTTP error occurred.'), "\n").concat(Drupal.t('HTTP Result Code: !status', {
        '!status': xmlhttp.status
      }));
    } else {
      statusCode = "\n".concat(Drupal.t('An AJAX HTTP request terminated abnormally.'));
    }

    statusCode += "\n".concat(Drupal.t('Debugging information follows.'));
    var pathText = "\n".concat(Drupal.t('Path: !uri', {
      '!uri': uri
    }));
    statusText = '';

    try {
      statusText = "\n".concat(Drupal.t('StatusText: !statusText', {
        '!statusText': xmlhttp.statusText.trim()
      }));
    } catch (e) {}

    responseText = '';

    try {
      responseText = "\n".concat(Drupal.t('ResponseText: !responseText', {
        '!responseText': xmlhttp.responseText.trim()
      }));
    } catch (e) {}

    responseText = responseText.replace(/<("[^"]*"|'[^']*'|[^'">])*>/gi, '');
    responseText = responseText.replace(/[\n]+\s+/g, '\n');
    var readyStateText = xmlhttp.status === 0 ? "\n".concat(Drupal.t('ReadyState: !readyState', {
      '!readyState': xmlhttp.readyState
    })) : '';
    customMessage = customMessage ? "\n".concat(Drupal.t('CustomMessage: !customMessage', {
      '!customMessage': customMessage
    })) : '';
    this.message = statusCode + pathText + statusText + customMessage + responseText + readyStateText;
    this.name = 'AjaxError';
  };

  Drupal.AjaxError.prototype = new Error();
  Drupal.AjaxError.prototype.constructor = Drupal.AjaxError;

  Drupal.ajax = function (settings) {
    if (arguments.length !== 1) {
      throw new Error('Drupal.ajax() function must be called with one configuration object only');
    }

    var base = settings.base || false;
    var element = settings.element || false;
    delete settings.base;
    delete settings.element;

    if (!settings.progress && !element) {
      settings.progress = false;
    }

    var ajax = new Drupal.Ajax(base, element, settings);
    ajax.instanceIndex = Drupal.ajax.instances.length;
    Drupal.ajax.instances.push(ajax);
    return ajax;
  };

  Drupal.ajax.instances = [];

  Drupal.ajax.expired = function () {
    return Drupal.ajax.instances.filter(function (instance) {
      return instance && instance.element !== false && !document.body.contains(instance.element);
    });
  };

  Drupal.ajax.bindAjaxLinks = function (element) {
    once('ajax', '.use-ajax', element).forEach(function (ajaxLink) {
      var $linkElement = $(ajaxLink);
      var elementSettings = {
        progress: {
          type: 'throbber'
        },
        dialogType: $linkElement.data('dialog-type'),
        dialog: $linkElement.data('dialog-options'),
        dialogRenderer: $linkElement.data('dialog-renderer'),
        base: $linkElement.attr('id'),
        element: ajaxLink
      };
      var href = $linkElement.attr('href');

      if (href) {
        elementSettings.url = href;
        elementSettings.event = 'click';
      }

      Drupal.ajax(elementSettings);
    });
  };

  Drupal.Ajax = function (base, element, elementSettings) {
    var defaults = {
      event: element ? 'mousedown' : null,
      keypress: true,
      selector: base ? "#".concat(base) : null,
      effect: 'none',
      speed: 'none',
      method: 'replaceWith',
      progress: {
        type: 'throbber',
        message: Drupal.t('Please wait...')
      },
      submit: {
        js: true
      }
    };
    $.extend(this, defaults, elementSettings);
    this.commands = new Drupal.AjaxCommands();
    this.instanceIndex = false;

    if (this.wrapper) {
      this.wrapper = "#".concat(this.wrapper);
    }

    this.element = element;
    this.element_settings = elementSettings;
    this.elementSettings = elementSettings;

    if (this.element && this.element.form) {
      this.$form = $(this.element.form);
    }

    if (!this.url) {
      var $element = $(this.element);

      if ($element.is('a')) {
        this.url = $element.attr('href');
      } else if (this.element && element.form) {
        this.url = this.$form.attr('action');
      }
    }

    var originalUrl = this.url;
    this.url = this.url.replace(/\/nojs(\/|$|\?|#)/, '/ajax$1');

    if (drupalSettings.ajaxTrustedUrl[originalUrl]) {
      drupalSettings.ajaxTrustedUrl[this.url] = true;
    }

    var ajax = this;
    ajax.options = {
      url: ajax.url,
      data: ajax.submit,
      beforeSerialize: function beforeSerialize(elementSettings, options) {
        return ajax.beforeSerialize(elementSettings, options);
      },
      beforeSubmit: function beforeSubmit(formValues, elementSettings, options) {
        ajax.ajaxing = true;
        return ajax.beforeSubmit(formValues, elementSettings, options);
      },
      beforeSend: function beforeSend(xmlhttprequest, options) {
        ajax.ajaxing = true;
        return ajax.beforeSend(xmlhttprequest, options);
      },
      success: function success(response, status, xmlhttprequest) {
        if (typeof response === 'string') {
          response = $.parseJSON(response);
        }

        if (response !== null && !drupalSettings.ajaxTrustedUrl[ajax.url]) {
          if (xmlhttprequest.getResponseHeader('X-Drupal-Ajax-Token') !== '1') {
            var customMessage = Drupal.t('The response failed verification so will not be processed.');
            return ajax.error(xmlhttprequest, ajax.url, customMessage);
          }
        }

        return ajax.success(response, status);
      },
      complete: function complete(xmlhttprequest, status) {
        ajax.ajaxing = false;

        if (status === 'error' || status === 'parsererror') {
          return ajax.error(xmlhttprequest, ajax.url);
        }
      },
      dataType: 'json',
      jsonp: false,
      type: 'POST'
    };

    if (elementSettings.dialog) {
      ajax.options.data.dialogOptions = elementSettings.dialog;
    }

    if (ajax.options.url.indexOf('?') === -1) {
      ajax.options.url += '?';
    } else {
      ajax.options.url += '&';
    }

    var wrapper = "drupal_".concat(elementSettings.dialogType || 'ajax');

    if (elementSettings.dialogRenderer) {
      wrapper += ".".concat(elementSettings.dialogRenderer);
    }

    ajax.options.url += "".concat(Drupal.ajax.WRAPPER_FORMAT, "=").concat(wrapper);
    $(ajax.element).on(elementSettings.event, function (event) {
      if (!drupalSettings.ajaxTrustedUrl[ajax.url] && !Drupal.url.isLocal(ajax.url)) {
        throw new Error(Drupal.t('The callback URL is not local and not trusted: !url', {
          '!url': ajax.url
        }));
      }

      return ajax.eventResponse(this, event);
    });

    if (elementSettings.keypress) {
      $(ajax.element).on('keypress', function (event) {
        return ajax.keypressResponse(this, event);
      });
    }

    if (elementSettings.prevent) {
      $(ajax.element).on(elementSettings.prevent, false);
    }
  };

  Drupal.ajax.WRAPPER_FORMAT = '_wrapper_format';
  Drupal.Ajax.AJAX_REQUEST_PARAMETER = '_drupal_ajax';

  Drupal.Ajax.prototype.execute = function () {
    if (this.ajaxing) {
      return;
    }

    try {
      this.beforeSerialize(this.element, this.options);
      return $.ajax(this.options);
    } catch (e) {
      this.ajaxing = false;
      window.alert("An error occurred while attempting to process ".concat(this.options.url, ": ").concat(e.message));
      return $.Deferred().reject();
    }
  };

  Drupal.Ajax.prototype.keypressResponse = function (element, event) {
    var ajax = this;

    if (event.which === 13 || event.which === 32 && element.type !== 'text' && element.type !== 'textarea' && element.type !== 'tel' && element.type !== 'number') {
      event.preventDefault();
      event.stopPropagation();
      $(element).trigger(ajax.elementSettings.event);
    }
  };

  Drupal.Ajax.prototype.eventResponse = function (element, event) {
    event.preventDefault();
    event.stopPropagation();
    var ajax = this;

    if (ajax.ajaxing) {
      return;
    }

    try {
      if (ajax.$form) {
        if (ajax.setClick) {
          element.form.clk = element;
        }

        ajax.$form.ajaxSubmit(ajax.options);
      } else {
        ajax.beforeSerialize(ajax.element, ajax.options);
        $.ajax(ajax.options);
      }
    } catch (e) {
      ajax.ajaxing = false;
      window.alert("An error occurred while attempting to process ".concat(ajax.options.url, ": ").concat(e.message));
    }
  };

  Drupal.Ajax.prototype.beforeSerialize = function (element, options) {
    if (this.$form && document.body.contains(this.$form.get(0))) {
      var settings = this.settings || drupalSettings;
      Drupal.detachBehaviors(this.$form.get(0), settings, 'serialize');
    }

    options.data[Drupal.Ajax.AJAX_REQUEST_PARAMETER] = 1;
    var pageState = drupalSettings.ajaxPageState;
    options.data['ajax_page_state[theme]'] = pageState.theme;
    options.data['ajax_page_state[theme_token]'] = pageState.theme_token;
    options.data['ajax_page_state[libraries]'] = pageState.libraries;
  };

  Drupal.Ajax.prototype.beforeSubmit = function (formValues, element, options) {};

  Drupal.Ajax.prototype.beforeSend = function (xmlhttprequest, options) {
    if (this.$form) {
      options.extraData = options.extraData || {};
      options.extraData.ajax_iframe_upload = '1';
      var v = $.fieldValue(this.element);

      if (v !== null) {
        options.extraData[this.element.name] = v;
      }
    }

    $(this.element).prop('disabled', true);

    if (!this.progress || !this.progress.type) {
      return;
    }

    var progressIndicatorMethod = "setProgressIndicator".concat(this.progress.type.slice(0, 1).toUpperCase()).concat(this.progress.type.slice(1).toLowerCase());

    if (progressIndicatorMethod in this && typeof this[progressIndicatorMethod] === 'function') {
      this[progressIndicatorMethod].call(this);
    }
  };

  Drupal.theme.ajaxProgressThrobber = function (message) {
    var messageMarkup = typeof message === 'string' ? Drupal.theme('ajaxProgressMessage', message) : '';
    var throbber = '<div class="throbber">&nbsp;</div>';
    return "<div class=\"ajax-progress ajax-progress-throbber\">".concat(throbber).concat(messageMarkup, "</div>");
  };

  Drupal.theme.ajaxProgressIndicatorFullscreen = function () {
    return '<div class="ajax-progress ajax-progress-fullscreen">&nbsp;</div>';
  };

  Drupal.theme.ajaxProgressMessage = function (message) {
    return "<div class=\"message\">".concat(message, "</div>");
  };

  Drupal.theme.ajaxProgressBar = function ($element) {
    return $('<div class="ajax-progress ajax-progress-bar"></div>').append($element);
  };

  Drupal.Ajax.prototype.setProgressIndicatorBar = function () {
    var progressBar = new Drupal.ProgressBar("ajax-progress-".concat(this.element.id), $.noop, this.progress.method, $.noop);

    if (this.progress.message) {
      progressBar.setProgress(-1, this.progress.message);
    }

    if (this.progress.url) {
      progressBar.startMonitoring(this.progress.url, this.progress.interval || 1500);
    }

    this.progress.element = $(Drupal.theme('ajaxProgressBar', progressBar.element));
    this.progress.object = progressBar;
    $(this.element).after(this.progress.element);
  };

  Drupal.Ajax.prototype.setProgressIndicatorThrobber = function () {
    this.progress.element = $(Drupal.theme('ajaxProgressThrobber', this.progress.message));
    $(this.element).after(this.progress.element);
  };

  Drupal.Ajax.prototype.setProgressIndicatorFullscreen = function () {
    this.progress.element = $(Drupal.theme('ajaxProgressIndicatorFullscreen'));
    $('body').append(this.progress.element);
  };

  Drupal.Ajax.prototype.success = function (response, status) {
    var _this = this;

    if (this.progress.element) {
      $(this.progress.element).remove();
    }

    if (this.progress.object) {
      this.progress.object.stopMonitoring();
    }

    $(this.element).prop('disabled', false);
    var elementParents = $(this.element).parents('[data-drupal-selector]').addBack().toArray();
    var focusChanged = false;
    Object.keys(response || {}).forEach(function (i) {
      if (response[i].command && _this.commands[response[i].command]) {
        _this.commands[response[i].command](_this, response[i], status);

        if (response[i].command === 'invoke' && response[i].method === 'focus' || response[i].command === 'focusFirst') {
          focusChanged = true;
        }
      }
    });

    if (!focusChanged && this.element && !$(this.element).data('disable-refocus')) {
      var target = false;

      for (var n = elementParents.length - 1; !target && n >= 0; n--) {
        target = document.querySelector("[data-drupal-selector=\"".concat(elementParents[n].getAttribute('data-drupal-selector'), "\"]"));
      }

      if (target) {
        $(target).trigger('focus');
      }
    }

    if (this.$form && document.body.contains(this.$form.get(0))) {
      var settings = this.settings || drupalSettings;
      Drupal.attachBehaviors(this.$form.get(0), settings);
    }

    this.settings = null;
  };

  Drupal.Ajax.prototype.getEffect = function (response) {
    var type = response.effect || this.effect;
    var speed = response.speed || this.speed;
    var effect = {};

    if (type === 'none') {
      effect.showEffect = 'show';
      effect.hideEffect = 'hide';
      effect.showSpeed = '';
    } else if (type === 'fade') {
      effect.showEffect = 'fadeIn';
      effect.hideEffect = 'fadeOut';
      effect.showSpeed = speed;
    } else {
      effect.showEffect = "".concat(type, "Toggle");
      effect.hideEffect = "".concat(type, "Toggle");
      effect.showSpeed = speed;
    }

    return effect;
  };

  Drupal.Ajax.prototype.error = function (xmlhttprequest, uri, customMessage) {
    if (this.progress.element) {
      $(this.progress.element).remove();
    }

    if (this.progress.object) {
      this.progress.object.stopMonitoring();
    }

    $(this.wrapper).show();
    $(this.element).prop('disabled', false);

    if (this.$form && document.body.contains(this.$form.get(0))) {
      var settings = this.settings || drupalSettings;
      Drupal.attachBehaviors(this.$form.get(0), settings);
    }

    throw new Drupal.AjaxError(xmlhttprequest, uri, customMessage);
  };

  Drupal.theme.ajaxWrapperNewContent = function ($newContent, ajax, response) {
    return (response.effect || ajax.effect) !== 'none' && $newContent.filter(function (i) {
      return !($newContent[i].nodeName === '#comment' || $newContent[i].nodeName === '#text' && /^(\s|\n|\r)*$/.test($newContent[i].textContent));
    }).length > 1 ? Drupal.theme('ajaxWrapperMultipleRootElements', $newContent) : $newContent;
  };

  Drupal.theme.ajaxWrapperMultipleRootElements = function ($elements) {
    return $('<div></div>').append($elements);
  };

  Drupal.AjaxCommands = function () {};

  Drupal.AjaxCommands.prototype = {
    insert: function insert(ajax, response) {
      var $wrapper = response.selector ? $(response.selector) : $(ajax.wrapper);
      var method = response.method || ajax.method;
      var effect = ajax.getEffect(response);
      var settings = response.settings || ajax.settings || drupalSettings;
      var $newContent = $($.parseHTML(response.data, document, true));
      $newContent = Drupal.theme('ajaxWrapperNewContent', $newContent, ajax, response);

      switch (method) {
        case 'html':
        case 'replaceWith':
        case 'replaceAll':
        case 'empty':
        case 'remove':
          Drupal.detachBehaviors($wrapper.get(0), settings);
          break;

        default:
          break;
      }

      $wrapper[method]($newContent);

      if (effect.showEffect !== 'show') {
        $newContent.hide();
      }

      var $ajaxNewContent = $newContent.find('.ajax-new-content');

      if ($ajaxNewContent.length) {
        $ajaxNewContent.hide();
        $newContent.show();
        $ajaxNewContent[effect.showEffect](effect.showSpeed);
      } else if (effect.showEffect !== 'show') {
        $newContent[effect.showEffect](effect.showSpeed);
      }

      if ($newContent.parents('html').length) {
        $newContent.each(function (index, element) {
          if (element.nodeType === Node.ELEMENT_NODE) {
            Drupal.attachBehaviors(element, settings);
          }
        });
      }
    },
    remove: function remove(ajax, response, status) {
      var settings = response.settings || ajax.settings || drupalSettings;
      $(response.selector).each(function () {
        Drupal.detachBehaviors(this, settings);
      }).remove();
    },
    changed: function changed(ajax, response, status) {
      var $element = $(response.selector);

      if (!$element.hasClass('ajax-changed')) {
        $element.addClass('ajax-changed');

        if (response.asterisk) {
          $element.find(response.asterisk).append(" <abbr class=\"ajax-changed\" title=\"".concat(Drupal.t('Changed'), "\">*</abbr> "));
        }
      }
    },
    alert: function alert(ajax, response, status) {
      window.alert(response.text);
    },
    announce: function announce(ajax, response) {
      if (response.priority) {
        Drupal.announce(response.text, response.priority);
      } else {
        Drupal.announce(response.text);
      }
    },
    redirect: function redirect(ajax, response, status) {
      window.location = response.url;
    },
    css: function css(ajax, response, status) {
      $(response.selector).css(response.argument);
    },
    settings: function settings(ajax, response, status) {
      var ajaxSettings = drupalSettings.ajax;

      if (ajaxSettings) {
        Drupal.ajax.expired().forEach(function (instance) {
          if (instance.selector) {
            var selector = instance.selector.replace('#', '');

            if (selector in ajaxSettings) {
              delete ajaxSettings[selector];
            }
          }
        });
      }

      if (response.merge) {
        $.extend(true, drupalSettings, response.settings);
      } else {
        ajax.settings = response.settings;
      }
    },
    data: function data(ajax, response, status) {
      $(response.selector).data(response.name, response.value);
    },
    focusFirst: function focusFirst(ajax, response, status) {
      var focusChanged = false;
      var container = document.querySelector(response.selector);

      if (container) {
        var tabbableElements = tabbable(container);

        if (tabbableElements.length) {
          tabbableElements[0].focus();
          focusChanged = true;
        } else if (isFocusable(container)) {
          container.focus();
          focusChanged = true;
        }
      }

      if (ajax.hasOwnProperty('element') && !focusChanged) {
        ajax.element.focus();
      }
    },
    invoke: function invoke(ajax, response, status) {
      var $element = $(response.selector);
      $element[response.method].apply($element, _toConsumableArray(response.args));
    },
    restripe: function restripe(ajax, response, status) {
      $(response.selector).find('> tbody > tr:visible, > tr:visible').removeClass('odd even').filter(':even').addClass('odd').end().filter(':odd').addClass('even');
    },
    update_build_id: function update_build_id(ajax, response, status) {
      $("input[name=\"form_build_id\"][value=\"".concat(response.old, "\"]")).val(response.new);
    },
    add_css: function add_css(ajax, response, status) {
      $('head').prepend(response.data);
    },
    message: function message(ajax, response) {
      var messages = new Drupal.Message(document.querySelector(response.messageWrapperQuerySelector));

      if (response.clearPrevious) {
        messages.clear();
      }

      messages.add(response.message, response.messageOptions);
    }
  };
})(jQuery, window, Drupal, drupalSettings, window.tabbable);;
/**
 * Copyright (c) 2007 Ariel Flesler - aflesler ○ gmail • com | https://github.com/flesler
 * Licensed under MIT
 * @author Ariel Flesler
 * @version 2.1.3
 */
;(function(factory){'use strict';if(typeof define==='function'&&define.amd){define(['jquery'],factory)}else if(typeof module!=='undefined'&&module.exports){module.exports=factory(require('jquery'))}else{factory(jQuery)}})(function($){'use strict';var $scrollTo=$.scrollTo=function(target,duration,settings){return $(window).scrollTo(target,duration,settings)};$scrollTo.defaults={axis:'xy',duration:0,limit:true};function isWin(elem){return!elem.nodeName||$.inArray(elem.nodeName.toLowerCase(),['iframe','#document','html','body'])!==-1}function isFunction(obj){return typeof obj==='function'}$.fn.scrollTo=function(target,duration,settings){if(typeof duration==='object'){settings=duration;duration=0}if(typeof settings==='function'){settings={onAfter:settings}}if(target==='max'){target=9e9}settings=$.extend({},$scrollTo.defaults,settings);duration=duration||settings.duration;var queue=settings.queue&&settings.axis.length>1;if(queue){duration/=2}settings.offset=both(settings.offset);settings.over=both(settings.over);return this.each(function(){if(target===null){return}var win=isWin(this),elem=win?this.contentWindow||window:this,$elem=$(elem),targ=target,attr={},toff;switch(typeof targ){case 'number':case 'string':if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=win?$(targ):$(targ,elem);case 'object':if(targ.length===0){return}if(targ.is||targ.style){toff=(targ=$(targ)).offset()}}var offset=isFunction(settings.offset)&&settings.offset(elem,targ)||settings.offset;$.each(settings.axis.split(''),function(i,axis){var Pos=axis==='x'?'Left':'Top',pos=Pos.toLowerCase(),key='scroll'+Pos,prev=$elem[key](),max=$scrollTo.max(elem,axis);if(toff){attr[key]=toff[pos]+(win?0:prev-$elem.offset()[pos]);if(settings.margin){attr[key]-=parseInt(targ.css('margin'+Pos),10)||0;attr[key]-=parseInt(targ.css('border'+Pos+'Width'),10)||0}attr[key]+=offset[pos]||0;if(settings.over[pos]){attr[key]+=targ[axis==='x'?'width':'height']()*settings.over[pos]}}else{var val=targ[pos];attr[key]=val.slice&&val.slice(-1)==='%'?parseFloat(val)/100*max:val}if(settings.limit&&/^\d+$/.test(attr[key])){attr[key]=attr[key]<=0?0:Math.min(attr[key],max)}if(!i&&settings.axis.length>1){if(prev===attr[key]){attr={}}else if(queue){animate(settings.onAfterFirst);attr={}}}});animate(settings.onAfter);function animate(callback){var opts=$.extend({},settings,{queue:true,duration:duration,complete:callback&&function(){callback.call(elem,targ,settings)}});$elem.animate(attr,opts)}})};$scrollTo.max=function(elem,axis){var Dim=axis==='x'?'Width':'Height',scroll='scroll'+Dim;if(!isWin(elem)){return elem[scroll]-$(elem)[Dim.toLowerCase()]()}var size='client'+Dim,doc=elem.ownerDocument||elem.document,html=doc.documentElement,body=doc.body;return Math.max(html[scroll],body[scroll])-Math.min(html[size],body[size])};function both(val){return isFunction(val)||$.isPlainObject(val)?val:{top:val,left:val}}$.Tween.propHooks.scrollLeft=$.Tween.propHooks.scrollTop={get:function(t){return $(t.elem)[t.prop]()},set:function(t){var curr=this.get(t);if(t.options.interrupt&&t._last&&t._last!==curr){return $(t.elem).stop()}var next=Math.round(t.now);if(curr!==next){$(t.elem)[t.prop](next);t._last=this.get(t)}}};return $scrollTo});
;
/**
 * @file
 * This is fontawesome-iconpicker.js file.
 */

(function ($, Drupal, drupalSettings) {
  'use strict';

  // Set value to current page variable.
  var current_page = 1;
  // Set value to left variable.
  var left = 0;
  // Declare fa_clases variable.
  var fa_clases = [];
  // Set value to attributes_added variable.
  var attributes_added = true;

  Drupal.behaviors.iconPicker = {
    attach: function (context, settings) {
      $('html', context).once('body').each(function (i, item) {
        // Add description to Font Awesome Icon field.
        var link = '<a href="https://fontawesome.com/v4.7/icons" target="_blank">Font Awesome icon list</a>';
        var description_text = 'Font Awesome icon name. See the ' + link + ' for valid names, or '
                                + 'start typing something for an autocomplete list. Also you can select '
                                + 'an icon from the Font Awesome icons grid.';
        var description = '<div class="description">' + description_text + '</div>';
        $('input[size="10000"]').parent().append(description);

        // Add icons and pagination.
        addIconsAndPagination();

        // Function to add an autocompleate on field Font Awesome Icon.
        $(document).on('keyup', 'input[size="10000"]', function () {
          // Remove autocomplete wrapper.
          $('.autocomplete-wrapper').remove();
          // Remove class active.
          $(this).parent().removeClass('autocomplete-active');
          // Create autocomplete markup.
          var autocomplete_items = '<div class="autocomplete-wrapper"><ul class="autocomplete-items">';
          var string = $(this).val();
          $.each(fa_clases, function (i, item) {
            var match = item.search(string);
            if (match > 0) {
              var autocomple_item = '<li><a href="#" class="fa-icon"><i class="fa ' + item + '"></i>' + item + '</a></li>';
              autocomplete_items += autocomple_item;
            }
          });
          autocomplete_items += '</ul></div>';
          // Add autocomplete markup.
          $(this).after(autocomplete_items);
          // Add class active.
          $(this).parent().addClass('autocomplete-active');
          if (!$('.autocomplete-wrapper').text()) {
            // Remove autocomplete markup.
            $('.autocomplete-wrapper').remove();
            // Remove class active.
            $(this).parent().removeClass('autocomplete-active');
          }
        });

        /**
         * Fuction to add selected autocomplete item to Font Awesome Icon field.
         */
        $(document).on('click', '.autocomplete-wrapper a.fa-icon, .icons-wrapper a.fa-icon', function (e) {
          e.preventDefault();

          // Get reference for input Font Awesome Icon.
          var font_awesome_icon_input = $(this).parent().parent().parent().parent().find('input[size="10000"]');
          // Get string value.
          var string = $(this).text();
          if ($(this).data('string')) {
            string = $(this).data('string');
          }
          // Add string value to input Font Awesome Icon.
          $(font_awesome_icon_input).val(string);
          // Remove autocomplete markup.
          $('.autocomplete-wrapper').remove();
          // Remove class active.
          $('input[size="10000"]').parent().removeClass('autocomplete-active');
        });

        /**
         * Function to add icons and pagination.
         */
        function addIconsAndPagination() {
          // Add font awesome classes to array variable.
          var array = [
            'fa-glass',
            'fa-music',
            'fa-search',
            'fa-envelope-o',
            'fa-heart',
            'fa-star',
            'fa-star-o',
            'fa-user',
            'fa-film',
            'fa-th-large',
            'fa-th',
            'fa-th-list',
            'fa-check',
            'fa-remove',
            'fa-search-plus',
            'fa-search-minus',
            'fa-power-off',
            'fa-signal',
            'fa-gear',
            'fa-trash-o',
            'fa-home',
            'fa-file-o',
            'fa-clock-o',
            'fa-road',
            'fa-download',
            'fa-arrow-circle-o-down',
            'fa-arrow-circle-o-up',
            'fa-inbox',
            'fa-play-circle-o',
            'fa-rotate-right',
            'fa-refresh',
            'fa-list-alt',
            'fa-lock',
            'fa-flag',
            'fa-headphones',
            'fa-volume-off',
            'fa-volume-down',
            'fa-volume-up',
            'fa-qrcode',
            'fa-barcode',
            'fa-tag',
            'fa-tags',
            'fa-book',
            'fa-bookmark',
            'fa-print',
            'fa-camera',
            'fa-font',
            'fa-bold',
            'fa-italic',
            'fa-text-height',
            'fa-text-width',
            'fa-align-left',
            'fa-align-center',
            'fa-align-right',
            'fa-align-justify',
            'fa-list',
            'fa-dedent',
            'fa-indent',
            'fa-video-camera',
            'fa-photo',
            'fa-pencil',
            'fa-map-marker',
            'fa-adjust',
            'fa-tint',
            'fa-edit',
            'fa-share-square-o',
            'fa-check-square-o',
            'fa-arrows',
            'fa-step-backward',
            'fa-fast-backward',
            'fa-backward',
            'fa-play',
            'fa-pause',
            'fa-stop',
            'fa-forward',
            'fa-fast-forward',
            'fa-step-forward',
            'fa-eject',
            'fa-chevron-left',
            'fa-chevron-right',
            'fa-plus-circle',
            'fa-minus-circle',
            'fa-times-circle',
            'fa-check-circle',
            'fa-question-circle',
            'fa-info-circle',
            'fa-crosshairs',
            'fa-times-circle-o',
            'fa-check-circle-o',
            'fa-ban',
            'fa-arrow-left',
            'fa-arrow-right',
            'fa-arrow-up',
            'fa-arrow-down',
            'fa-mail-forward',
            'fa-expand',
            'fa-compress',
            'fa-plus',
            'fa-minus',
            'fa-asterisk',
            'fa-exclamation-circle',
            'fa-gift',
            'fa-leaf',
            'fa-fire',
            'fa-eye',
            'fa-eye-slash',
            'fa-warning',
            'fa-plane',
            'fa-calendar',
            'fa-random',
            'fa-comment',
            'fa-magnet',
            'fa-chevron-up',
            'fa-chevron-down',
            'fa-retweet',
            'fa-shopping-cart',
            'fa-folder',
            'fa-folder-open',
            'fa-arrows-v',
            'fa-arrows-h',
            'fa-bar-chart-o',
            'fa-twitter-square',
            'fa-facebook-square',
            'fa-camera-retro',
            'fa-key',
            'fa-gears',
            'fa-comments',
            'fa-thumbs-o-up',
            'fa-thumbs-o-down',
            'fa-star-half',
            'fa-heart-o',
            'fa-sign-out',
            'fa-linkedin-square',
            'fa-thumb-tack',
            'fa-external-link',
            'fa-sign-in',
            'fa-trophy',
            'fa-github-square',
            'fa-upload',
            'fa-lemon-o',
            'fa-phone',
            'fa-square-o',
            'fa-bookmark-o',
            'fa-phone-square',
            'fa-twitter',
            'fa-facebook-f',
            'fa-github',
            'fa-unlock',
            'fa-credit-card',
            'fa-feed',
            'fa-hdd-o',
            'fa-bullhorn',
            'fa-bell',
            'fa-certificate',
            'fa-hand-o-right',
            'fa-hand-o-left',
            'fa-hand-o-up',
            'fa-hand-o-down',
            'fa-arrow-circle-left',
            'fa-arrow-circle-right',
            'fa-arrow-circle-up',
            'fa-arrow-circle-down',
            'fa-globe',
            'fa-wrench',
            'fa-tasks',
            'fa-filter',
            'fa-briefcase',
            'fa-arrows-alt',
            'fa-group',
            'fa-chain',
            'fa-cloud',
            'fa-flask',
            'fa-cut',
            'fa-copy',
            'fa-paperclip',
            'fa-save',
            'fa-square',
            'fa-navicon',
            'fa-list-ul',
            'fa-list-ol',
            'fa-strikethrough',
            'fa-underline',
            'fa-table',
            'fa-magic',
            'fa-truck',
            'fa-pinterest',
            'fa-pinterest-square',
            'fa-google-plus-square',
            'fa-google-plus',
            'fa-money',
            'fa-caret-down',
            'fa-caret-up',
            'fa-caret-left',
            'fa-caret-right',
            'fa-columns',
            'fa-unsorted',
            'fa-sort-down',
            'fa-sort-up',
            'fa-envelope',
            'fa-linkedin',
            'fa-rotate-left',
            'fa-legal',
            'fa-dashboard',
            'fa-comment-o',
            'fa-comments-o',
            'fa-flash',
            'fa-sitemap',
            'fa-umbrella',
            'fa-paste',
            'fa-lightbulb-o',
            'fa-exchange',
            'fa-cloud-download',
            'fa-cloud-upload',
            'fa-user-md',
            'fa-stethoscope',
            'fa-suitcase',
            'fa-bell-o',
            'fa-coffee',
            'fa-cutlery',
            'fa-file-text-o',
            'fa-building-o',
            'fa-hospital-o',
            'fa-ambulance',
            'fa-medkit',
            'fa-fighter-jet',
            'fa-beer',
            'fa-h-square',
            'fa-plus-square',
            'fa-angle-double-left',
            'fa-angle-double-right',
            'fa-angle-double-up',
            'fa-angle-double-down',
            'fa-angle-left',
            'fa-angle-right',
            'fa-angle-up',
            'fa-angle-down',
            'fa-desktop',
            'fa-laptop',
            'fa-tablet',
            'fa-mobile-phone',
            'fa-circle-o',
            'fa-quote-left',
            'fa-quote-right',
            'fa-spinner',
            'fa-circle',
            'fa-mail-reply',
            'fa-github-alt',
            'fa-folder-o',
            'fa-folder-open-o',
            'fa-smile-o',
            'fa-frown-o',
            'fa-meh-o',
            'fa-gamepad',
            'fa-keyboard-o',
            'fa-flag-o',
            'fa-flag-checkered',
            'fa-terminal',
            'fa-code',
            'fa-mail-reply-all',
            'fa-star-half-empty',
            'fa-location-arrow',
            'fa-crop',
            'fa-code-fork',
            'fa-unlink',
            'fa-question',
            'fa-info',
            'fa-exclamation',
            'fa-superscript',
            'fa-subscript',
            'fa-eraser',
            'fa-puzzle-piece',
            'fa-microphone',
            'fa-microphone-slash',
            'fa-shield',
            'fa-calendar-o',
            'fa-fire-extinguisher',
            'fa-rocket',
            'fa-maxcdn',
            'fa-chevron-circle-left',
            'fa-chevron-circle-right',
            'fa-chevron-circle-up',
            'fa-chevron-circle-down',
            'fa-html5',
            'fa-css3',
            'fa-anchor',
            'fa-unlock-alt',
            'fa-bullseye',
            'fa-ellipsis-h',
            'fa-ellipsis-v',
            'fa-rss-square',
            'fa-play-circle',
            'fa-ticket',
            'fa-minus-square',
            'fa-minus-square-o',
            'fa-level-up',
            'fa-level-down',
            'fa-check-square',
            'fa-pencil-square',
            'fa-external-link-square',
            'fa-share-square',
            'fa-compass',
            'fa-toggle-down',
            'fa-toggle-up',
            'fa-toggle-right',
            'fa-euro',
            'fa-gbp',
            'fa-dollar',
            'fa-rupee',
            'fa-cny',
            'fa-ruble',
            'fa-won',
            'fa-bitcoin',
            'fa-file',
            'fa-file-text',
            'fa-sort-alpha-asc',
            'fa-sort-alpha-desc',
            'fa-sort-amount-asc',
            'fa-sort-amount-desc',
            'fa-sort-numeric-asc',
            'fa-sort-numeric-desc',
            'fa-thumbs-up',
            'fa-thumbs-down',
            'fa-youtube-square',
            'fa-youtube',
            'fa-xing',
            'fa-xing-square',
            'fa-youtube-play',
            'fa-dropbox',
            'fa-stack-overflow',
            'fa-instagram',
            'fa-flickr',
            'fa-adn',
            'fa-bitbucket',
            'fa-bitbucket-square',
            'fa-tumblr',
            'fa-tumblr-square',
            'fa-long-arrow-down',
            'fa-long-arrow-up',
            'fa-long-arrow-left',
            'fa-long-arrow-right',
            'fa-apple',
            'fa-windows',
            'fa-android',
            'fa-linux',
            'fa-dribbble',
            'fa-skype',
            'fa-foursquare',
            'fa-trello',
            'fa-female',
            'fa-male',
            'fa-gittip',
            'fa-sun-o',
            'fa-moon-o',
            'fa-archive',
            'fa-bug',
            'fa-vk',
            'fa-weibo',
            'fa-renren',
            'fa-pagelines',
            'fa-stack-exchange',
            'fa-arrow-circle-o-right',
            'fa-arrow-circle-o-left',
            'fa-toggle-left',
            'fa-dot-circle-o',
            'fa-wheelchair',
            'fa-vimeo-square',
            'fa-turkish-lira',
            'fa-plus-square-o',
            'fa-space-shuttle',
            'fa-slack',
            'fa-envelope-square',
            'fa-wordpress',
            'fa-openid',
            'fa-institution',
            'fa-mortar-board',
            'fa-yahoo',
            'fa-google',
            'fa-reddit',
            'fa-reddit-square',
            'fa-stumbleupon-circle',
            'fa-stumbleupon',
            'fa-delicious',
            'fa-digg',
            'fa-pied-piper-pp',
            'fa-pied-piper-alt',
            'fa-drupal',
            'fa-joomla',
            'fa-language',
            'fa-fax',
            'fa-building',
            'fa-child',
            'fa-paw',
            'fa-spoon',
            'fa-cube',
            'fa-cubes',
            'fa-behance',
            'fa-behance-square',
            'fa-steam',
            'fa-steam-square',
            'fa-recycle',
            'fa-automobile',
            'fa-cab',
            'fa-tree',
            'fa-spotify',
            'fa-deviantart',
            'fa-soundcloud',
            'fa-database',
            'fa-file-pdf-o',
            'fa-file-word-o',
            'fa-file-excel-o',
            'fa-file-powerpoint-o',
            'fa-file-photo-o',
            'fa-file-zip-o',
            'fa-file-sound-o',
            'fa-file-movie-o',
            'fa-file-code-o',
            'fa-vine',
            'fa-codepen',
            'fa-jsfiddle',
            'fa-life-bouy',
            'fa-circle-o-notch',
            'fa-ra',
            'fa-ge',
            'fa-git-square',
            'fa-git',
            'fa-y-combinator-square',
            'fa-tencent-weibo',
            'fa-qq',
            'fa-wechat',
            'fa-send',
            'fa-send-o',
            'fa-history',
            'fa-circle-thin',
            'fa-header',
            'fa-paragraph',
            'fa-sliders',
            'fa-share-alt',
            'fa-share-alt-square',
            'fa-bomb',
            'fa-soccer-ball-o',
            'fa-tty',
            'fa-binoculars',
            'fa-plug',
            'fa-slideshare',
            'fa-twitch',
            'fa-yelp',
            'fa-newspaper-o',
            'fa-wifi',
            'fa-calculator',
            'fa-paypal',
            'fa-google-wallet',
            'fa-cc-visa',
            'fa-cc-mastercard',
            'fa-cc-discover',
            'fa-cc-amex',
            'fa-cc-paypal',
            'fa-cc-stripe',
            'fa-bell-slash',
            'fa-bell-slash-o',
            'fa-trash',
            'fa-copyright',
            'fa-at',
            'fa-eyedropper',
            'fa-paint-brush',
            'fa-birthday-cake',
            'fa-area-chart',
            'fa-pie-chart',
            'fa-line-chart',
            'fa-lastfm',
            'fa-lastfm-square',
            'fa-toggle-off',
            'fa-toggle-on',
            'fa-bicycle',
            'fa-bus',
            'fa-ioxhost',
            'fa-angellist',
            'fa-cc',
            'fa-shekel',
            'fa-meanpath',
            'fa-buysellads',
            'fa-connectdevelop',
            'fa-dashcube',
            'fa-forumbee',
            'fa-leanpub',
            'fa-sellsy',
            'fa-shirtsinbulk',
            'fa-simplybuilt',
            'fa-skyatlas',
            'fa-cart-plus',
            'fa-cart-arrow-down',
            'fa-diamond',
            'fa-ship',
            'fa-user-secret',
            'fa-motorcycle',
            'fa-street-view',
            'fa-heartbeat',
            'fa-venus',
            'fa-mars',
            'fa-mercury',
            'fa-intersex',
            'fa-transgender-alt',
            'fa-venus-double',
            'fa-mars-double',
            'fa-venus-mars',
            'fa-mars-stroke',
            'fa-mars-stroke-v',
            'fa-mars-stroke-h',
            'fa-neuter',
            'fa-genderless',
            'fa-facebook-official',
            'fa-pinterest-p',
            'fa-whatsapp',
            'fa-server',
            'fa-user-plus',
            'fa-user-times',
            'fa-hotel',
            'fa-viacoin',
            'fa-train',
            'fa-subway',
            'fa-medium',
            'fa-yc',
            'fa-optin-monster',
            'fa-opencart',
            'fa-expeditedssl',
            'fa-battery-4',
            'fa-battery-3',
            'fa-battery-2',
            'fa-battery-1',
            'fa-battery-0',
            'fa-mouse-pointer',
            'fa-i-cursor',
            'fa-object-group',
            'fa-object-ungroup',
            'fa-sticky-note',
            'fa-sticky-note-o',
            'fa-cc-jcb',
            'fa-cc-diners-club',
            'fa-clone',
            'fa-balance-scale',
            'fa-hourglass-o',
            'fa-hourglass-1',
            'fa-hourglass-2',
            'fa-hourglass-3',
            'fa-hourglass',
            'fa-hand-grab-o',
            'fa-hand-stop-o',
            'fa-hand-scissors-o',
            'fa-hand-lizard-o',
            'fa-hand-spock-o',
            'fa-hand-pointer-o',
            'fa-hand-peace-o',
            'fa-trademark',
            'fa-registered',
            'fa-creative-commons',
            'fa-gg',
            'fa-gg-circle',
            'fa-tripadvisor',
            'fa-odnoklassniki',
            'fa-odnoklassniki-square',
            'fa-get-pocket',
            'fa-wikipedia-w',
            'fa-safari',
            'fa-chrome',
            'fa-firefox',
            'fa-opera',
            'fa-internet-explorer',
            'fa-tv',
            'fa-contao',
            'fa-500px',
            'fa-amazon',
            'fa-calendar-plus-o',
            'fa-calendar-minus-o',
            'fa-calendar-times-o',
            'fa-calendar-check-o',
            'fa-industry',
            'fa-map-pin',
            'fa-map-signs',
            'fa-map-o',
            'fa-map',
            'fa-commenting',
            'fa-commenting-o',
            'fa-houzz',
            'fa-vimeo',
            'fa-black-tie',
            'fa-fonticons',
            'fa-reddit-alien',
            'fa-edge',
            'fa-credit-card-alt',
            'fa-codiepie',
            'fa-modx',
            'fa-fort-awesome',
            'fa-usb',
            'fa-product-hunt',
            'fa-mixcloud',
            'fa-scribd',
            'fa-pause-circle',
            'fa-pause-circle-o',
            'fa-stop-circle',
            'fa-stop-circle-o',
            'fa-shopping-bag',
            'fa-shopping-basket',
            'fa-hashtag',
            'fa-bluetooth',
            'fa-bluetooth-b',
            'fa-percent',
            'fa-gitlab',
            'fa-wpbeginner',
            'fa-wpforms',
            'fa-envira',
            'fa-universal-access',
            'fa-wheelchair-alt',
            'fa-question-circle-o',
            'fa-blind',
            'fa-audio-description',
            'fa-volume-control-phone',
            'fa-braille',
            'fa-assistive-listening-systems',
            'fa-asl-interpreting',
            'fa-deafness',
            'fa-glide',
            'fa-glide-g',
            'fa-signing',
            'fa-low-vision',
            'fa-viadeo',
            'fa-viadeo-square',
            'fa-snapchat',
            'fa-snapchat-ghost',
            'fa-snapchat-square',
            'fa-pied-piper',
            'fa-first-order',
            'fa-yoast',
            'fa-themeisle',
            'fa-google-plus-circle',
            'fa-fa',
            'fa-handshake-o',
            'fa-envelope-open',
            'fa-envelope-open-o',
            'fa-linode',
            'fa-address-book',
            'fa-address-book-o',
            'fa-vcard',
            'fa-vcard-o',
            'fa-user-circle',
            'fa-user-circle-o',
            'fa-user-o',
            'fa-id-badge',
            'fa-drivers-license',
            'fa-drivers-license-o',
            'fa-quora',
            'fa-free-code-camp',
            'fa-telegram',
            'fa-thermometer-4',
            'fa-thermometer-3',
            'fa-thermometer-2',
            'fa-thermometer-1',
            'fa-thermometer-0',
            'fa-shower',
            'fa-bathtub',
            'fa-podcast',
            'fa-window-maximize',
            'fa-window-minimize',
            'fa-window-restore',
            'fa-times-rectangle',
            'fa-times-rectangle-o',
            'fa-bandcamp',
            'fa-grav',
            'fa-etsy',
            'fa-imdb',
            'fa-ravelry',
            'fa-eercast',
            'fa-microchip',
            'fa-snowflake-o',
            'fa-superpowers',
            'fa-wpexplorer',
            'fa-meetup'
          ];

          // Push values to fa_clases array.
          $.each(array, function (i, item) {
            fa_clases.push(item);
          });

          // Create markup.
          var markup = '';
          var count = 0;
          var pager_count = 1;
          markup += '<div class="icons-wrapper"><div class="icons">'
          $.each(fa_clases, function (index, item) {
            if (count == 0) {
              markup += '<div class="page page-' + pager_count + '">';
              markup += '<a href="#" class="fa-icon" data-string="' + item + '"><i class="fa ' + item + '"></i></a>';
              count++;
            }
            else if (count == 15) {
              count = 0;
              markup += '<a href="#" class="fa-icon" data-string="' + item + '"><i class="fa ' + item + '"></i></a>';
              markup += '</div>';
              pager_count++;
            }
            else {
              markup += '<a href="#" class="fa-icon" data-string="' + item + '"><i class="fa ' + item + '"></i></a>';
              count++;
            }
          });
          markup += '</div></div>';

          // Add pager to markup.
          markup += '<div class="pagination-items">';
          markup += '<a href="#" data-go-to-page="false" class="go-to-page angle-double-left" disabled="disabled"><i class="fa fa-angle-double-left"></i></a>';
          markup += '<a href="#" data-go-to-page="false" class="go-to-page prev" disabled="disabled">Prev</a>';
          markup += '<a href="#" data-go-to-page="false" class="go-to-page next">Next</a>';
          markup += '<a href="#" data-go-to-page="false" class="go-to-page angle-double-right"><i class="fa fa-angle-double-right"></i></a>';
          markup += '<div class="pager">';
          markup += '<ul class="pagination">';
          markup += '<li class="page page-1 active"><a href="#" class="go-to-page">1</a></li>';
          markup += '<li class="page page-2"><a href="#" class="go-to-page">2</a></li>';
          markup += '<li class="page page-3"><a href="#" class="go-to-page">3</a></li>';
          markup += '<li class="page page-4"><a href="#" class="go-to-page">4</a></li>';
          markup += '<li class="page page-5"><a href="#" class="go-to-page">5</a></li>';
          markup += '<li class="page page-6"><a href="#" class="go-to-page">6</a></li>';
          markup += '<li class="page page-7"><a href="#" class="go-to-page">7</a></li>';
          markup += '<li class="page page-8"><a href="#" class="go-to-page">8</a></li>';
          markup += '<li class="page page-9"><a href="#" class="go-to-page">9</a></li>';
          markup += '<li class="page page-10"><a href="#" class="go-to-page">10</a></li>';
          markup += '<li class="page page-11"><a href="#" class="go-to-page">11</a></li>';
          markup += '<li class="page page-12"><a href="#" class="go-to-page">12</a></li>';
          markup += '<li class="page page-13"><a href="#" class="go-to-page">13</a></li>';
          markup += '<li class="page page-14"><a href="#" class="go-to-page">14</a></li>';
          markup += '<li class="page page-15"><a href="#" class="go-to-page">15</a></li>';
          markup += '<li class="page page-16"><a href="#" class="go-to-page">16</a></li>';
          markup += '<li class="page page-17"><a href="#" class="go-to-page">17</a></li>';
          markup += '<li class="page page-18"><a href="#" class="go-to-page">18</a></li>';
          markup += '<li class="page page-19"><a href="#" class="go-to-page">19</a></li>';
          markup += '<li class="page page-20"><a href="#" class="go-to-page">20</a></li>';
          markup += '<li class="page page-21"><a href="#" class="go-to-page">21</a></li>';
          markup += '<li class="page page-22"><a href="#" class="go-to-page">22</a></li>';
          markup += '<li class="page page-23"><a href="#" class="go-to-page">23</a></li>';
          markup += '<li class="page page-24"><a href="#" class="go-to-page">24</a></li>';
          markup += '<li class="page page-25"><a href="#" class="go-to-page">25</a></li>';
          markup += '<li class="page page-26"><a href="#" class="go-to-page">26</a></li>';
          markup += '<li class="page page-27"><a href="#" class="go-to-page">27</a></li>';
          markup += '<li class="page page-28"><a href="#" class="go-to-page">28</a></li>';
          markup += '<li class="page page-29"><a href="#" class="go-to-page">29</a></li>';
          markup += '<li class="page page-30"><a href="#" class="go-to-page">30</a></li>';
          markup += '<li class="page page-31"><a href="#" class="go-to-page">31</a></li>';
          markup += '<li class="page page-32"><a href="#" class="go-to-page">32</a></li>';
          markup += '<li class="page page-33"><a href="#" class="go-to-page">33</a></li>';
          markup += '<li class="page page-34"><a href="#" class="go-to-page">34</a></li>';
          markup += '<li class="page page-35"><a href="#" class="go-to-page">35</a></li>';
          markup += '<li class="page page-36"><a href="#" class="go-to-page">36</a></li>';
          markup += '<li class="page page-37"><a href="#" class="go-to-page">37</a></li>';
          markup += '<li class="page page-38"><a href="#" class="go-to-page">38</a></li>';
          markup += '<li class="page page-39"><a href="#" class="go-to-page">39</a></li>';
          markup += '<li class="page page-40"><a href="#" class="go-to-page">40</a></li>';
          markup += '<li class="page page-41"><a href="#" class="go-to-page">41</a></li>';
          markup += '<li class="page page-42"><a href="#" class="go-to-page">42</a></li>';
          markup += '<li class="page page-43"><a href="#" class="go-to-page">43</a></li>';
          markup += '</ul>';
          markup += '</div></div>';

          // Add markup to parent element.
          var parent = $('input[size="10000"]').parent();
          if (!$(parent).find('.icons-wrapper').length) {
            $(parent).append(markup);
            // Add clases to elements.
            $(parent).addClass('icons-active');
            $('.page-1').addClass('active');
            // Add data to icon field.
            $(parent).attr('data-current-page', current_page);
          }
        }

        /**
         * Function to display links are right side.
         */
        $(document).on('click', 'a.angle-double-left', function (e) {
          e.preventDefault();

          // Get icon field.
          var icon_field = $(this).parent().parent().parent();
          // Get current page value.
          current_page = parseInt($(icon_field).attr('data-current-page'), 10);
          // Update current page value.
          if (current_page == 2) {
            current_page = current_page - 1;
          }
          else if (current_page == 3) {
            current_page = current_page - 2;
          }
          else if (current_page == 4) {
            current_page = current_page - 3;
          }
          else if (current_page == 5) {
            current_page = current_page - 4;
          }
          else if (current_page == 43) {
            current_page = current_page - 2;
          }
          else {
            current_page = current_page - 5;
          }
          // Remove active class to current page.
          $(icon_field).find('.page.active').removeClass('active');
          // Add active class to current page.
          $(icon_field).find('.page-' + current_page).addClass('active');
          // Update current page on icon field.
          $(icon_field).attr('data-current-page', current_page);
          // Update pagination item styles.
          updatePaginationItemStyles(icon_field);
          // Add disabled attribute to links.
          if (current_page == 1 && attributes_added == false) {
            $('a.angle-double-left, a.prev').attr('disabled', 'disabled');
            attributes_added = true;
          }
          if (current_page == 41 && attributes_added == true) {
            $('a.next, a.angle-double-right').removeAttr('disabled');
            attributes_added = false;
          }
        });

        /**
         * Function to go to prev page.
         */
        $(document).on('click', 'a.prev', function (e) {
          e.preventDefault();

          if (current_page == 1) {
            return false;
          }

          // Get icon field.
          var icon_field = $(this).parent().parent().parent();
          // Get current page value.
          current_page = parseInt($(icon_field).attr('data-current-page'), 10);
          // Set value to variable next_page.
          var prev_page = current_page - 1;
          // Update value on variable current_page.
          current_page = prev_page;
          // Remove active class to current page.
          $(icon_field).find('.page.active').removeClass('active');
          // Add active class to prev page.
          $(icon_field).find('.page-' + prev_page).addClass('active');
          // Update current page on icon field.
          $(icon_field).attr('data-current-page', current_page);
          // Update pagination item styles.
          updatePaginationItemStyles(icon_field);
          // Add disabled attribute from links.
          if (current_page == 1 && attributes_added == false) {
            $('a.angle-double-left, a.prev').attr('disabled', 'disabled');
            attributes_added = true;
          }
          // Remove disabled attribute from links.
          if (current_page == 42 && attributes_added == true) {
            $('a.next, a.angle-double-right').removeAttr('disabled');
            attributes_added = false;
          }
        });

        /**
         * Function to go to next page.
         */
        $(document).on('click', 'a.next', function (e) {
          e.preventDefault();

          // Get icon field.
          var icon_field = $(this).parent().parent().parent();
          // Get current page value.
          current_page = parseInt($(icon_field).attr('data-current-page'), 10);
          // Set value to variable next_page.
          var next_page = current_page + 1;
          // Update value on variable current_page.
          current_page = next_page;
          // Remove active class to current page.
          $(icon_field).find('.page.active').removeClass('active');
          // Add active class to next page.
          $(icon_field).find('.page-' + next_page).addClass('active');
          // Update current page on icon field.
          $(icon_field).attr('data-current-page', current_page);
          // Update pagination item styles.
          updatePaginationItemStyles(icon_field);
          // Remove disabled attribute to links.
          if (attributes_added == true) {
            $('a.angle-double-left, a.prev').removeAttr('disabled');
            attributes_added = false;
          }
          // Add disabled attribute to links.
          if (current_page == 43 && attributes_added == false) {
            $('a.next, a.angle-double-right').attr('disabled', 'disabled');
            attributes_added = true;
          }
        });

        /**
         * Function to display the pagination links are on left side.
         */
        $(document).on('click', 'a.angle-double-right', function (e) {
          e.preventDefault();

          // Get icon field.
          var icon_field = $(this).parent().parent().parent();
          // Get current page value.
          current_page = parseInt($(icon_field).attr('data-current-page'), 10);
          // Update current page value.
          if (current_page == 41) {
            current_page = current_page + 2;
          }
          else if (current_page == 42) {
            current_page = current_page + 1;
          }
          else {
            current_page = current_page + 5;
          }
          // Remove active class to current page.
          $(icon_field).find('.page.active').removeClass('active');
          // Add active class to current page.
          $(icon_field).find('.page-' + current_page).addClass('active');
          // Update current page on icon field.
          $(icon_field).attr('data-current-page', current_page);
          // Update pagination item styles.
          updatePaginationItemStyles(icon_field);
          // Remove disabled attribute to links.
          if (current_page > 1 && attributes_added == true) {
            $('a.go-to-page').removeAttr('disabled');
            attributes_added = false;
          }
          // Add disabled attribute to links.
          if (current_page == 43 && attributes_added == false) {
            $('a.next, a.angle-double-right').attr('disabled', 'disabled');
            attributes_added = true;
          }
        });

        /**
         * Function to go to a new page.
         */
        $(document).on('click', 'a.go-to-page', function (e) {
          e.preventDefault();

          // Return false in case data go to page is false.
          if ($(this).data('go-to-page') == false) {
            return false;
          }

          // Get icon field.
          var icon_field = $(this).parent().parent().parent().parent().parent().parent();
          // Get current page value.
          current_page = parseInt($(icon_field).attr('data-current-page'), 10);
          // Get new page value.
          var new_page = parseInt($(this).text(), 10);
          // Update current page value.
          current_page = new_page;
          // Remove active class to current page.
          $(icon_field).find('.page.active').removeClass('active');
          // Add active class to new page.
          $(icon_field).find('.page-' + current_page).addClass('active');
          // Update current page on icon field.
          $(icon_field).attr('data-current-page', current_page);
          // Update pagination item styles.
          updatePaginationItemStyles(icon_field);
          // Remove disabled attribute from links.
          if (current_page > 1 && attributes_added == true) {
            $('a.go-to-page').removeAttr('disabled');
            attributes_added = false;
          }
          // Add disabled attribute to links.
          if (current_page == 43 && attributes_added == false) {
            $('a.next, a.angle-double-right').attr('disabled', 'disabled');
            attributes_added = true;
          }
        });

        /**
         * Function to update pagination item styles.
         */
        function updatePaginationItemStyles(icon_field) {
          // Update styles based on current page value.
          switch (current_page) {
            case 1:
              $(icon_field).find('a.angle-double-left').css('left', '24px');
              $(icon_field).find('a.prev').css('left', '59px');
              $(icon_field).find('a.next').css('left', '263px');
              $(icon_field).find('a.angle-double-right').css('left', '313px');
              $(icon_field).find('.pager').css('left', '108px');
              $(icon_field).find('.pager').css('width', '134px');
              $(icon_field).find('ul.pagination').css('left', '-13px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 2:
              $(icon_field).find('a.angle-double-left').css('left', '25px');
              $(icon_field).find('a.prev').css('left', '60px');
              $(icon_field).find('a.next').css('left', '267px');
              $(icon_field).find('a.angle-double-right').css('left', '317px');
              $(icon_field).find('.pager').css('left', '108px');
              $(icon_field).find('.pager').css('width', '137px');
              $(icon_field).find('ul.pagination').css('left', '-41px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 3:
              $(icon_field).find('a.angle-double-left').css('left', '24px');
              $(icon_field).find('a.prev').css('left', '59px');
              $(icon_field).find('a.next').css('left', '265px');
              $(icon_field).find('a.angle-double-right').css('left', '315px');
              $(icon_field).find('.pager').css('left', '108px');
              $(icon_field).find('.pager').css('width', '136px');
              $(icon_field).find('ul.pagination').css('left', '-71px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 4:
              $(icon_field).find('a.angle-double-left').css('left', '22px');
              $(icon_field).find('a.prev').css('left', '57px');
              $(icon_field).find('a.next').css('left', '263px');
              $(icon_field).find('a.angle-double-right').css('left', '313px');
              $(icon_field).find('.pager').css('left', '106px');
              $(icon_field).find('.pager').css('width', '136px');
              $(icon_field).find('ul.pagination').css('left', '-101px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 5:
              $(icon_field).find('a.angle-double-left').css('left', '25px');
              $(icon_field).find('a.prev').css('left', '60px');
              $(icon_field).find('a.next').css('left', '266px');
              $(icon_field).find('a.angle-double-right').css('left', '316px');
              $(icon_field).find('.pager').css('left', '109px');
              $(icon_field).find('.pager').css('width', '137px');
              $(icon_field).find('ul.pagination').css('left', '-131px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 6:
              $(icon_field).find('a.angle-double-left').css('left', '22px');
              $(icon_field).find('a.prev').css('left', '57px');
              $(icon_field).find('a.next').css('left', '268px');
              $(icon_field).find('a.angle-double-right').css('left', '318px');
              $(icon_field).find('.pager').css('left', '106px');
              $(icon_field).find('.pager').css('width', '141px');
              $(icon_field).find('ul.pagination').css('left', '-162px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 7:
              $(icon_field).find('a.angle-double-left').css('left', '20px');
              $(icon_field).find('a.prev').css('left', '55px');
              $(icon_field).find('a.next').css('left', '269px');
              $(icon_field).find('a.angle-double-right').css('left', '319px');
              $(icon_field).find('.pager').css('left', '104px');
              $(icon_field).find('.pager').css('width', '144px');
              $(icon_field).find('ul.pagination').css('left', '-191px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 8:
              $(icon_field).find('a.angle-double-left').css('left', '17px');
              $(icon_field).find('a.prev').css('left', '52px');
              $(icon_field).find('a.next').css('left', '272px');
              $(icon_field).find('a.angle-double-right').css('left', '322px');
              $(icon_field).find('.pager').css('left', '101px');
              $(icon_field).find('.pager').css('width', '150px');
              $(icon_field).find('ul.pagination').css('left', '-221px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 9:
              $(icon_field).find('a.angle-double-left').css('left', '16px');
              $(icon_field).find('a.prev').css('left', '51px');
              $(icon_field).find('a.next').css('left', '274px');
              $(icon_field).find('a.angle-double-right').css('left', '324px');
              $(icon_field).find('.pager').css('left', '100px');
              $(icon_field).find('.pager').css('width', '153px');
              $(icon_field).find('ul.pagination').css('left', '-252px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 10:
              $(icon_field).find('a.angle-double-left').css('left', '14px');
              $(icon_field).find('a.prev').css('left', '49px');
              $(icon_field).find('a.next').css('left', '275px');
              $(icon_field).find('a.angle-double-right').css('left', '325px');
              $(icon_field).find('.pager').css('left', '98px');
              $(icon_field).find('.pager').css('width', '156px');
              $(icon_field).find('ul.pagination').css('left', '-285px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 11:
              $(icon_field).find('a.angle-double-left').css('left', '13px');
              $(icon_field).find('a.prev').css('left', '48px');
              $(icon_field).find('a.next').css('left', '275px');
              $(icon_field).find('a.angle-double-right').css('left', '325px');
              $(icon_field).find('.pager').css('left', '97px');
              $(icon_field).find('.pager').css('width', '157px');
              $(icon_field).find('ul.pagination').css('left', '-319px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 12:
              $(icon_field).find('a.angle-double-left').css('left', '8px');
              $(icon_field).find('a.prev').css('left', '43px');
              $(icon_field).find('a.next').css('left', '273px');
              $(icon_field).find('a.angle-double-right').css('left', '323px');
              $(icon_field).find('.pager').css('left', '92px');
              $(icon_field).find('.pager').css('width', '160px');
              $(icon_field).find('ul.pagination').css('left', '-352px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 13:
              $(icon_field).find('a.angle-double-left').css('left', '12px');
              $(icon_field).find('a.prev').css('left', '47px');
              $(icon_field).find('a.next').css('left', '277px');
              $(icon_field).find('a.angle-double-right').css('left', '327px');
              $(icon_field).find('.pager').css('left', '96px');
              $(icon_field).find('.pager').css('width', '160px');
              $(icon_field).find('ul.pagination').css('left', '-387px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 14:
              $(icon_field).find('a.angle-double-left').css('left', '14px');
              $(icon_field).find('a.prev').css('left', '49px');
              $(icon_field).find('a.next').css('left', '279px');
              $(icon_field).find('a.angle-double-right').css('left', '329px');
              $(icon_field).find('.pager').css('left', '98px');
              $(icon_field).find('.pager').css('width', '160px');
              $(icon_field).find('ul.pagination').css('left', '-422px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 15:
              $(icon_field).find('a.angle-double-left').css('left', '9px');
              $(icon_field).find('a.prev').css('left', '44px');
              $(icon_field).find('a.next').css('left', '273px');
              $(icon_field).find('a.angle-double-right').css('left', '323px');
              $(icon_field).find('.pager').css('left', '93px');
              $(icon_field).find('.pager').css('width', '160px');
              $(icon_field).find('ul.pagination').css('left', '-458px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 16:
              $(icon_field).find('a.angle-double-left').css('left', '11px');
              $(icon_field).find('a.prev').css('left', '46px');
              $(icon_field).find('a.next').css('left', '279px');
              $(icon_field).find('a.angle-double-right').css('left', '329px');
              $(icon_field).find('.pager').css('left', '95px');
              $(icon_field).find('.pager').css('width', '163px');
              $(icon_field).find('ul.pagination').css('left', '-493px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 17:
              $(icon_field).find('a.angle-double-left').css('left', '10px');
              $(icon_field).find('a.prev').css('left', '45px');
              $(icon_field).find('a.next').css('left', '277px');
              $(icon_field).find('a.angle-double-right').css('left', '327px');
              $(icon_field).find('.pager').css('left', '94px');
              $(icon_field).find('.pager').css('width', '163px');
              $(icon_field).find('ul.pagination').css('left', '-528px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 18:
              $(icon_field).find('a.angle-double-left').css('left', '8px');
              $(icon_field).find('a.prev').css('left', '43px');
              $(icon_field).find('a.next').css('left', '278px');
              $(icon_field).find('a.angle-double-right').css('left', '328px');
              $(icon_field).find('.pager').css('left', '92px');
              $(icon_field).find('.pager').css('width', '165px');
              $(icon_field).find('ul.pagination').css('left', '-564px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 19:
              $(icon_field).find('a.angle-double-left').css('left', '9px');
              $(icon_field).find('a.prev').css('left', '44px');
              $(icon_field).find('a.next').css('left', '281px');
              $(icon_field).find('a.angle-double-right').css('left', '331px');
              $(icon_field).find('.pager').css('left', '93px');
              $(icon_field).find('.pager').css('width', '167px');
              $(icon_field).find('ul.pagination').css('left', '-599px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 20:
              $(icon_field).find('a.angle-double-left').css('left', '7px');
              $(icon_field).find('a.prev').css('left', '42px');
              $(icon_field).find('a.next').css('left', '281px');
              $(icon_field).find('a.angle-double-right').css('left', '331px');
              $(icon_field).find('.pager').css('left', '91px');
              $(icon_field).find('.pager').css('width', '169px');
              $(icon_field).find('ul.pagination').css('left', '-636px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 21:
              $(icon_field).find('a.angle-double-left').css('left', '8px');
              $(icon_field).find('a.prev').css('left', '43px');
              $(icon_field).find('a.next').css('left', '283px');
              $(icon_field).find('a.angle-double-right').css('left', '333px');
              $(icon_field).find('.pager').css('left', '92px');
              $(icon_field).find('.pager').css('width', '170px');
              $(icon_field).find('ul.pagination').css('left', '-673px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 22:
              $(icon_field).find('a.angle-double-left').css('left', '8px');
              $(icon_field).find('a.prev').css('left', '43px');
              $(icon_field).find('a.next').css('left', '285px');
              $(icon_field).find('a.angle-double-right').css('left', '335px');
              $(icon_field).find('.pager').css('left', '92px');
              $(icon_field).find('.pager').css('width', '172px');
              $(icon_field).find('ul.pagination').css('left', '-709px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 23:
              $(icon_field).find('a.angle-double-left').css('left', '5px');
              $(icon_field).find('a.prev').css('left', '40px');
              $(icon_field).find('a.next').css('left', '282px');
              $(icon_field).find('a.angle-double-right').css('left', '332px');
              $(icon_field).find('.pager').css('left', '89px');
              $(icon_field).find('.pager').css('width', '172px');
              $(icon_field).find('ul.pagination').css('left', '-747px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 24:
              $(icon_field).find('a.angle-double-left').css('left', '5px');
              $(icon_field).find('a.prev').css('left', '40px');
              $(icon_field).find('a.next').css('left', '282px');
              $(icon_field).find('a.angle-double-right').css('left', '332px');
              $(icon_field).find('.pager').css('left', '89px');
              $(icon_field).find('.pager').css('width', '172px');
              $(icon_field).find('ul.pagination').css('left', '-785px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 25:
              $(icon_field).find('a.angle-double-left').css('left', '7px');
              $(icon_field).find('a.prev').css('left', '42px');
              $(icon_field).find('a.next').css('left', '284px');
              $(icon_field).find('a.angle-double-right').css('left', '334px');
              $(icon_field).find('.pager').css('left', '91px');
              $(icon_field).find('.pager').css('width', '172px');
              $(icon_field).find('ul.pagination').css('left', '-823px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 26:
              $(icon_field).find('a.angle-double-left').css('left', '6px');
              $(icon_field).find('a.prev').css('left', '41px');
              $(icon_field).find('a.next').css('left', '283px');
              $(icon_field).find('a.angle-double-right').css('left', '333px');
              $(icon_field).find('.pager').css('left', '90px');
              $(icon_field).find('.pager').css('width', '172px');
              $(icon_field).find('ul.pagination').css('left', '-861px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 27:
              $(icon_field).find('a.angle-double-left').css('left', '7px');
              $(icon_field).find('a.prev').css('left', '42px');
              $(icon_field).find('a.next').css('left', '280px');
              $(icon_field).find('a.angle-double-right').css('left', '330px');
              $(icon_field).find('.pager').css('left', '91px');
              $(icon_field).find('.pager').css('width', '168px');
              $(icon_field).find('ul.pagination').css('left', '-899px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 28:
              $(icon_field).find('a.angle-double-left').css('left', '10px');
              $(icon_field).find('a.prev').css('left', '45px');
              $(icon_field).find('a.next').css('left', '283px');
              $(icon_field).find('a.angle-double-right').css('left', '333px');
              $(icon_field).find('.pager').css('left', '94px');
              $(icon_field).find('.pager').css('width', '168px');
              $(icon_field).find('ul.pagination').css('left', '-937px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 29:
              $(icon_field).find('a.angle-double-left').css('left', '10px');
              $(icon_field).find('a.prev').css('left', '45px');
              $(icon_field).find('a.next').css('left', '282px');
              $(icon_field).find('a.angle-double-right').css('left', '332px');
              $(icon_field).find('.pager').css('left', '94px');
              $(icon_field).find('.pager').css('width', '167px');
              $(icon_field).find('ul.pagination').css('left', '-975px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 30:
              $(icon_field).find('a.angle-double-left').css('left', '7px');
              $(icon_field).find('a.prev').css('left', '42px');
              $(icon_field).find('a.next').css('left', '279px');
              $(icon_field).find('a.angle-double-right').css('left', '329px');
              $(icon_field).find('.pager').css('left', '91px');
              $(icon_field).find('.pager').css('width', '167px');
              $(icon_field).find('ul.pagination').css('left', '-1013px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 31:
              $(icon_field).find('a.angle-double-left').css('left', '9px');
              $(icon_field).find('a.prev').css('left', '44px');
              $(icon_field).find('a.next').css('left', '282px');
              $(icon_field).find('a.angle-double-right').css('left', '332px');
              $(icon_field).find('.pager').css('left', '93px');
              $(icon_field).find('.pager').css('width', '168px');
              $(icon_field).find('ul.pagination').css('left', '-1050px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 32:
              $(icon_field).find('a.angle-double-left').css('left', '9px');
              $(icon_field).find('a.prev').css('left', '44px');
              $(icon_field).find('a.next').css('left', '284px');
              $(icon_field).find('a.angle-double-right').css('left', '334px');
              $(icon_field).find('.pager').css('left', '93px');
              $(icon_field).find('.pager').css('width', '170px');
              $(icon_field).find('ul.pagination').css('left', '-1086px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 33:
              $(icon_field).find('a.angle-double-left').css('left', '8px');
              $(icon_field).find('a.prev').css('left', '43px');
              $(icon_field).find('a.next').css('left', '283px');
              $(icon_field).find('a.angle-double-right').css('left', '333px');
              $(icon_field).find('.pager').css('left', '92px');
              $(icon_field).find('.pager').css('width', '170px');
              $(icon_field).find('ul.pagination').css('left', '-1123px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 34:
              $(icon_field).find('a.angle-double-left').css('left', '8px');
              $(icon_field).find('a.prev').css('left', '43px');
              $(icon_field).find('a.next').css('left', '283px');
              $(icon_field).find('a.angle-double-right').css('left', '333px');
              $(icon_field).find('.pager').css('left', '92px');
              $(icon_field).find('.pager').css('width', '170px');
              $(icon_field).find('ul.pagination').css('left', '-1160px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 35:
              $(icon_field).find('a.angle-double-left').css('left', '5px');
              $(icon_field).find('a.prev').css('left', '40px');
              $(icon_field).find('a.next').css('left', '280px');
              $(icon_field).find('a.angle-double-right').css('left', '330px');
              $(icon_field).find('.pager').css('left', '89px');
              $(icon_field).find('.pager').css('width', '170px');
              $(icon_field).find('ul.pagination').css('left', '-1198px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 36:
              $(icon_field).find('a.angle-double-left').css('left', '5px');
              $(icon_field).find('a.prev').css('left', '40px');
              $(icon_field).find('a.next').css('left', '281px');
              $(icon_field).find('a.angle-double-right').css('left', '331px');
              $(icon_field).find('.pager').css('left', '89px');
              $(icon_field).find('.pager').css('width', '171px');
              $(icon_field).find('ul.pagination').css('left', '-1236px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 37:
              $(icon_field).find('a.angle-double-left').css('left', '10px');
              $(icon_field).find('a.prev').css('left', '45px');
              $(icon_field).find('a.next').css('left', '284px');
              $(icon_field).find('a.angle-double-right').css('left', '334px');
              $(icon_field).find('.pager').css('left', '94px');
              $(icon_field).find('.pager').css('width', '169px');
              $(icon_field).find('ul.pagination').css('left', '-1273px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 38:
              $(icon_field).find('a.angle-double-left').css('left', '7px');
              $(icon_field).find('a.prev').css('left', '42px');
              $(icon_field).find('a.next').css('left', '283px');
              $(icon_field).find('a.angle-double-right').css('left', '333px');
              $(icon_field).find('.pager').css('left', '91px');
              $(icon_field).find('.pager').css('width', '171px');
              $(icon_field).find('ul.pagination').css('left', '-1310px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 39:
              $(icon_field).find('a.angle-double-left').css('left', '6px');
              $(icon_field).find('a.prev').css('left', '41px');
              $(icon_field).find('a.next').css('left', '283px');
              $(icon_field).find('a.angle-double-right').css('left', '333px');
              $(icon_field).find('.pager').css('left', '90px');
              $(icon_field).find('.pager').css('width', '172px');
              $(icon_field).find('ul.pagination').css('left', '-1348px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 40:
              $(icon_field).find('a.angle-double-left').css('left', '26px');
              $(icon_field).find('a.prev').css('left', '61px');
              $(icon_field).find('a.next').css('left', '263px');
              $(icon_field).find('a.angle-double-right').css('left', '313px');
              $(icon_field).find('.pager').css('left', '110px');
              $(icon_field).find('.pager').css('width', '133px');
              $(icon_field).find('ul.pagination').css('left', '-1387px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 41:
              $(icon_field).find('a.angle-double-left').css('left', '45px');
              $(icon_field).find('a.prev').css('left', '80px');
              $(icon_field).find('a.next').css('left', '245px');
              $(icon_field).find('a.angle-double-right').css('left', '295px');
              $(icon_field).find('.pager').css('left', '129px');
              $(icon_field).find('.pager').css('width', '96px');
              $(icon_field).find('ul.pagination').css('left', '-1424px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 42:
              $(icon_field).find('a.angle-double-left').css('left', '61px');
              $(icon_field).find('a.prev').css('left', '96px');
              $(icon_field).find('a.next').css('left', '224px');
              $(icon_field).find('a.angle-double-right').css('left', '274px');
              $(icon_field).find('.pager').css('left', '145px');
              $(icon_field).find('.pager').css('width', '59px');
              $(icon_field).find('ul.pagination').css('left', '-1461px');
              $(icon_field).find('.pagination-items').css('top', '464px');
              break;

            case 43:
              $(icon_field).find('a.angle-double-left').css('left', '26px');
              $(icon_field).find('a.prev').css('left', '61px');
              $(icon_field).find('a.next').css('left', '155px');
              $(icon_field).find('a.angle-double-right').css('left', '205px');
              $(icon_field).find('.pager').css('left', '110px');
              $(icon_field).find('.pager').css('width', '24px');
              $(icon_field).find('ul.pagination').css('left', '-1500px');
              $(icon_field).find('.pagination-items').css('top', '116px');
              break;
          }
        }
      });
    }
  }

})(jQuery, Drupal, drupalSettings);
;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function (Drupal, drupalSettings) {
  Drupal.behaviors.activeLinks = {
    attach: function attach(context) {
      var path = drupalSettings.path;
      var queryString = JSON.stringify(path.currentQuery);
      var querySelector = path.currentQuery ? "[data-drupal-link-query='".concat(queryString, "']") : ':not([data-drupal-link-query])';
      var originalSelectors = ["[data-drupal-link-system-path=\"".concat(path.currentPath, "\"]")];
      var selectors;

      if (path.isFront) {
        originalSelectors.push('[data-drupal-link-system-path="<front>"]');
      }

      selectors = [].concat(originalSelectors.map(function (selector) {
        return "".concat(selector, ":not([hreflang])");
      }), originalSelectors.map(function (selector) {
        return "".concat(selector, "[hreflang=\"").concat(path.currentLanguage, "\"]");
      }));
      selectors = selectors.map(function (current) {
        return current + querySelector;
      });
      var activeLinks = context.querySelectorAll(selectors.join(','));
      var il = activeLinks.length;

      for (var i = 0; i < il; i++) {
        activeLinks[i].classList.add('is-active');
      }
    },
    detach: function detach(context, settings, trigger) {
      if (trigger === 'unload') {
        var activeLinks = context.querySelectorAll('[data-drupal-link-system-path].is-active');
        var il = activeLinks.length;

        for (var i = 0; i < il; i++) {
          activeLinks[i].classList.remove('is-active');
        }
      }
    }
  };
})(Drupal, drupalSettings);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function (Drupal, debounce) {
  var liveElement;
  var announcements = [];
  Drupal.behaviors.drupalAnnounce = {
    attach: function attach(context) {
      if (!liveElement) {
        liveElement = document.createElement('div');
        liveElement.id = 'drupal-live-announce';
        liveElement.className = 'visually-hidden';
        liveElement.setAttribute('aria-live', 'polite');
        liveElement.setAttribute('aria-busy', 'false');
        document.body.appendChild(liveElement);
      }
    }
  };

  function announce() {
    var text = [];
    var priority = 'polite';
    var announcement;
    var il = announcements.length;

    for (var i = 0; i < il; i++) {
      announcement = announcements.pop();
      text.unshift(announcement.text);

      if (announcement.priority === 'assertive') {
        priority = 'assertive';
      }
    }

    if (text.length) {
      liveElement.innerHTML = '';
      liveElement.setAttribute('aria-busy', 'true');
      liveElement.setAttribute('aria-live', priority);
      liveElement.innerHTML = text.join('\n');
      liveElement.setAttribute('aria-busy', 'false');
    }
  }

  Drupal.announce = function (text, priority) {
    announcements.push({
      text: text,
      priority: priority
    });
    return debounce(announce, 200)();
  };
})(Drupal, Drupal.debounce);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal, debounce) {
  var offsets = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };

  function getRawOffset(el, edge) {
    var $el = $(el);
    var documentElement = document.documentElement;
    var displacement = 0;
    var horizontal = edge === 'left' || edge === 'right';
    var placement = $el.offset()[horizontal ? 'left' : 'top'];
    placement -= window["scroll".concat(horizontal ? 'X' : 'Y')] || document.documentElement["scroll".concat(horizontal ? 'Left' : 'Top')] || 0;

    switch (edge) {
      case 'top':
        displacement = placement + $el.outerHeight();
        break;

      case 'left':
        displacement = placement + $el.outerWidth();
        break;

      case 'bottom':
        displacement = documentElement.clientHeight - placement;
        break;

      case 'right':
        displacement = documentElement.clientWidth - placement;
        break;

      default:
        displacement = 0;
    }

    return displacement;
  }

  function calculateOffset(edge) {
    var edgeOffset = 0;
    var displacingElements = document.querySelectorAll("[data-offset-".concat(edge, "]"));
    var n = displacingElements.length;

    for (var i = 0; i < n; i++) {
      var el = displacingElements[i];

      if (el.style.display === 'none') {
        continue;
      }

      var displacement = parseInt(el.getAttribute("data-offset-".concat(edge)), 10);

      if (isNaN(displacement)) {
        displacement = getRawOffset(el, edge);
      }

      edgeOffset = Math.max(edgeOffset, displacement);
    }

    return edgeOffset;
  }

  function calculateOffsets() {
    return {
      top: calculateOffset('top'),
      right: calculateOffset('right'),
      bottom: calculateOffset('bottom'),
      left: calculateOffset('left')
    };
  }

  function displace(broadcast) {
    offsets = calculateOffsets();
    Drupal.displace.offsets = offsets;

    if (typeof broadcast === 'undefined' || broadcast) {
      $(document).trigger('drupalViewportOffsetChange', offsets);
    }

    return offsets;
  }

  Drupal.behaviors.drupalDisplace = {
    attach: function attach() {
      if (this.displaceProcessed) {
        return;
      }

      this.displaceProcessed = true;
      $(window).on('resize.drupalDisplace', debounce(displace, 200));
    }
  };
  Drupal.displace = displace;
  $.extend(Drupal.displace, {
    offsets: offsets,
    calculateOffset: calculateOffset
  });
})(jQuery, Drupal, Drupal.debounce);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal, _ref) {
  var isTabbable = _ref.isTabbable;
  $.extend($.expr[':'], {
    tabbable: function tabbable(element) {
      Drupal.deprecationError({
        message: 'The :tabbable selector is deprecated in Drupal 9.2.0 and will be removed in Drupal 10.0.0. Use the core/tabbable library instead. See https://www.drupal.org/node/3183730'
      });

      if (element.tagName === 'SUMMARY' || element.tagName === 'DETAILS') {
        var tabIndex = element.getAttribute('tabIndex');

        if (tabIndex === null || tabIndex < 0) {
          return false;
        }
      }

      return isTabbable(element);
    }
  });
})(jQuery, Drupal, window.tabbable);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($) {
  var cachedScrollbarWidth = null;
  var max = Math.max,
      abs = Math.abs;
  var regexHorizontal = /left|center|right/;
  var regexVertical = /top|center|bottom/;
  var regexOffset = /[+-]\d+(\.[\d]+)?%?/;
  var regexPosition = /^\w+/;
  var regexPercent = /%$/;
  var _position = $.fn.position;

  function getOffsets(offsets, width, height) {
    return [parseFloat(offsets[0]) * (regexPercent.test(offsets[0]) ? width / 100 : 1), parseFloat(offsets[1]) * (regexPercent.test(offsets[1]) ? height / 100 : 1)];
  }

  function parseCss(element, property) {
    return parseInt($.css(element, property), 10) || 0;
  }

  function getDimensions(elem) {
    var raw = elem[0];

    if (raw.nodeType === 9) {
      return {
        width: elem.width(),
        height: elem.height(),
        offset: {
          top: 0,
          left: 0
        }
      };
    }

    if ($.isWindow(raw)) {
      return {
        width: elem.width(),
        height: elem.height(),
        offset: {
          top: elem.scrollTop(),
          left: elem.scrollLeft()
        }
      };
    }

    if (raw.preventDefault) {
      return {
        width: 0,
        height: 0,
        offset: {
          top: raw.pageY,
          left: raw.pageX
        }
      };
    }

    return {
      width: elem.outerWidth(),
      height: elem.outerHeight(),
      offset: elem.offset()
    };
  }

  var collisions = {
    fit: {
      left: function left(position, data) {
        var within = data.within;
        var withinOffset = within.isWindow ? within.scrollLeft : within.offset.left;
        var outerWidth = within.width;
        var collisionPosLeft = position.left - data.collisionPosition.marginLeft;
        var overLeft = withinOffset - collisionPosLeft;
        var overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset;
        var newOverRight;

        if (data.collisionWidth > outerWidth) {
          if (overLeft > 0 && overRight <= 0) {
            newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
            position.left += overLeft - newOverRight;
          } else if (overRight > 0 && overLeft <= 0) {
            position.left = withinOffset;
          } else if (overLeft > overRight) {
            position.left = withinOffset + outerWidth - data.collisionWidth;
          } else {
            position.left = withinOffset;
          }
        } else if (overLeft > 0) {
          position.left += overLeft;
        } else if (overRight > 0) {
          position.left -= overRight;
        } else {
          position.left = max(position.left - collisionPosLeft, position.left);
        }
      },
      top: function top(position, data) {
        var within = data.within;
        var withinOffset = within.isWindow ? within.scrollTop : within.offset.top;
        var outerHeight = data.within.height;
        var collisionPosTop = position.top - data.collisionPosition.marginTop;
        var overTop = withinOffset - collisionPosTop;
        var overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset;
        var newOverBottom;

        if (data.collisionHeight > outerHeight) {
          if (overTop > 0 && overBottom <= 0) {
            newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
            position.top += overTop - newOverBottom;
          } else if (overBottom > 0 && overTop <= 0) {
            position.top = withinOffset;
          } else if (overTop > overBottom) {
            position.top = withinOffset + outerHeight - data.collisionHeight;
          } else {
            position.top = withinOffset;
          }
        } else if (overTop > 0) {
          position.top += overTop;
        } else if (overBottom > 0) {
          position.top -= overBottom;
        } else {
          position.top = max(position.top - collisionPosTop, position.top);
        }
      }
    },
    flip: {
      left: function left(position, data) {
        var within = data.within;
        var withinOffset = within.offset.left + within.scrollLeft;
        var outerWidth = within.width;
        var offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left;
        var collisionPosLeft = position.left - data.collisionPosition.marginLeft;
        var overLeft = collisionPosLeft - offsetLeft;
        var overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft;
        var myOffset = data.my[0] === 'left' ? -data.elemWidth : data.my[0] === 'right' ? data.elemWidth : 0;
        var atOffset = data.at[0] === 'left' ? data.targetWidth : data.at[0] === 'right' ? -data.targetWidth : 0;
        var offset = -2 * data.offset[0];
        var newOverRight;
        var newOverLeft;

        if (overLeft < 0) {
          newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;

          if (newOverRight < 0 || newOverRight < abs(overLeft)) {
            position.left += myOffset + atOffset + offset;
          }
        } else if (overRight > 0) {
          newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;

          if (newOverLeft > 0 || abs(newOverLeft) < overRight) {
            position.left += myOffset + atOffset + offset;
          }
        }
      },
      top: function top(position, data) {
        var within = data.within;
        var withinOffset = within.offset.top + within.scrollTop;
        var outerHeight = within.height;
        var offsetTop = within.isWindow ? within.scrollTop : within.offset.top;
        var collisionPosTop = position.top - data.collisionPosition.marginTop;
        var overTop = collisionPosTop - offsetTop;
        var overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop;
        var top = data.my[1] === 'top';
        var myOffset = top ? -data.elemHeight : data.my[1] === 'bottom' ? data.elemHeight : 0;
        var atOffset = data.at[1] === 'top' ? data.targetHeight : data.at[1] === 'bottom' ? -data.targetHeight : 0;
        var offset = -2 * data.offset[1];
        var newOverTop;
        var newOverBottom;

        if (overTop < 0) {
          newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;

          if (newOverBottom < 0 || newOverBottom < abs(overTop)) {
            position.top += myOffset + atOffset + offset;
          }
        } else if (overBottom > 0) {
          newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;

          if (newOverTop > 0 || abs(newOverTop) < overBottom) {
            position.top += myOffset + atOffset + offset;
          }
        }
      }
    },
    flipfit: {
      left: function left() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        collisions.flip.left.apply(this, args);
        collisions.fit.left.apply(this, args);
      },
      top: function top() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        collisions.flip.top.apply(this, args);
        collisions.fit.top.apply(this, args);
      }
    }
  };
  $.position = {
    scrollbarWidth: function scrollbarWidth() {
      if (cachedScrollbarWidth !== undefined) {
        return cachedScrollbarWidth;
      }

      var div = $('<div ' + "style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'>" + "<div style='height:100px;width:auto;'></div></div>");
      var innerDiv = div.children()[0];
      $('body').append(div);
      var w1 = innerDiv.offsetWidth;
      div.css('overflow', 'scroll');
      var w2 = innerDiv.offsetWidth;

      if (w1 === w2) {
        w2 = div[0].clientWidth;
      }

      div.remove();
      cachedScrollbarWidth = w1 - w2;
      return cachedScrollbarWidth;
    },
    getScrollInfo: function getScrollInfo(within) {
      var overflowX = within.isWindow || within.isDocument ? '' : within.element.css('overflow-x');
      var overflowY = within.isWindow || within.isDocument ? '' : within.element.css('overflow-y');
      var hasOverflowX = overflowX === 'scroll' || overflowX === 'auto' && within.width < within.element[0].scrollWidth;
      var hasOverflowY = overflowY === 'scroll' || overflowY === 'auto' && within.height < within.element[0].scrollHeight;
      return {
        width: hasOverflowY ? $.position.scrollbarWidth() : 0,
        height: hasOverflowX ? $.position.scrollbarWidth() : 0
      };
    },
    getWithinInfo: function getWithinInfo(element) {
      var withinElement = $(element || window);
      var isWindow = $.isWindow(withinElement[0]);
      var isDocument = !!withinElement[0] && withinElement[0].nodeType === 9;
      var hasOffset = !isWindow && !isDocument;
      return {
        element: withinElement,
        isWindow: isWindow,
        isDocument: isDocument,
        offset: hasOffset ? $(element).offset() : {
          left: 0,
          top: 0
        },
        scrollLeft: withinElement.scrollLeft(),
        scrollTop: withinElement.scrollTop(),
        width: withinElement.outerWidth(),
        height: withinElement.outerHeight()
      };
    }
  };

  $.fn.position = function (options) {
    if (!options || !options.of) {
      return _position.apply(this, arguments);
    }

    options = $.extend({}, options);
    var within = $.position.getWithinInfo(options.within);
    var scrollInfo = $.position.getScrollInfo(within);
    var collision = (options.collision || 'flip').split(' ');
    var offsets = {};
    var target = typeof options.of === 'string' ? $(document).find(options.of) : $(options.of);
    var dimensions = getDimensions(target);
    var targetWidth = dimensions.width;
    var targetHeight = dimensions.height;
    var targetOffset = dimensions.offset;

    if (target[0].preventDefault) {
      options.at = 'left top';
    }

    var basePosition = $.extend({}, targetOffset);
    $.each(['my', 'at'], function () {
      var pos = (options[this] || '').split(' ');

      if (pos.length === 1) {
        pos = regexHorizontal.test(pos[0]) ? pos.concat(['center']) : regexVertical.test(pos[0]) ? ['center'].concat(pos) : ['center', 'center'];
      }

      pos[0] = regexHorizontal.test(pos[0]) ? pos[0] : 'center';
      pos[1] = regexVertical.test(pos[1]) ? pos[1] : 'center';
      var horizontalOffset = regexOffset.exec(pos[0]);
      var verticalOffset = regexOffset.exec(pos[1]);
      offsets[this] = [horizontalOffset ? horizontalOffset[0] : 0, verticalOffset ? verticalOffset[0] : 0];
      options[this] = [regexPosition.exec(pos[0])[0], regexPosition.exec(pos[1])[0]];
    });

    if (collision.length === 1) {
      collision[1] = collision[0];
    }

    if (options.at[0] === 'right') {
      basePosition.left += targetWidth;
    } else if (options.at[0] === 'center') {
      basePosition.left += targetWidth / 2;
    }

    if (options.at[1] === 'bottom') {
      basePosition.top += targetHeight;
    } else if (options.at[1] === 'center') {
      basePosition.top += targetHeight / 2;
    }

    var atOffset = getOffsets(offsets.at, targetWidth, targetHeight);
    basePosition.left += atOffset[0];
    basePosition.top += atOffset[1];
    return this.each(function () {
      var using;
      var elem = $(this);
      var elemWidth = elem.outerWidth();
      var elemHeight = elem.outerHeight();
      var marginLeft = parseCss(this, 'marginLeft');
      var marginTop = parseCss(this, 'marginTop');
      var collisionWidth = elemWidth + marginLeft + parseCss(this, 'marginRight') + scrollInfo.width;
      var collisionHeight = elemHeight + marginTop + parseCss(this, 'marginBottom') + scrollInfo.height;
      var position = $.extend({}, basePosition);
      var myOffset = getOffsets(offsets.my, elem.outerWidth(), elem.outerHeight());

      if (options.my[0] === 'right') {
        position.left -= elemWidth;
      } else if (options.my[0] === 'center') {
        position.left -= elemWidth / 2;
      }

      if (options.my[1] === 'bottom') {
        position.top -= elemHeight;
      } else if (options.my[1] === 'center') {
        position.top -= elemHeight / 2;
      }

      position.left += myOffset[0];
      position.top += myOffset[1];
      var collisionPosition = {
        marginLeft: marginLeft,
        marginTop: marginTop
      };
      $.each(['left', 'top'], function (i, dir) {
        if (collisions[collision[i]]) {
          collisions[collision[i]][dir](position, {
            targetWidth: targetWidth,
            targetHeight: targetHeight,
            elemWidth: elemWidth,
            elemHeight: elemHeight,
            collisionPosition: collisionPosition,
            collisionWidth: collisionWidth,
            collisionHeight: collisionHeight,
            offset: [atOffset[0] + myOffset[0], atOffset[1] + myOffset[1]],
            my: options.my,
            at: options.at,
            within: within,
            elem: elem
          });
        }
      });

      if (options.using) {
        using = function using(props) {
          var left = targetOffset.left - position.left;
          var right = left + targetWidth - elemWidth;
          var top = targetOffset.top - position.top;
          var bottom = top + targetHeight - elemHeight;
          var feedback = {
            target: {
              element: target,
              left: targetOffset.left,
              top: targetOffset.top,
              width: targetWidth,
              height: targetHeight
            },
            element: {
              element: elem,
              left: position.left,
              top: position.top,
              width: elemWidth,
              height: elemHeight
            },
            horizontal: right < 0 ? 'left' : left > 0 ? 'right' : 'center',
            vertical: bottom < 0 ? 'top' : top > 0 ? 'bottom' : 'middle'
          };

          if (targetWidth < elemWidth && abs(left + right) < targetWidth) {
            feedback.horizontal = 'center';
          }

          if (targetHeight < elemHeight && abs(top + bottom) < targetHeight) {
            feedback.vertical = 'middle';
          }

          if (max(abs(left), abs(right)) > max(abs(top), abs(bottom))) {
            feedback.important = 'horizontal';
          } else {
            feedback.important = 'vertical';
          }

          options.using.call(this, props, feedback);
        };
      }

      elem.offset($.extend(position, {
        using: using
      }));
    });
  };

  if (!$.hasOwnProperty('ui')) {
    $.ui = {};
  }

  $.ui.position = collisions;
})(jQuery);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal, drupalSettings) {
  drupalSettings.dialog = {
    autoOpen: true,
    dialogClass: '',
    buttonClass: 'button',
    buttonPrimaryClass: 'button--primary',
    close: function close(event) {
      Drupal.dialog(event.target).close();
      Drupal.detachBehaviors(event.target, null, 'unload');
    }
  };

  Drupal.dialog = function (element, options) {
    var undef;
    var $element = $(element);
    var dialog = {
      open: false,
      returnValue: undef
    };

    function openDialog(settings) {
      settings = $.extend({}, drupalSettings.dialog, options, settings);
      $(window).trigger('dialog:beforecreate', [dialog, $element, settings]);
      $element.dialog(settings);
      dialog.open = true;
      $(window).trigger('dialog:aftercreate', [dialog, $element, settings]);
    }

    function closeDialog(value) {
      $(window).trigger('dialog:beforeclose', [dialog, $element]);
      $element.dialog('close');
      dialog.returnValue = value;
      dialog.open = false;
      $(window).trigger('dialog:afterclose', [dialog, $element]);
    }

    dialog.show = function () {
      openDialog({
        modal: false
      });
    };

    dialog.showModal = function () {
      openDialog({
        modal: true
      });
    };

    dialog.close = closeDialog;
    return dialog;
  };
})(jQuery, Drupal, drupalSettings);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal, drupalSettings, debounce, displace) {
  drupalSettings.dialog = $.extend({
    autoResize: true,
    maxHeight: '95%'
  }, drupalSettings.dialog);

  function resetPosition(options) {
    var offsets = displace.offsets;
    var left = offsets.left - offsets.right;
    var top = offsets.top - offsets.bottom;
    var leftString = "".concat((left > 0 ? '+' : '-') + Math.abs(Math.round(left / 2)), "px");
    var topString = "".concat((top > 0 ? '+' : '-') + Math.abs(Math.round(top / 2)), "px");
    options.position = {
      my: "center".concat(left !== 0 ? leftString : '', " center").concat(top !== 0 ? topString : ''),
      of: window
    };
    return options;
  }

  function resetSize(event) {
    var positionOptions = ['width', 'height', 'minWidth', 'minHeight', 'maxHeight', 'maxWidth', 'position'];
    var adjustedOptions = {};
    var windowHeight = $(window).height();
    var option;
    var optionValue;
    var adjustedValue;

    for (var n = 0; n < positionOptions.length; n++) {
      option = positionOptions[n];
      optionValue = event.data.settings[option];

      if (optionValue) {
        if (typeof optionValue === 'string' && /%$/.test(optionValue) && /height/i.test(option)) {
          windowHeight -= displace.offsets.top + displace.offsets.bottom;
          adjustedValue = parseInt(0.01 * parseInt(optionValue, 10) * windowHeight, 10);

          if (option === 'height' && event.data.$element.parent().outerHeight() < adjustedValue) {
            adjustedValue = 'auto';
          }

          adjustedOptions[option] = adjustedValue;
        }
      }
    }

    if (!event.data.settings.modal) {
      adjustedOptions = resetPosition(adjustedOptions);
    }

    event.data.$element.dialog('option', adjustedOptions).trigger('dialogContentResize');
  }

  $(window).on({
    'dialog:aftercreate': function dialogAftercreate(event, dialog, $element, settings) {
      var autoResize = debounce(resetSize, 20);
      var eventData = {
        settings: settings,
        $element: $element
      };

      if (settings.autoResize === true || settings.autoResize === 'true') {
        $element.dialog('option', {
          resizable: false,
          draggable: false
        }).dialog('widget').css('position', 'fixed');
        $(window).on('resize.dialogResize scroll.dialogResize', eventData, autoResize).trigger('resize.dialogResize');
        $(document).on('drupalViewportOffsetChange.dialogResize', eventData, autoResize);
      }
    },
    'dialog:beforeclose': function dialogBeforeclose(event, dialog, $element) {
      $(window).off('.dialogResize');
      $(document).off('.dialogResize');
    }
  });
})(jQuery, Drupal, drupalSettings, Drupal.debounce, Drupal.displace);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, _ref) {
  var tabbable = _ref.tabbable,
      isTabbable = _ref.isTabbable;
  $.widget('ui.dialog', $.ui.dialog, {
    options: {
      buttonClass: 'button',
      buttonPrimaryClass: 'button--primary'
    },
    _createButtons: function _createButtons() {
      var opts = this.options;
      var primaryIndex;
      var index;
      var il = opts.buttons.length;

      for (index = 0; index < il; index++) {
        if (opts.buttons[index].primary && opts.buttons[index].primary === true) {
          primaryIndex = index;
          delete opts.buttons[index].primary;
          break;
        }
      }

      this._super();

      var $buttons = this.uiButtonSet.children().addClass(opts.buttonClass);

      if (typeof primaryIndex !== 'undefined') {
        $buttons.eq(index).addClass(opts.buttonPrimaryClass);
      }
    },
    _focusTabbable: function _focusTabbable() {
      var hasFocus = this._focusedElement ? this._focusedElement.get(0) : null;

      if (!hasFocus) {
        hasFocus = this.element.find('[autofocus]').get(0);
      }

      if (!hasFocus) {
        var $elements = [this.element, this.uiDialogButtonPane];

        for (var i = 0; i < $elements.length; i++) {
          var element = $elements[i].get(0);

          if (element) {
            var elementTabbable = tabbable(element);
            hasFocus = elementTabbable.length ? elementTabbable[0] : null;
          }

          if (hasFocus) {
            break;
          }
        }
      }

      if (!hasFocus) {
        var closeBtn = this.uiDialogTitlebarClose.get(0);
        hasFocus = closeBtn && isTabbable(closeBtn) ? closeBtn : null;
      }

      if (!hasFocus) {
        hasFocus = this.uiDialog.get(0);
      }

      $(hasFocus).eq(0).trigger('focus');
    }
  });
})(jQuery, window.tabbable);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal) {
  Drupal.behaviors.dialog = {
    attach: function attach(context, settings) {
      var $context = $(context);

      if (!$('#drupal-modal').length) {
        $('<div id="drupal-modal" class="ui-front"></div>').hide().appendTo('body');
      }

      var $dialog = $context.closest('.ui-dialog-content');

      if ($dialog.length) {
        if ($dialog.dialog('option', 'drupalAutoButtons')) {
          $dialog.trigger('dialogButtonsChange');
        }

        $dialog.dialog('widget').trigger('focus');
      }

      var originalClose = settings.dialog.close;

      settings.dialog.close = function (event) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        originalClose.apply(settings.dialog, [event].concat(args));
        $(event.target).remove();
      };
    },
    prepareDialogButtons: function prepareDialogButtons($dialog) {
      var buttons = [];
      var $buttons = $dialog.find('.form-actions input[type=submit], .form-actions a.button');
      $buttons.each(function () {
        var $originalButton = $(this).css({
          display: 'none'
        });
        buttons.push({
          text: $originalButton.html() || $originalButton.attr('value'),
          class: $originalButton.attr('class'),
          click: function click(e) {
            if ($originalButton.is('a')) {
              $originalButton[0].click();
            } else {
              $originalButton.trigger('mousedown').trigger('mouseup').trigger('click');
              e.preventDefault();
            }
          }
        });
      });
      return buttons;
    }
  };

  Drupal.AjaxCommands.prototype.openDialog = function (ajax, response, status) {
    if (!response.selector) {
      return false;
    }

    var $dialog = $(response.selector);

    if (!$dialog.length) {
      $dialog = $("<div id=\"".concat(response.selector.replace(/^#/, ''), "\" class=\"ui-front\"></div>")).appendTo('body');
    }

    if (!ajax.wrapper) {
      ajax.wrapper = $dialog.attr('id');
    }

    response.command = 'insert';
    response.method = 'html';
    ajax.commands.insert(ajax, response, status);

    if (!response.dialogOptions.buttons) {
      response.dialogOptions.drupalAutoButtons = true;
      response.dialogOptions.buttons = Drupal.behaviors.dialog.prepareDialogButtons($dialog);
    }

    $dialog.on('dialogButtonsChange', function () {
      var buttons = Drupal.behaviors.dialog.prepareDialogButtons($dialog);
      $dialog.dialog('option', 'buttons', buttons);
    });
    response.dialogOptions = response.dialogOptions || {};
    var dialog = Drupal.dialog($dialog.get(0), response.dialogOptions);

    if (response.dialogOptions.modal) {
      dialog.showModal();
    } else {
      dialog.show();
    }

    $dialog.parent().find('.ui-dialog-buttonset').addClass('form-actions');
  };

  Drupal.AjaxCommands.prototype.closeDialog = function (ajax, response, status) {
    var $dialog = $(response.selector);

    if ($dialog.length) {
      Drupal.dialog($dialog.get(0)).close();

      if (!response.persist) {
        $dialog.remove();
      }
    }

    $dialog.off('dialogButtonsChange');
  };

  Drupal.AjaxCommands.prototype.setDialogOption = function (ajax, response, status) {
    var $dialog = $(response.selector);

    if ($dialog.length) {
      $dialog.dialog('option', response.optionName, response.optionValue);
    }
  };

  $(window).on('dialog:aftercreate', function (e, dialog, $element, settings) {
    $element.on('click.dialog', '.dialog-cancel', function (e) {
      dialog.close('cancel');
      e.preventDefault();
      e.stopPropagation();
    });
  });
  $(window).on('dialog:beforeclose', function (e, dialog, $element) {
    $element.off('.dialog');
  });
})(jQuery, Drupal);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal, debounce, once) {
  Drupal.behaviors.blockFilterByText = {
    attach: function attach(context, settings) {
      var $input = $(once('block-filter-text', 'input.block-filter-text'));
      var $table = $($input.attr('data-element'));
      var $filterRows;

      function filterBlockList(e) {
        var query = $(e.target).val().toLowerCase();

        function toggleBlockEntry(index, label) {
          var $label = $(label);
          var $row = $label.parent().parent();
          var textMatch = $label.text().toLowerCase().includes(query);
          $row.toggle(textMatch);
        }

        if (query.length >= 2) {
          $filterRows.each(toggleBlockEntry);
          Drupal.announce(Drupal.formatPlural($table.find('tr:visible').length - 1, '1 block is available in the modified list.', '@count blocks are available in the modified list.'));
        } else {
          $filterRows.each(function (index) {
            $(this).parent().parent().show();
          });
        }
      }

      if ($table.length) {
        $filterRows = $table.find('div.block-filter-text-source');
        $input.on('keyup', debounce(filterBlockList, 200));
      }
    }
  };
  Drupal.behaviors.blockHighlightPlacement = {
    attach: function attach(context, settings) {
      if (settings.blockPlacement && $('.js-block-placed').length) {
        once('block-highlight', '[data-drupal-selector="edit-blocks"]', context).forEach(function (container) {
          var $container = $(container);
          $('html, body').animate({
            scrollTop: $('.js-block-placed').offset().top - $container.offset().top + $container.scrollTop()
          }, 500);
        });
      }
    }
  };
})(jQuery, Drupal, Drupal.debounce, once);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal, debounce) {
  $.fn.drupalGetSummary = function () {
    var callback = this.data('summaryCallback');
    return this[0] && callback ? callback(this[0]).trim() : '';
  };

  $.fn.drupalSetSummary = function (callback) {
    var self = this;

    if (typeof callback !== 'function') {
      var val = callback;

      callback = function callback() {
        return val;
      };
    }

    return this.data('summaryCallback', callback).off('formUpdated.summary').on('formUpdated.summary', function () {
      self.trigger('summaryUpdated');
    }).trigger('summaryUpdated');
  };

  Drupal.behaviors.formSingleSubmit = {
    attach: function attach() {
      function onFormSubmit(e) {
        var $form = $(e.currentTarget);
        var formValues = $form.serialize();
        var previousValues = $form.attr('data-drupal-form-submit-last');

        if (previousValues === formValues) {
          e.preventDefault();
        } else {
          $form.attr('data-drupal-form-submit-last', formValues);
        }
      }

      $(once('form-single-submit', 'body')).on('submit.singleSubmit', 'form:not([method~="GET"])', onFormSubmit);
    }
  };

  function triggerFormUpdated(element) {
    $(element).trigger('formUpdated');
  }

  function fieldsList(form) {
    var $fieldList = $(form).find('[name]').map(function (index, element) {
      return element.getAttribute('id');
    });
    return $.makeArray($fieldList);
  }

  Drupal.behaviors.formUpdated = {
    attach: function attach(context) {
      var $context = $(context);
      var contextIsForm = $context.is('form');
      var $forms = $(once('form-updated', contextIsForm ? $context : $context.find('form')));
      var formFields;

      if ($forms.length) {
        $.makeArray($forms).forEach(function (form) {
          var events = 'change.formUpdated input.formUpdated ';
          var eventHandler = debounce(function (event) {
            triggerFormUpdated(event.target);
          }, 300);
          formFields = fieldsList(form).join(',');
          form.setAttribute('data-drupal-form-fields', formFields);
          $(form).on(events, eventHandler);
        });
      }

      if (contextIsForm) {
        formFields = fieldsList(context).join(',');
        var currentFields = $(context).attr('data-drupal-form-fields');

        if (formFields !== currentFields) {
          triggerFormUpdated(context);
        }
      }
    },
    detach: function detach(context, settings, trigger) {
      var $context = $(context);
      var contextIsForm = $context.is('form');

      if (trigger === 'unload') {
        once.remove('form-updated', contextIsForm ? $context : $context.find('form')).forEach(function (form) {
          form.removeAttribute('data-drupal-form-fields');
          $(form).off('.formUpdated');
        });
      }
    }
  };
  Drupal.behaviors.fillUserInfoFromBrowser = {
    attach: function attach(context, settings) {
      var userInfo = ['name', 'mail', 'homepage'];
      var $forms = $(once('user-info-from-browser', '[data-user-info-from-browser]'));

      if ($forms.length) {
        userInfo.forEach(function (info) {
          var $element = $forms.find("[name=".concat(info, "]"));
          var browserData = localStorage.getItem("Drupal.visitor.".concat(info));
          var emptyOrDefault = $element.val() === '' || $element.attr('data-drupal-default-value') === $element.val();

          if ($element.length && emptyOrDefault && browserData) {
            $element.val(browserData);
          }
        });
      }

      $forms.on('submit', function () {
        userInfo.forEach(function (info) {
          var $element = $forms.find("[name=".concat(info, "]"));

          if ($element.length) {
            localStorage.setItem("Drupal.visitor.".concat(info), $element.val());
          }
        });
      });
    }
  };

  var handleFragmentLinkClickOrHashChange = function handleFragmentLinkClickOrHashChange(e) {
    var url;

    if (e.type === 'click') {
      url = e.currentTarget.location ? e.currentTarget.location : e.currentTarget;
    } else {
      url = window.location;
    }

    var hash = url.hash.substr(1);

    if (hash) {
      var $target = $("#".concat(hash));
      $('body').trigger('formFragmentLinkClickOrHashChange', [$target]);
      setTimeout(function () {
        return $target.trigger('focus');
      }, 300);
    }
  };

  var debouncedHandleFragmentLinkClickOrHashChange = debounce(handleFragmentLinkClickOrHashChange, 300, true);
  $(window).on('hashchange.form-fragment', debouncedHandleFragmentLinkClickOrHashChange);
  $(document).on('click.form-fragment', 'a[href*="#"]', debouncedHandleFragmentLinkClickOrHashChange);
})(jQuery, Drupal, Drupal.debounce);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.machineName = {
    attach: function attach(context, settings) {
      var self = this;
      var $context = $(context);
      var timeout = null;
      var xhr = null;

      function clickEditHandler(e) {
        var data = e.data;
        data.$wrapper.removeClass('visually-hidden');
        data.$target.trigger('focus');
        data.$suffix.hide();
        data.$source.off('.machineName');
      }

      function machineNameHandler(e) {
        var data = e.data;
        var options = data.options;
        var baseValue = $(e.target).val();
        var rx = new RegExp(options.replace_pattern, 'g');
        var expected = baseValue.toLowerCase().replace(rx, options.replace).substr(0, options.maxlength);

        if (xhr && xhr.readystate !== 4) {
          xhr.abort();
          xhr = null;
        }

        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }

        if (baseValue.toLowerCase() !== expected) {
          timeout = setTimeout(function () {
            xhr = self.transliterate(baseValue, options).done(function (machine) {
              self.showMachineName(machine.substr(0, options.maxlength), data);
            });
          }, 300);
        } else {
          self.showMachineName(expected, data);
        }
      }

      Object.keys(settings.machineName).forEach(function (sourceId) {
        var options = settings.machineName[sourceId];
        var $source = $(once('machine-name', $context.find(sourceId).addClass('machine-name-source')));
        var $target = $context.find(options.target).addClass('machine-name-target');
        var $suffix = $context.find(options.suffix);
        var $wrapper = $target.closest('.js-form-item');

        if (!$source.length || !$target.length || !$suffix.length || !$wrapper.length) {
          return;
        }

        if ($target.hasClass('error')) {
          return;
        }

        options.maxlength = $target.attr('maxlength');
        $wrapper.addClass('visually-hidden');
        var machine = $target.val();
        var $preview = $("<span class=\"machine-name-value\">".concat(options.field_prefix).concat(Drupal.checkPlain(machine)).concat(options.field_suffix, "</span>"));
        $suffix.empty();

        if (options.label) {
          $suffix.append("<span class=\"machine-name-label\">".concat(options.label, ": </span>"));
        }

        $suffix.append($preview);

        if ($target.is(':disabled')) {
          return;
        }

        var eventData = {
          $source: $source,
          $target: $target,
          $suffix: $suffix,
          $wrapper: $wrapper,
          $preview: $preview,
          options: options
        };

        if (machine === '' && $source.val() !== '') {
          self.transliterate($source.val(), options).done(function (machineName) {
            self.showMachineName(machineName.substr(0, options.maxlength), eventData);
          });
        }

        var $link = $("<span class=\"admin-link\"><button type=\"button\" class=\"link\">".concat(Drupal.t('Edit'), "</button></span>")).on('click', eventData, clickEditHandler);
        $suffix.append($link);

        if ($target.val() === '') {
          $source.on('formUpdated.machineName', eventData, machineNameHandler).trigger('formUpdated.machineName');
        }

        $target.on('invalid', eventData, clickEditHandler);
      });
    },
    showMachineName: function showMachineName(machine, data) {
      var settings = data.options;

      if (machine !== '') {
        if (machine !== settings.replace) {
          data.$target.val(machine);
          data.$preview.html(settings.field_prefix + Drupal.checkPlain(machine) + settings.field_suffix);
        }

        data.$suffix.show();
      } else {
        data.$suffix.hide();
        data.$target.val(machine);
        data.$preview.empty();
      }
    },
    transliterate: function transliterate(source, settings) {
      return $.get(Drupal.url('machine_name/transliterate'), {
        text: source,
        langcode: drupalSettings.langcode,
        replace_pattern: settings.replace_pattern,
        replace_token: settings.replace_token,
        replace: settings.replace,
        lowercase: true
      });
    }
  };
})(jQuery, Drupal, drupalSettings);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal) {
  function DetailsSummarizedContent(node) {
    this.$node = $(node);
    this.setupSummary();
  }

  $.extend(DetailsSummarizedContent, {
    instances: []
  });
  $.extend(DetailsSummarizedContent.prototype, {
    setupSummary: function setupSummary() {
      this.$detailsSummarizedContentWrapper = $(Drupal.theme('detailsSummarizedContentWrapper'));
      this.$node.on('summaryUpdated', $.proxy(this.onSummaryUpdated, this)).trigger('summaryUpdated').find('> summary').append(this.$detailsSummarizedContentWrapper);
    },
    onSummaryUpdated: function onSummaryUpdated() {
      var text = this.$node.drupalGetSummary();
      this.$detailsSummarizedContentWrapper.html(Drupal.theme('detailsSummarizedContentText', text));
    }
  });
  Drupal.behaviors.detailsSummary = {
    attach: function attach(context) {
      DetailsSummarizedContent.instances = DetailsSummarizedContent.instances.concat(once('details', 'details', context).map(function (details) {
        return new DetailsSummarizedContent(details);
      }));
    }
  };
  Drupal.DetailsSummarizedContent = DetailsSummarizedContent;

  Drupal.theme.detailsSummarizedContentWrapper = function () {
    return "<span class=\"summary\"></span>";
  };

  Drupal.theme.detailsSummarizedContentText = function (text) {
    return text ? " (".concat(text, ")") : '';
  };
})(jQuery, Drupal);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal) {
  Drupal.behaviors.detailsAria = {
    attach: function attach() {
      $(once('detailsAria', 'body')).on('click.detailsAria', 'summary', function (event) {
        var $summary = $(event.currentTarget);
        var open = $(event.currentTarget.parentNode).attr('open') === 'open' ? 'false' : 'true';
        $summary.attr({
          'aria-expanded': open,
          'aria-pressed': open
        });
      });
    }
  };
})(jQuery, Drupal);;
/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Modernizr, Drupal) {
  function CollapsibleDetails(node) {
    this.$node = $(node);
    this.$node.data('details', this);
    var anchor = window.location.hash && window.location.hash !== '#' ? ", ".concat(window.location.hash) : '';

    if (this.$node.find(".error".concat(anchor)).length) {
      this.$node.attr('open', true);
    }

    this.setupSummaryPolyfill();
  }

  $.extend(CollapsibleDetails, {
    instances: []
  });
  $.extend(CollapsibleDetails.prototype, {
    setupSummaryPolyfill: function setupSummaryPolyfill() {
      var $summary = this.$node.find('> summary');
      $summary.attr('tabindex', '-1');
      $('<span class="details-summary-prefix visually-hidden"></span>').append(this.$node.attr('open') ? Drupal.t('Hide') : Drupal.t('Show')).prependTo($summary).after(document.createTextNode(' '));
      $('<a class="details-title"></a>').attr('href', "#".concat(this.$node.attr('id'))).prepend($summary.contents()).appendTo($summary);
      $summary.append(this.$summary).on('click', $.proxy(this.onSummaryClick, this));
    },
    onSummaryClick: function onSummaryClick(e) {
      this.toggle();
      e.preventDefault();
    },
    toggle: function toggle() {
      var _this = this;

      var isOpen = !!this.$node.attr('open');
      var $summaryPrefix = this.$node.find('> summary span.details-summary-prefix');

      if (isOpen) {
        $summaryPrefix.html(Drupal.t('Show'));
      } else {
        $summaryPrefix.html(Drupal.t('Hide'));
      }

      setTimeout(function () {
        _this.$node.attr('open', !isOpen);
      }, 0);
    }
  });
  Drupal.behaviors.collapse = {
    attach: function attach(context) {
      if (Modernizr.details) {
        return;
      }

      once('collapse', 'details', context).forEach(function (detail) {
        detail.classList.add('collapse-processed');
        CollapsibleDetails.instances.push(new CollapsibleDetails(detail));
      });
    }
  };

  var handleFragmentLinkClickOrHashChange = function handleFragmentLinkClickOrHashChange(e, $target) {
    $target.parents('details').not('[open]').find('> summary').trigger('click');
  };

  $('body').on('formFragmentLinkClickOrHashChange.details', handleFragmentLinkClickOrHashChange);
  Drupal.CollapsibleDetails = CollapsibleDetails;
})(jQuery, Modernizr, Drupal);;
