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

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

(function ($, Drupal, drupalSettings) {
  var showWeight = JSON.parse(localStorage.getItem('Drupal.tableDrag.showWeight'));
  Drupal.behaviors.tableDrag = {
    attach: function attach(context, settings) {
      function initTableDrag(table, base) {
        if (table.length) {
          Drupal.tableDrag[base] = new Drupal.tableDrag(table[0], settings.tableDrag[base]);
        }
      }

      Object.keys(settings.tableDrag || {}).forEach(function (base) {
        initTableDrag($(once('tabledrag', "#".concat(base), context)), base);
      });
    }
  };

  Drupal.tableDrag = function (table, tableSettings) {
    var _this = this;

    var self = this;
    var $table = $(table);
    this.$table = $(table);
    this.table = table;
    this.tableSettings = tableSettings;
    this.dragObject = null;
    this.rowObject = null;
    this.oldRowElement = null;
    this.oldY = null;
    this.changed = false;
    this.maxDepth = 0;
    this.rtl = $(this.table).css('direction') === 'rtl' ? -1 : 1;
    this.striping = $(this.table).data('striping') === 1;
    this.scrollSettings = {
      amount: 4,
      interval: 50,
      trigger: 70
    };
    this.scrollInterval = null;
    this.scrollY = 0;
    this.windowHeight = 0;
    this.$toggleWeightButton = null;
    this.indentEnabled = false;
    Object.keys(tableSettings || {}).forEach(function (group) {
      Object.keys(tableSettings[group] || {}).forEach(function (n) {
        if (tableSettings[group][n].relationship === 'parent') {
          _this.indentEnabled = true;
        }

        if (tableSettings[group][n].limit > 0) {
          _this.maxDepth = tableSettings[group][n].limit;
        }
      });
    });

    if (this.indentEnabled) {
      this.indentCount = 1;
      var indent = Drupal.theme('tableDragIndentation');
      var testRow = $('<tr></tr>').addClass('draggable').appendTo(table);
      var testCell = $('<td></td>').appendTo(testRow).prepend(indent).prepend(indent);
      var $indentation = testCell.find('.js-indentation');
      this.indentAmount = $indentation.get(1).offsetLeft - $indentation.get(0).offsetLeft;
      testRow.remove();
    }

    $table.find('> tr.draggable, > tbody > tr.draggable').each(function () {
      self.makeDraggable(this);
    });
    var $toggleWeightWrapper = $(Drupal.theme('tableDragToggle'));
    this.$toggleWeightButton = $toggleWeightWrapper.find('[data-drupal-selector="tabledrag-toggle-weight"]');
    this.$toggleWeightButton.on('click', $.proxy(function (e) {
      e.preventDefault();
      this.toggleColumns();
    }, this));
    $table.before($toggleWeightWrapper);
    self.initColumns();
    $(document).on('touchmove', function (event) {
      return self.dragRow(event.originalEvent.touches[0], self);
    });
    $(document).on('touchend', function (event) {
      return self.dropRow(event.originalEvent.touches[0], self);
    });
    $(document).on('mousemove pointermove', function (event) {
      return self.dragRow(event, self);
    });
    $(document).on('mouseup pointerup', function (event) {
      return self.dropRow(event, self);
    });
    $(window).on('storage', $.proxy(function (e) {
      if (e.originalEvent.key === 'Drupal.tableDrag.showWeight') {
        showWeight = JSON.parse(e.originalEvent.newValue);
        this.displayColumns(showWeight);
      }
    }, this));
  };

  Drupal.tableDrag.prototype.initColumns = function () {
    var _this2 = this;

    var $table = this.$table;
    var hidden;
    var cell;
    var columnIndex;
    Object.keys(this.tableSettings || {}).forEach(function (group) {
      Object.keys(_this2.tableSettings[group]).some(function (tableSetting) {
        var field = $table.find(".".concat(_this2.tableSettings[group][tableSetting].target)).eq(0);

        if (field.length && _this2.tableSettings[group][tableSetting].hidden) {
          hidden = _this2.tableSettings[group][tableSetting].hidden;
          cell = field.closest('td');
          return true;
        }

        return false;
      });

      if (hidden && cell[0]) {
        columnIndex = cell.parent().find('> td').index(cell.get(0)) + 1;
        $table.find('> thead > tr, > tbody > tr, > tr').each(_this2.addColspanClass(columnIndex));
      }
    });
    this.displayColumns(showWeight);
  };

  Drupal.tableDrag.prototype.addColspanClass = function (columnIndex) {
    return function () {
      var $row = $(this);
      var index = columnIndex;
      var cells = $row.children();
      var cell;
      cells.each(function (n) {
        if (n < index && this.colSpan && this.colSpan > 1) {
          index -= this.colSpan - 1;
        }
      });

      if (index > 0) {
        cell = cells.filter(":nth-child(".concat(index, ")"));

        if (cell[0].colSpan && cell[0].colSpan > 1) {
          cell.addClass('tabledrag-has-colspan');
        } else {
          cell.addClass('tabledrag-hide');
        }
      }
    };
  };

  Drupal.tableDrag.prototype.displayColumns = function (displayWeight) {
    if (displayWeight) {
      this.showColumns();
    } else {
      this.hideColumns();
    }

    this.$toggleWeightButton.html(Drupal.theme('toggleButtonContent', displayWeight));
    $(once.filter('tabledrag', 'table')).trigger('columnschange', !!displayWeight);
  };

  Drupal.tableDrag.prototype.toggleColumns = function () {
    showWeight = !showWeight;
    this.displayColumns(showWeight);

    if (showWeight) {
      localStorage.setItem('Drupal.tableDrag.showWeight', showWeight);
    } else {
      localStorage.removeItem('Drupal.tableDrag.showWeight');
    }
  };

  Drupal.tableDrag.prototype.hideColumns = function () {
    var $tables = $(once.filter('tabledrag', 'table'));
    $tables.find('.tabledrag-hide').css('display', 'none');
    $tables.find('.tabledrag-handle').css('display', '');
    $tables.find('.tabledrag-has-colspan').each(function () {
      this.colSpan -= 1;
    });
  };

  Drupal.tableDrag.prototype.showColumns = function () {
    var $tables = $(once.filter('tabledrag', 'table'));
    $tables.find('.tabledrag-hide').css('display', '');
    $tables.find('.tabledrag-handle').css('display', 'none');
    $tables.find('.tabledrag-has-colspan').each(function () {
      this.colSpan += 1;
    });
  };

  Drupal.tableDrag.prototype.rowSettings = function (group, row) {
    var field = $(row).find(".".concat(group));
    var tableSettingsGroup = this.tableSettings[group];
    return Object.keys(tableSettingsGroup).map(function (delta) {
      var targetClass = tableSettingsGroup[delta].target;
      var rowSettings;

      if (field.is(".".concat(targetClass))) {
        rowSettings = {};
        Object.keys(tableSettingsGroup[delta]).forEach(function (n) {
          rowSettings[n] = tableSettingsGroup[delta][n];
        });
      }

      return rowSettings;
    }).filter(function (rowSetting) {
      return rowSetting;
    })[0];
  };

  Drupal.tableDrag.prototype.makeDraggable = function (item) {
    var self = this;
    var $item = $(item);
    $item.find('td:first-of-type').find('a').addClass('menu-item__link');
    var $handle = $(Drupal.theme('tableDragHandle'));
    var $indentationLast = $item.find('td:first-of-type').find('.js-indentation').eq(-1);

    if ($indentationLast.length) {
      $indentationLast.after($handle);
      self.indentCount = Math.max($item.find('.js-indentation').length, self.indentCount);
    } else {
      $item.find('td').eq(0).prepend($handle);
    }

    $handle.on('mousedown touchstart pointerdown', function (event) {
      event.preventDefault();

      if (event.originalEvent.type === 'touchstart') {
        event = event.originalEvent.touches[0];
      }

      self.dragStart(event, self, item);
    });
    $handle.on('click', function (e) {
      e.preventDefault();
    });
    $handle.on('focus', function () {
      self.safeBlur = true;
    });
    $handle.on('blur', function (event) {
      if (self.rowObject && self.safeBlur) {
        self.dropRow(event, self);
      }
    });
    $handle.on('keydown', function (event) {
      if (event.keyCode !== 9 && !self.rowObject) {
        self.rowObject = new self.row(item, 'keyboard', self.indentEnabled, self.maxDepth, true);
      }

      var keyChange = false;
      var groupHeight;

      switch (event.keyCode) {
        case 37:
        case 63234:
          keyChange = true;
          self.rowObject.indent(-1 * self.rtl);
          break;

        case 38:
        case 63232:
          {
            var $previousRow = $(self.rowObject.element).prev('tr').eq(0);
            var previousRow = $previousRow.get(0);

            while (previousRow && $previousRow.is(':hidden')) {
              $previousRow = $(previousRow).prev('tr').eq(0);
              previousRow = $previousRow.get(0);
            }

            if (previousRow) {
              self.safeBlur = false;
              self.rowObject.direction = 'up';
              keyChange = true;

              if ($(item).is('.tabledrag-root')) {
                groupHeight = 0;

                while (previousRow && $previousRow.find('.js-indentation').length) {
                  $previousRow = $(previousRow).prev('tr').eq(0);
                  previousRow = $previousRow.get(0);
                  groupHeight += $previousRow.is(':hidden') ? 0 : previousRow.offsetHeight;
                }

                if (previousRow) {
                  self.rowObject.swap('before', previousRow);
                  window.scrollBy(0, -groupHeight);
                }
              } else if (self.table.tBodies[0].rows[0] !== previousRow || $previousRow.is('.draggable')) {
                self.rowObject.swap('before', previousRow);
                self.rowObject.interval = null;
                self.rowObject.indent(0);
                window.scrollBy(0, -parseInt(item.offsetHeight, 10));
              }

              $handle.trigger('focus');
            }

            break;
          }

        case 39:
        case 63235:
          keyChange = true;
          self.rowObject.indent(self.rtl);
          break;

        case 40:
        case 63233:
          {
            var $nextRow = $(self.rowObject.group).eq(-1).next('tr').eq(0);
            var nextRow = $nextRow.get(0);

            while (nextRow && $nextRow.is(':hidden')) {
              $nextRow = $(nextRow).next('tr').eq(0);
              nextRow = $nextRow.get(0);
            }

            if (nextRow) {
              self.safeBlur = false;
              self.rowObject.direction = 'down';
              keyChange = true;

              if ($(item).is('.tabledrag-root')) {
                groupHeight = 0;
                var nextGroup = new self.row(nextRow, 'keyboard', self.indentEnabled, self.maxDepth, false);

                if (nextGroup) {
                  $(nextGroup.group).each(function () {
                    groupHeight += $(this).is(':hidden') ? 0 : this.offsetHeight;
                  });
                  var nextGroupRow = $(nextGroup.group).eq(-1).get(0);
                  self.rowObject.swap('after', nextGroupRow);
                  window.scrollBy(0, parseInt(groupHeight, 10));
                }
              } else {
                self.rowObject.swap('after', nextRow);
                self.rowObject.interval = null;
                self.rowObject.indent(0);
                window.scrollBy(0, parseInt(item.offsetHeight, 10));
              }

              $handle.trigger('focus');
            }

            break;
          }
      }

      if (self.rowObject && self.rowObject.changed === true) {
        $(item).addClass('drag');

        if (self.oldRowElement) {
          $(self.oldRowElement).removeClass('drag-previous');
        }

        self.oldRowElement = item;

        if (self.striping === true) {
          self.restripeTable();
        }

        self.onDrag();
      }

      if (keyChange) {
        return false;
      }
    });
    $handle.on('keypress', function (event) {
      switch (event.keyCode) {
        case 37:
        case 38:
        case 39:
        case 40:
          return false;
      }
    });
  };

  Drupal.tableDrag.prototype.dragStart = function (event, self, item) {
    self.dragObject = {};
    self.dragObject.initOffset = self.getPointerOffset(item, event);
    self.dragObject.initPointerCoords = self.pointerCoords(event);

    if (self.indentEnabled) {
      self.dragObject.indentPointerPos = self.dragObject.initPointerCoords;
    }

    if (self.rowObject) {
      $(self.rowObject.element).find('a.tabledrag-handle').trigger('blur');
    }

    self.rowObject = new self.row(item, 'pointer', self.indentEnabled, self.maxDepth, true);
    self.table.topY = $(self.table).offset().top;
    self.table.bottomY = self.table.topY + self.table.offsetHeight;
    $(item).addClass('drag');
    $('body').addClass('drag');

    if (self.oldRowElement) {
      $(self.oldRowElement).removeClass('drag-previous');
    }

    self.oldY = self.pointerCoords(event).y;
  };

  Drupal.tableDrag.prototype.dragRow = function (event, self) {
    if (self.dragObject) {
      self.currentPointerCoords = self.pointerCoords(event);
      var y = self.currentPointerCoords.y - self.dragObject.initOffset.y;
      var x = self.currentPointerCoords.x - self.dragObject.initOffset.x;

      if (y !== self.oldY) {
        self.rowObject.direction = y > self.oldY ? 'down' : 'up';
        self.oldY = y;
        var scrollAmount = self.checkScroll(self.currentPointerCoords.y);
        clearInterval(self.scrollInterval);

        if (scrollAmount > 0 && self.rowObject.direction === 'down' || scrollAmount < 0 && self.rowObject.direction === 'up') {
          self.setScroll(scrollAmount);
        }

        var currentRow = self.findDropTargetRow(x, y);

        if (currentRow) {
          if (self.rowObject.direction === 'down') {
            self.rowObject.swap('after', currentRow, self);
          } else {
            self.rowObject.swap('before', currentRow, self);
          }

          if (self.striping === true) {
            self.restripeTable();
          }
        }
      }

      if (self.indentEnabled) {
        var xDiff = self.currentPointerCoords.x - self.dragObject.indentPointerPos.x;
        var indentDiff = Math.round(xDiff / self.indentAmount);
        var indentChange = self.rowObject.indent(indentDiff);
        self.dragObject.indentPointerPos.x += self.indentAmount * indentChange * self.rtl;
        self.indentCount = Math.max(self.indentCount, self.rowObject.indents);
      }

      return false;
    }
  };

  Drupal.tableDrag.prototype.dropRow = function (event, self) {
    var droppedRow;
    var $droppedRow;

    if (self.rowObject !== null) {
      droppedRow = self.rowObject.element;
      $droppedRow = $(droppedRow);

      if (self.rowObject.changed === true) {
        self.updateFields(droppedRow);
        Object.keys(self.tableSettings || {}).forEach(function (group) {
          var rowSettings = self.rowSettings(group, droppedRow);

          if (rowSettings.relationship === 'group') {
            Object.keys(self.rowObject.children || {}).forEach(function (n) {
              self.updateField(self.rowObject.children[n], group);
            });
          }
        });
        self.rowObject.markChanged();

        if (self.changed === false) {
          $(Drupal.theme('tableDragChangedWarning')).insertBefore(self.table).hide().fadeIn('slow');
          self.changed = true;
        }
      }

      if (self.indentEnabled) {
        self.rowObject.removeIndentClasses();
      }

      if (self.oldRowElement) {
        $(self.oldRowElement).removeClass('drag-previous');
      }

      $droppedRow.removeClass('drag').addClass('drag-previous');
      self.oldRowElement = droppedRow;
      self.onDrop();
      self.rowObject = null;
    }

    if (self.dragObject !== null) {
      self.dragObject = null;
      $('body').removeClass('drag');
      clearInterval(self.scrollInterval);
    }
  };

  Drupal.tableDrag.prototype.pointerCoords = function (event) {
    if (event.pageX || event.pageY) {
      return {
        x: event.pageX,
        y: event.pageY
      };
    }

    return {
      x: event.clientX + document.body.scrollLeft - document.body.clientLeft,
      y: event.clientY + document.body.scrollTop - document.body.clientTop
    };
  };

  Drupal.tableDrag.prototype.getPointerOffset = function (target, event) {
    var docPos = $(target).offset();
    var pointerPos = this.pointerCoords(event);
    return {
      x: pointerPos.x - docPos.left,
      y: pointerPos.y - docPos.top
    };
  };

  Drupal.tableDrag.prototype.findDropTargetRow = function (x, y) {
    var _this3 = this;

    var rows = $(this.table.tBodies[0].rows).not(':hidden');

    var _loop = function _loop(n) {
      var row = rows[n];
      var $row = $(row);
      var rowY = $row.offset().top;
      var rowHeight = void 0;

      if (row.offsetHeight === 0) {
        rowHeight = parseInt(row.firstChild.offsetHeight, 10) / 2;
      } else {
        rowHeight = parseInt(row.offsetHeight, 10) / 2;
      }

      if (y > rowY - rowHeight && y < rowY + rowHeight) {
        if (_this3.indentEnabled) {
          if (Object.keys(_this3.rowObject.group).some(function (o) {
            return _this3.rowObject.group[o] === row;
          })) {
            return {
              v: null
            };
          }
        } else if (row === _this3.rowObject.element) {
          return {
            v: null
          };
        }

        if (!_this3.rowObject.isValidSwap(row)) {
          return {
            v: null
          };
        }

        while ($row.is(':hidden') && $row.prev('tr').is(':hidden')) {
          $row = $row.prev('tr:first-of-type');
          row = $row.get(0);
        }

        return {
          v: row
        };
      }
    };

    for (var n = 0; n < rows.length; n++) {
      var _ret = _loop(n);

      if (_typeof(_ret) === "object") return _ret.v;
    }

    return null;
  };

  Drupal.tableDrag.prototype.updateFields = function (changedRow) {
    var _this4 = this;

    Object.keys(this.tableSettings || {}).forEach(function (group) {
      _this4.updateField(changedRow, group);
    });
  };

  Drupal.tableDrag.prototype.updateField = function (changedRow, group) {
    var rowSettings = this.rowSettings(group, changedRow);
    var $changedRow = $(changedRow);
    var sourceRow;
    var $previousRow;
    var previousRow;
    var useSibling;

    if (rowSettings.relationship === 'self' || rowSettings.relationship === 'group') {
      sourceRow = changedRow;
    } else if (rowSettings.relationship === 'sibling') {
      $previousRow = $changedRow.prev('tr:first-of-type');
      previousRow = $previousRow.get(0);
      var $nextRow = $changedRow.next('tr:first-of-type');
      var nextRow = $nextRow.get(0);
      sourceRow = changedRow;

      if ($previousRow.is('.draggable') && $previousRow.find(".".concat(group)).length) {
        if (this.indentEnabled) {
          if ($previousRow.find('.js-indentations').length === $changedRow.find('.js-indentations').length) {
            sourceRow = previousRow;
          }
        } else {
          sourceRow = previousRow;
        }
      } else if ($nextRow.is('.draggable') && $nextRow.find(".".concat(group)).length) {
        if (this.indentEnabled) {
          if ($nextRow.find('.js-indentations').length === $changedRow.find('.js-indentations').length) {
            sourceRow = nextRow;
          }
        } else {
          sourceRow = nextRow;
        }
      }
    } else if (rowSettings.relationship === 'parent') {
      $previousRow = $changedRow.prev('tr');
      previousRow = $previousRow;

      while ($previousRow.length && $previousRow.find('.js-indentation').length >= this.rowObject.indents) {
        $previousRow = $previousRow.prev('tr');
        previousRow = $previousRow;
      }

      if ($previousRow.length) {
        sourceRow = $previousRow.get(0);
      } else {
        sourceRow = $(this.table).find('tr.draggable:first-of-type').get(0);

        if (sourceRow === this.rowObject.element) {
          sourceRow = $(this.rowObject.group[this.rowObject.group.length - 1]).next('tr.draggable').get(0);
        }

        useSibling = true;
      }
    }

    this.copyDragClasses(sourceRow, changedRow, group);
    rowSettings = this.rowSettings(group, changedRow);

    if (useSibling) {
      rowSettings.relationship = 'sibling';
      rowSettings.source = rowSettings.target;
    }

    var targetClass = ".".concat(rowSettings.target);
    var targetElement = $changedRow.find(targetClass).get(0);

    if (targetElement) {
      var sourceClass = ".".concat(rowSettings.source);
      var sourceElement = $(sourceClass, sourceRow).get(0);

      switch (rowSettings.action) {
        case 'depth':
          targetElement.value = $(sourceElement).closest('tr').find('.js-indentation').length;
          break;

        case 'match':
          targetElement.value = sourceElement.value;
          break;

        case 'order':
          {
            var siblings = this.rowObject.findSiblings(rowSettings);

            if ($(targetElement).is('select')) {
              var values = [];
              $(targetElement).find('option').each(function () {
                values.push(this.value);
              });
              var maxVal = values[values.length - 1];
              $(siblings).find(targetClass).each(function () {
                if (values.length > 0) {
                  this.value = values.shift();
                } else {
                  this.value = maxVal;
                }
              });
            } else {
              var weight = parseInt($(siblings[0]).find(targetClass).val(), 10) || 0;
              $(siblings).find(targetClass).each(function () {
                this.value = weight;
                weight++;
              });
            }

            break;
          }
      }
    }
  };

  Drupal.tableDrag.prototype.copyDragClasses = function (sourceRow, targetRow, group) {
    var sourceElement = $(sourceRow).find(".".concat(group));
    var targetElement = $(targetRow).find(".".concat(group));

    if (sourceElement.length && targetElement.length) {
      targetElement[0].className = sourceElement[0].className;
    }
  };

  Drupal.tableDrag.prototype.checkScroll = function (cursorY) {
    var de = document.documentElement;
    var b = document.body;
    var windowHeight = window.innerHeight || (de.clientHeight && de.clientWidth !== 0 ? de.clientHeight : b.offsetHeight);
    this.windowHeight = windowHeight;
    var scrollY;

    if (document.all) {
      scrollY = !de.scrollTop ? b.scrollTop : de.scrollTop;
    } else {
      scrollY = window.pageYOffset ? window.pageYOffset : window.scrollY;
    }

    this.scrollY = scrollY;
    var trigger = this.scrollSettings.trigger;
    var delta = 0;

    if (cursorY - scrollY > windowHeight - trigger) {
      delta = trigger / (windowHeight + scrollY - cursorY);
      delta = delta > 0 && delta < trigger ? delta : trigger;
      return delta * this.scrollSettings.amount;
    }

    if (cursorY - scrollY < trigger) {
      delta = trigger / (cursorY - scrollY);
      delta = delta > 0 && delta < trigger ? delta : trigger;
      return -delta * this.scrollSettings.amount;
    }
  };

  Drupal.tableDrag.prototype.setScroll = function (scrollAmount) {
    var self = this;
    this.scrollInterval = setInterval(function () {
      self.checkScroll(self.currentPointerCoords.y);
      var aboveTable = self.scrollY > self.table.topY;
      var belowTable = self.scrollY + self.windowHeight < self.table.bottomY;

      if (scrollAmount > 0 && belowTable || scrollAmount < 0 && aboveTable) {
        window.scrollBy(0, scrollAmount);
      }
    }, this.scrollSettings.interval);
  };

  Drupal.tableDrag.prototype.restripeTable = function () {
    $(this.table).find('> tbody > tr.draggable, > tr.draggable').filter(':visible').filter(':odd').removeClass('odd').addClass('even').end().filter(':even').removeClass('even').addClass('odd');
  };

  Drupal.tableDrag.prototype.onDrag = function () {
    return null;
  };

  Drupal.tableDrag.prototype.onDrop = function () {
    return null;
  };

  Drupal.tableDrag.prototype.row = function (tableRow, method, indentEnabled, maxDepth, addClasses) {
    var $tableRow = $(tableRow);
    this.element = tableRow;
    this.method = method;
    this.group = [tableRow];
    this.groupDepth = $tableRow.find('.js-indentation').length;
    this.changed = false;
    this.table = $tableRow.closest('table')[0];
    this.indentEnabled = indentEnabled;
    this.maxDepth = maxDepth;
    this.direction = '';

    if (this.indentEnabled) {
      this.indents = $tableRow.find('.js-indentation').length;
      this.children = this.findChildren(addClasses);
      this.group = this.group.concat(this.children);

      for (var n = 0; n < this.group.length; n++) {
        this.groupDepth = Math.max($(this.group[n]).find('.js-indentation').length, this.groupDepth);
      }
    }
  };

  Drupal.tableDrag.prototype.row.prototype.findChildren = function (addClasses) {
    var parentIndentation = this.indents;
    var currentRow = $(this.element, this.table).next('tr.draggable');
    var rows = [];
    var child = 0;

    function rowIndentation(indentNum, el) {
      var self = $(el);

      if (child === 1 && indentNum === parentIndentation) {
        self.addClass('tree-child-first');
      }

      if (indentNum === parentIndentation) {
        self.addClass('tree-child');
      } else if (indentNum > parentIndentation) {
        self.addClass('tree-child-horizontal');
      }
    }

    while (currentRow.length) {
      if (currentRow.find('.js-indentation').length > parentIndentation) {
        child++;
        rows.push(currentRow[0]);

        if (addClasses) {
          currentRow.find('.js-indentation').each(rowIndentation);
        }
      } else {
        break;
      }

      currentRow = currentRow.next('tr.draggable');
    }

    if (addClasses && rows.length) {
      $(rows[rows.length - 1]).find(".js-indentation:nth-child(".concat(parentIndentation + 1, ")")).addClass('tree-child-last');
    }

    return rows;
  };

  Drupal.tableDrag.prototype.row.prototype.isValidSwap = function (row) {
    var $row = $(row);

    if (this.indentEnabled) {
      var prevRow;
      var nextRow;

      if (this.direction === 'down') {
        prevRow = row;
        nextRow = $row.next('tr').get(0);
      } else {
        prevRow = $row.prev('tr').get(0);
        nextRow = row;
      }

      this.interval = this.validIndentInterval(prevRow, nextRow);

      if (this.interval.min > this.interval.max) {
        return false;
      }
    }

    if (this.table.tBodies[0].rows[0] === row && $row.is(':not(.draggable)')) {
      return false;
    }

    return true;
  };

  Drupal.tableDrag.prototype.row.prototype.swap = function (position, row) {
    this.group.forEach(function (row) {
      Drupal.detachBehaviors(row, drupalSettings, 'move');
    });
    $(row)[position](this.group);
    this.group.forEach(function (row) {
      Drupal.attachBehaviors(row, drupalSettings);
    });
    this.changed = true;
    this.onSwap(row);
  };

  Drupal.tableDrag.prototype.row.prototype.validIndentInterval = function (prevRow, nextRow) {
    var $prevRow = $(prevRow);
    var maxIndent;
    var minIndent = nextRow ? $(nextRow).find('.js-indentation').length : 0;

    if (!prevRow || $prevRow.is(':not(.draggable)') || $(this.element).is('.tabledrag-root')) {
      maxIndent = 0;
    } else {
      maxIndent = $prevRow.find('.js-indentation').length + ($prevRow.is('.tabledrag-leaf') ? 0 : 1);

      if (this.maxDepth) {
        maxIndent = Math.min(maxIndent, this.maxDepth - (this.groupDepth - this.indents));
      }
    }

    return {
      min: minIndent,
      max: maxIndent
    };
  };

  Drupal.tableDrag.prototype.row.prototype.indent = function (indentDiff) {
    var $group = $(this.group);

    if (!this.interval) {
      var prevRow = $(this.element).prev('tr').get(0);
      var nextRow = $group.eq(-1).next('tr').get(0);
      this.interval = this.validIndentInterval(prevRow, nextRow);
    }

    var indent = this.indents + indentDiff;
    indent = Math.max(indent, this.interval.min);
    indent = Math.min(indent, this.interval.max);
    indentDiff = indent - this.indents;

    for (var n = 1; n <= Math.abs(indentDiff); n++) {
      if (indentDiff < 0) {
        $group.find('.js-indentation:first-of-type').remove();
        this.indents--;
      } else {
        $group.find('td:first-of-type').prepend(Drupal.theme('tableDragIndentation'));
        this.indents++;
      }
    }

    if (indentDiff) {
      this.changed = true;
      this.groupDepth += indentDiff;
      this.onIndent();
    }

    return indentDiff;
  };

  Drupal.tableDrag.prototype.row.prototype.findSiblings = function (rowSettings) {
    var siblings = [];
    var directions = ['prev', 'next'];
    var rowIndentation = this.indents;
    var checkRowIndentation;

    for (var d = 0; d < directions.length; d++) {
      var checkRow = $(this.element)[directions[d]]();

      while (checkRow.length) {
        if (checkRow.find(".".concat(rowSettings.target))) {
          if (this.indentEnabled) {
            checkRowIndentation = checkRow.find('.js-indentation').length;
          }

          if (!this.indentEnabled || checkRowIndentation === rowIndentation) {
            siblings.push(checkRow[0]);
          } else if (checkRowIndentation < rowIndentation) {
            break;
          }
        } else {
          break;
        }

        checkRow = checkRow[directions[d]]();
      }

      if (directions[d] === 'prev') {
        siblings.reverse();
        siblings.push(this.element);
      }
    }

    return siblings;
  };

  Drupal.tableDrag.prototype.row.prototype.removeIndentClasses = function () {
    var _this5 = this;

    Object.keys(this.children || {}).forEach(function (n) {
      $(_this5.children[n]).find('.js-indentation').removeClass('tree-child').removeClass('tree-child-first').removeClass('tree-child-last').removeClass('tree-child-horizontal');
    });
  };

  Drupal.tableDrag.prototype.row.prototype.markChanged = function () {
    var marker = Drupal.theme('tableDragChangedMarker');
    var cell = $(this.element).find('td:first-of-type');

    if (cell.find('abbr.tabledrag-changed').length === 0) {
      cell.append(marker);
    }
  };

  Drupal.tableDrag.prototype.row.prototype.onIndent = function () {
    return null;
  };

  Drupal.tableDrag.prototype.row.prototype.onSwap = function (swappedRow) {
    return null;
  };

  $.extend(Drupal.theme, {
    tableDragChangedMarker: function tableDragChangedMarker() {
      return "<abbr class=\"warning tabledrag-changed\" title=\"".concat(Drupal.t('Changed'), "\">*</abbr>");
    },
    tableDragIndentation: function tableDragIndentation() {
      return '<div class="js-indentation indentation">&nbsp;</div>';
    },
    tableDragChangedWarning: function tableDragChangedWarning() {
      return "<div class=\"tabledrag-changed-warning messages messages--warning\" role=\"alert\">".concat(Drupal.theme('tableDragChangedMarker'), " ").concat(Drupal.t('You have unsaved changes.'), "</div>");
    },
    tableDragToggle: function tableDragToggle() {
      return "<div class=\"tabledrag-toggle-weight-wrapper\" data-drupal-selector=\"tabledrag-toggle-weight-wrapper\">\n            <button type=\"button\" class=\"link tabledrag-toggle-weight\" data-drupal-selector=\"tabledrag-toggle-weight\"></button>\n            </div>";
    },
    toggleButtonContent: function toggleButtonContent(show) {
      return show ? Drupal.t('Hide row weights') : Drupal.t('Show row weights');
    },
    tableDragHandle: function tableDragHandle() {
      return "<a href=\"#\" title=\"".concat(Drupal.t('Drag to re-order'), "\"\n        class=\"tabledrag-handle\"><div class=\"handle\">&nbsp;</div></a>");
    }
  });
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
