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
