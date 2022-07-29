"use strict";


(function(factory) {
  // const inputNewletter = document.getElementById('edit-email-newsletter');
  // inputNewletter.addEventListener('change', function(e){
  //   document.getElementById("edit-actions-01-submit").setAttribute('style', 'top:-298px !important');

  // });

  if (typeof define === 'function' && define.amd) {
      // AMD
      define(['jquery'], factory);
  } else if (typeof exports === 'object') {
      // CommonJS
      factory(require('jquery'));
  } else {
      // Browser globals
      factory(jQuery);
  }
}(function($) {
  var CountTo = function(element, options) {
      this.$element = $(element);
      this.options = $.extend({}, CountTo.DEFAULTS, this.dataOptions(), options);
      this.init();
  };

  CountTo.DEFAULTS = {
      from: 0, // the number the element should start at
      to: 0, // the number the element should end at
      speed: 1000, // how long it should take to count between the target numbers
      refreshInterval: 100, // how often the element should be updated
      decimals: 0, // the number of decimal places to show
      formatter: formatter, // handler for formatting the value before rendering
      onUpdate: null, // callback method for every time the element is updated
      onComplete: null // callback method for when the element finishes updating
  };

  CountTo.prototype.init = function() {
      this.value = this.options.from;
      this.loops = Math.ceil(this.options.speed / this.options.refreshInterval);
      this.loopCount = 0;
      this.increment = (this.options.to - this.options.from) / this.loops;
  };

  CountTo.prototype.dataOptions = function() {
      var options = {
          from: this.$element.data('from'),
          to: this.$element.data('to'),
          speed: this.$element.data('speed'),
          refreshInterval: this.$element.data('refresh-interval'),
          decimals: this.$element.data('decimals')
      };

      var keys = Object.keys(options);

      for (var i in keys) {
          var key = keys[i];

          if (typeof(options[key]) === 'undefined') {
              delete options[key];
          }
      }

      return options;
  };

  CountTo.prototype.update = function() {
      this.value += this.increment;
      this.loopCount++;

      this.render();

      if (typeof(this.options.onUpdate) == 'function') {
          this.options.onUpdate.call(this.$element, this.value);
      }

      if (this.loopCount >= this.loops) {
          clearInterval(this.interval);
          this.value = this.options.to;

          if (typeof(this.options.onComplete) == 'function') {
              this.options.onComplete.call(this.$element, this.value);
          }
      }
  };

  CountTo.prototype.render = function() {
      var formattedValue = this.options.formatter.call(this.$element, this.value, this.options);
      this.$element.text(formattedValue);
  };

  CountTo.prototype.restart = function() {
      this.stop();
      this.init();
      this.start();
  };

  CountTo.prototype.start = function() {
      this.stop();
      this.render();
      this.interval = setInterval(this.update.bind(this), this.options.refreshInterval);
  };

  CountTo.prototype.stop = function() {
      if (this.interval) {
          clearInterval(this.interval);
      }
  };

  CountTo.prototype.toggle = function() {
      if (this.interval) {
          this.stop();
      } else {
          this.start();
      }
  };

  function formatter(value, options) {
      return value.toFixed(options.decimals);
  }

  $.fn.countTo = function(option) {
      return this.each(function() {
          var $this = $(this);
          var data = $this.data('countTo');
          var init = !data || typeof(option) === 'object';
          var options = typeof(option) === 'object' ? option : {};
          var method = typeof(option) === 'string' ? option : 'start';

          if (init) {
              if (data) data.stop();
              $this.data('countTo', data = new CountTo(this, options));
          }

          data[method].call(data);
      });
  };
}));




(function ($) {

  //SEE LEE (Ver Menos)
  $('#see_less').on('click', function() {
    $('#see_less i').toggleClass('see_less');
  })


  var URLlang = window.location.href;
  console.log('LOG ' + URLlang.split('/'));


      // STEPPER ~ Muda o progresso o stepper
          //INICIO

          var el_count = 0;
          var divider = document.querySelectorAll('.bs-stepper-line');
          var stepper_progress = document.querySelectorAll('.step');

          $(stepper_progress[0]).addClass('active');

          function stepperUpdate(){
            $(stepper_progress[0]).addClass('active');
                $(divider[el_count]).addClass('bs-stepper-line__active');
                $(stepper_progress[el_count]).addClass('active');
                el_count ++;
                if(el_count >= 3){
                  $(stepper_progress[3].getElementsByClassName('bs-stepper-circle')).addClass('end_stepper');
                }
          }

      // FORM (Informações Pessoais)
        //INICIO

          //Muda o foco para o passo seguinte

          // Processar FORM


          $('#form_info_pessoal').on( "submit", function( event ) {
            var nome = document.getElementById('name');
            var nif = document.getElementById('nif');
            var tel = document.getElementById('tel');
            var email = document.getElementById('email');
            var data_nascimento = document.getElementById('data_nascimento');
            event.preventDefault();
            if(this.checkValidity() === true){
              if(nome.value == ''){
                $(nome).addClass('has-error');
              }
              if(nif.value == ''){
                $(nif).addClass('has-error');
              }
              if(nif.value == ''){
                $(nif).addClass('has-error');
              }
              if(tel.value == ''){
                $(tel).addClass('has-error');
              }
              if(email.value == ''){
                $(email).addClass('has-error');
              }
              if(data_nascimento.value == ''){
                $(data_nascimento).addClass('has-error');
              }
              Swal.fire(
                'Por favor, preeencha todos os campos!',
                '',
                'error'
              );
            } else{
              $('.form_progress--indicator').addClass('iactive');
              document.getElementById("info_morada").disabled = false;
              document.getElementById("info_pessoal").disabled = true;
              $('#info_pessoal').addClass('disabled');
              var tele = document.getElementById('edit-numero-telemovel-segurado');
          tele.removeAttribute('class');
          tele.setAttribute('class' , 'form-control');
            }
          });

          $('#form_morada_submit').on( "click", function( event ) {
            event.preventDefault();
            var form_morada = document.getElementById('form_info_morada');
            var morada = document.getElementById('morada');
            var complemento = document.getElementById('complemento');
            var provincia = document.getElementById('provincia');
            var municipio = document.getElementById('municipio');
            var distrito = document.getElementById('distrito');
            var bairro = document.getElementById('bairro');
            var polica_privacidade = document.getElementById('polica_privacidade');


            if(form_morada.checkValidity() === true){
              if(morada.value == ''){
                $(morada).addClass('has-error');
              }
              if(complemento.value == ''){
                $(complemento).addClass('has-error');
              }
              if(provincia.value == ''){
                $(provincia).addClass('has-error');
              }
              if(municipio.value == ''){
                $(municipio).addClass('has-error');
              }
              if(distrito.value == ''){
                $(distrito).addClass('has-error');
              }
              if(bairro.value == ''){
                $(bairro).addClass('has-error');
              }
              if(polica_privacidade.checked === false){
                $(polica_privacidade).addClass('has-error');
              }
              Swal.fire(
                'Por favor, preeencha todos os campos!',
                '',
                'error'
              );
            }
            if(form_morada.checkValidity() === false){
              $('*').removeClass('has-error');
              stepper.next();
              $(stepper_progress[1].getElementsByClassName('bs-stepper-circle')).addClass('comp_stepper');
              stepperUpdate();
              var telm = document.getElementById('edit-numero-telemovel-segurado');
          telm.removeAttribute('class');
          telm.setAttribute('class' , 'form-control');
            }
          });



        //FIM

      // Form (Dados da Morada) Step 2

        // INICIO
        /* ----------------------------------------------------  */

          $('#endereco_seguro_nao').on('change', function(){
            document.getElementById("endereco_segurado").hidden = false;

          });

          // Desativa os endereços do seguro
          $('#endereco_seguro_sim').on('change', function(){
            document.getElementById("endereco_segurado").hidden = true;
          });

          // Desativa a seguradora
          $('#outro_seguro_nao').on('change', function(){
            document.getElementById("seguradora_name").hidden = true;

          });

          $('#outro_seguro_sim').on('change', function(){
            document.getElementById("seguradora_name").hidden = false;
          });

          /* ---------------------------------------------------- */
        // FIM

        $('#form_final_submit').on('click', function(e){
          e.preventDefault();
          var form = document.getElementById('form_final');
          var card_number = document.getElementById('card_number');
          var ano_expire = document.getElementById('ano_expire');
          var cvv = document.getElementById('cvv');

          if(form.checkValidity() === false){
            if(card_number.value == ''){
              $('.creditcard-box').addClass('has-error');
            }
            if(ano_expire.value == '' || ano_expire.value < 0){
              $(ano_expire).addClass('has-error');
            }
            if(cvv.value == '' || cvv.value < 0){
              $(cvv).addClass('has-error');
            }
            Swal.fire(
              'Todos os campos são obrigatórios!',
              '',
              'error'
            );

          }

          if(form.checkValidity() === true){
            $('*').removeClass('has-error');
            stepper.next();
            stepperUpdate();
          }

        });

        $('#form_nota_submit').on('click', function(e){
          e.preventDefault();

            $('*').removeClass('has-error');
            stepper.next();
            stepperUpdate();

        });

        $('#form_final_debito_submit').on('click', function(e){
          e.preventDefault();
          var form_debito = document.getElementById('form_final_debito');
          var nome_concorrista = document.getElementById('nome_concorrista');
          var nif_concorrista = document.getElementById('nif_concorrista');
          var b_conta = document.getElementById('b_conta');
          var b_iban = document.getElementById('b_iban');
          var b_agree = document.getElementById('b_agree');

          if(form_debito.checkValidity() === false){
            if(nome_concorrista.value == ''){
              $(nome_concorrista).addClass('has-error');
            }
            if(nif_concorrista.value == ''){
              $(nif_concorrista).addClass('has-error');
            }
            if(b_conta.value == ''){
              $(b_conta).addClass('has-error');
            }
            if(b_iban.value == ''){
              $(b_iban).addClass('has-error');
            }
            if(b_agree.checked === false){
              $(b_agree).addClass('has-error');
            }
            Swal.fire(
              'Todos os campos são obrigatórios!',
              '',
              'error'
            );

          }

          if(form_debito.checkValidity() === true){
            console.log(form_debito.checkValidity())
            $('*').removeClass('has-error');
            stepper.next();
            stepperUpdate();
          }

        });

        $('goToFinal').on('click', function(e){
          e.preventDefault();
            stepper.next();
            $(stepper_progress[3].getElementsByClassName('bs-stepper-circle')).addClass('comp_stepper');
            stepperUpdate();

        });



        $('.prevent').on('click', function(e){
          e.preventDefault();
              $(stepper_progress[0]).addClass('active');
              $(stepper_progress[0].getElementsByClassName('bs-stepper-circle')).addClass('comp_stepper');
              $(divider[el_count]).addClass('bs-stepper-line__active');
              $(stepper_progress[el_count]).addClass('active');
              el_count ++;
        });

          //FIM


    $('.section-faqs .container h3.font-alt').each(function(i,e){
      e.innerText != '' ? $(e).css('display','block') :  $(e).css('display','none');
      console.log(e);
    });

    $('.prevent').on('click', function(e){
      e.preventDefault();

    });
        $('.mdl').fadeOut();

        $('.item').on('click', function(e) {

          $('div#'+$(this).data("id")).fadeIn()

        });
        $('.hm-produtos').mouseover(function(){
            let svg = $(this).find('object')[0].contentDocument.documentElement;
            $(svg).find('path').css('fill','white');
            $(svg).find('polygon').css('fill','white');
            $(svg).find('rect').css('fill','white');
        }).mouseleave(function(){
          let svg = $(this).find('object')[0].contentDocument.documentElement;
            $(svg).find('path').css('fill','black');
            $(svg).find('polygon').css('fill','black');
            $(svg).find('rect').css('fill','black');
        });

        // document.getElementsByClassName('nav-item')[6].getElementsByTagName('a')[0].classList.add('btn');
        // document.getElementsByClassName('nav-item')[6].getElementsByTagName('a')[0].classList.add('btn-contratar');


        $(".btn-search").on('click', function(e){
          $("#block-bartik-search").slideToggle("500", "easeInOutCirc");
          $(".searchInpit").focus()
          e.preventDefault();
        });

        $('.language-switcher-language-url').find('.links li').each(function(i,e){
          $('ul.lang-list').append( $(e).addClass('nav-item'));
        });
        $('li.en.nav-item a').addClass('nav-link');
        $('li.pt-pt.nav-item a').addClass('nav-link');
        $('.carousel-item:first-child').addClass('active');

        var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "wheel" //FF doesn't recognize mousewheel as of FF3.x
        if (document.attachEvent) //if IE (and Opera depending on user setting)
          document.attachEvent("on"+mousewheelevt, scrollEvent)
        else if (document.addEventListener) //WC3 browsers.
          document.addEventListener(mousewheelevt, scrollEvent, false)
        $(document.body).on('touchmove', scrollEvent);
        
        function scrollEvent(){
          var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
          if (scrollTop >= 100) {
            $('a.btn-back-to-top').fadeIn();
          } else {
            $('a.btn-back-to-top').fadeOut();
          }
        }
        /*$(window).scroll(function () {
          if ($(this).scrollTop() >= 100) {
            $('a.btn-back-to-top').fadeIn();
          } else {
            $('a.btn-back-to-top').fadeOut();
          }
        }); */
        $('a.btn-back-to-top').click(function(){
            $("html, body").animate({ scrollTop: 0 }, 300);
            return false;
        });

        $('.your-class').slick({
          slidesToShow: 3,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2000,
          prevArrow: '<button type="button" class="slick-prev"></button>',
          nextArrow: '<button type="button" class="slick-next"></button>',
          responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
        });


        var URLlangSr = window.location.href;
        if(URLlangSr.split('/')[3] == 'en'){
          $('.card-buton').addClass('btn-services-en');
        }

        $('.sn_curiosity').first().addClass('first-element');

        $('.prod-card').each(function(i){
          if(i >= 4)
            $('.prod-card')[i].style.display = "none";
        });


        $('#arrow-button').on('click', function(){
          if($(this).hasClass("arrow-button-seguro")){
            $([document.documentElement, document.body]).animate({
              scrollTop: $("#coberturas").offset().top - 200
            }, 2000);
          } else if($(this).hasClass("arrow-button-home")){
            $([document.documentElement, document.body]).animate({
              scrollTop: $("#divseguros").offset().top - 270
            }, 2000);
          }
        });



// custom formatting example
$('.counter').data('countToOptions', {
  formatter: function(value, options) {
    return value.toFixed(options.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ',');
  }
});

// custom callback when counting completes
$('#countdown').data('countToOptions', {
  onComplete: function(value) {
    $(this).text('BLAST OFF!').addClass('red');
  }
});

// another custom callback for counting to infinity
$('#infinity').data('countToOptions', {
  onComplete: function(value) {
    count.call(this, {
      from: value,
      to: value + 1000
    });
  }
});

// start all the timers
$('.timer').each(count);

// restart a timer when a button is clicked
$('.restart').click(function(event) {
  event.preventDefault();
  var target = $(this).data('target');
  $(target).countTo('restart');
});

function count(options) {
  var $this = $(this);
  options = $.extend({}, options || {}, $this.data('countToOptions') || {});
  $this.countTo(options);
}

function showHidePass(){
  if($('#show_hide_password input').attr("type") == "text"){
    $('#show_hide_password input').attr('type', 'password');
    $('#show_hide_password i').addClass( "fa-eye-slash" );
    $('#show_hide_password i').removeClass( "fa-eye" );
  }else if($('#show_hide_password input').attr("type") == "password"){
    $('#show_hide_password input').attr('type', 'text');
    $('#show_hide_password i').removeClass( "fa-eye-slash" );
    $('#show_hide_password i').addClass( "fa-eye" );
  }
}

let timerInterval
  $('.costumer-area').on('click', function(){
    Swal.fire({
      title: 'Você pode fazer o login com seu NIF ou BI',
      html: `
        <form class="client-loginForm">
          <div class="form-group mb">
            <input type="text" class="form-control" id="nif" style="color: #000000 !important; font-weight: 300 !important;" required>
            <label for="nif" class="ph-area">NIF / BI</label>
          </div>
          <div class="mb0 form-group">

            <input type="password" class="form-control" id="password" style="color: #000000 !important; font-weight: 300 !important;" required>
            <label for="password" class="ph-area">Digite sua senha</label>
            <i class="info-icon fa fa-info-circle"></i>
            <a class="btn-show" onclick="

              if(document.getElementById('password').getAttribute('type') == 'text'){

                document.getElementById('password').setAttribute('type', 'password');
                document.getElementById('icon-eye').classList.add( 'fa-eye-slash' );
                document.getElementById('icon-eye').classList.remove( 'fa-eye' );

              }else if(document.getElementById('password').getAttribute('type') == 'password'){

                document.getElementById('password').setAttribute('type', 'text');
                document.getElementById('icon-eye').classList.remove( 'fa-eye-slash' );
                document.getElementById('icon-eye').classList.add( 'fa-eye' );

              }

          "><i id="icon-eye" class="fa fa-eye-slash" aria-hidden="true"></i></a>

          </div>
        </form>
      `,
      footer: `
        <div class="line-footer"></div>
        <button class="btn-entrar btn btn-primary btn-block">QUERO ME CADASTRAR</button>
      `,
      confirmButtonText: 'FAZER LOGIN',
      customClass: {
        container: 'login-modal-container',
        popup: 'login-modal-popup',
        header: 'login-modal-header',
        title: 'login-modal-title',
        closeButton: 'login-modal-close-button',
        confirmButton: 'login-modal-confirm-button',
        content: 'login-modal-content',
        actions: 'login-modal-actions',
        footer: 'login-modal-footer'
      },
      showCloseButton: true,
      /* preConfirm: () => {
        let nif = Swal.getPopup().querySelector('#nif').value
        let senha = Swal.getPopup().querySelector('#senha').value
        if (nif === '' || senha === '') {
          Swal.showValidationMessage(`NIF/Senha vazio`)
        }
        return {nif: nif, senha: senha}
      } */
    }).then((result) => {
      /* Swal.fire({
        html: `
          <div class="pb0 p20">
            <i class="arrow-back fa fa-arrow-left"></i>
            <img class="confirm-logo" src="/sites/default/files/sise_navbar.png"/>
          </div>
          <hr/>
          <div class="p20">
            <img id="img-check" class="img-check show" src="/sites/default/files/checked.png" style="width: 100px; margin-bottom: 20px"/>
            <img id="img-loading" class="img-loading hide" src="/sites/default/files/iconecarregando.gif" style="width: 100px; margin-bottom: 20px"/>
            <h3 class="confirm-sucess-txt">Sucesso!</h3>
            <p style="color: #000000">Login realizado com sucesso!</p>
          </div>
          <script>
            timerInterval = setInterval(() => {
              console.log("Your text!");
            }, 100);
          </script>
        `,
        showCloseButton: true,
        customClass: {
          popup: 'login-modal-popup',
          container: 'login-modal-container',
          content: 'confirm-content',
          closeButton: 'login-modal-close-button',
          actions: 'confirm-actions',
        },
      }).then(() => {
        window.location.replace("/painel");
      }) */

      var timerInterval
        Swal.fire({

          html: `
          <div class="pb0 p10">
            <img class="confirm-logo" src="/nova/sites/default/files/sise_navbar.png"/>
          </div>
          <hr/>
          <div class="p10">
            <img id="img-check" class="img-check show" src="/nova/sites/default/files/carregando.gif" style="width: 100px; margin-bottom: 20px"/>
            <h3 class="confirm-sucess-txt">Sucesso!</h3>
            <p style="color: #000000">Login realizado com sucesso!</p>
          </div>
          <script>
            timerInterval = setInterval(() => {
              console.log("Your text!");
            }, 100);
          </script>
        `,customClass: {
          popup: 'login-modal-popup',
          container: 'login-modal-container',
          content: 'confirm-content',
          closeButton: 'login-modal-close-button',
          actions: 'confirm-actions',
        },
          timer: 5000,
          timerProgressBar: true,
          onBeforeOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
              var content = Swal.getContent()
              if (content) {
                var b = content.querySelector('b')
                if (b) {
                  b.textContent = Swal.getTimerLeft()
                }
              }
            }, 100)
          },
          onClose: () => {
            clearInterval(timerInterval);
            window.location.replace("/nova//painel");
          }
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
            console.log('I was closed by the timer')
          }
        })

    })
  });


  $('#edit-data-de-nascimento').attr('placeholder','Data de Nascimento');
  if(location.href.includes('/login')){
    $('.small-banner').fadeOut();
    $('nav.tabs').attr("style", "position:relative!important");
  }
  if(location.href.includes('/contacto') || location.href.includes('/contact')){

    $('.small-jumbotron').addClass('small-jumbotron-contact');
  }

  $('#search-block-form').attr('action', location.href.split('/').slice(0,4).join('/') + "/search/node" );
  $('#search-form').attr('action', location.href.split('/').slice(0,4).join('/') + "/search/node" );

  $('span.file.file--mime-application-pdf.file--application-pdf a').each(function(i,e){
    $(e).addClass('btnDownloadFile');
    location.href.includes('/pt-pt') ? $(e).text("Baixar Arquivo") : $(e).text('Download File');
  });

    $('#hm-prod').on('click', function(){
        location.href = $('#title-link a').attr('href');
    });

  Drupal.behaviors.jp_calisto = {
      attach: function (context, settings) {
             "use strict"; // Start of use strict





        $('.item').each(function(i){
          setTimeout(function(){
            $('.item').eq(i).addClass('is-visible');
          }, 200 * i);
        });
           /* ----------------------------------------------------------- */
               /*  Fixed header
               /* ----------------------------------------------------------- */

             // Smooth scrolling using jQuery easing
           // jQuery for page scrolling feature - requires jQuery Easing plugin

               $('a.js-scroll-trigger').on('click', function(event) {
                   var $anchor = $(this);
                   $('html, body').stop().animate({
                       scrollTop: $($anchor.attr('href')).offset().top
                   }, 1500, 'easeInOutExpo');
                   event.preventDefault();
               });


             // Closes responsive menu when a scroll trigger link is clicked
             $('.js-scroll-trigger').on('click', function(event) {
               $('.navbar-collapse').collapse('hide');
             });
           jQuery(document).ready(function( $ ) {

            var href = window.location.href;

            $('.language-switcher-language-url').find('.links li').each(function(i,e){
              $('ul.lang-list').append( $(e).addClass('nav-item'));
            });
            $('li.en.nav-item a').addClass('nav-link');
            $('li.pt-pt.nav-item a').addClass('nav-link');


            //---- Script Para mudar TXT dos cards Noticias -> Amarildo da Silva
            $("#btnVaga a").addClass( "btn" )
            $("#btnPro a").addClass( "btn" )
            $("#btnNews a").addClass( "btn" )

            if (href.toLowerCase().indexOf("pt") >= 0){
                $("#btnVaga a").text("Ver Vaga");
              //  $("#btnPro a").text("Ler Mais");
              //  $("#btnNews a").text("Ler Mais");
            } else{
                $("#btnVaga a").text("View Job");
              //  $("#btnPro a").text("Read More");
              //  $("#btnNews a").text("Read More");
            }
            //---- FIM

            //---- Script Para mudar Icone do Accordion -> Amarildo da Silva
            $('.accordion').each(function(i, obj1) {
              $(obj1).find('.collapse').each(function(i, obj2){
                var id = $(obj2).attr('id');
                $('#btn-'+id).click(function(){
                  $('.accordion').each(function(i, obj1) {
                    if($(obj1).find('.show').length > 0){
                      console.log('show');
                      $(obj1).find('#icon-'+id).addClass('fa-angle-down').removeClass('fa-angle-up');
                    }else {
                      $(obj1).find('#icon-'+id).addClass('fa-angle-up').removeClass('fa-angle-down');
                    }
                  });

                });
              })
            });
            //---- FIM

            var URLlang = window.location.href;
            /*
            if(URLlang.includes('pt-pt')){
              $('#search-form .js-form-wrapper #edit-submit')[0].value = "Pesquisar";
            }else{

              $('#search-form .js-form-wrapper #edit-submit')[0].value = "Search";

              $('.btn-servpro').addClass('btn-services-en');
            }
            if(location.href.includes('/contacto') || location.href.includes('/contact')){

              $('.small-jumbotron').addClass('small-jumbotron-contact');
            }
*/
            //$('#main-menu').style.marginTop = "80px";
/*
             $('a.btn-back-to-top').click(function(event){
                event.preventDefault();
                // When the user clicks on the button, scroll to the top of the document

                $('html, body').animate({scrollTop: 0}, 3000);

              });
*/
              /* mybutton = document.getElementById("myBtn"); */

              // When the user scrolls down 20px from the top of the document, show the button

                var popup=function(){
                   $('.portfolio-item .portfolio-popup').magnificPopup({
                       type: 'image',
                       removalDelay: 300,
                       mainClass: 'mfp-fade',
                       gallery: {
                           enabled: true
                       },
                       zoom: {
                           enabled: false,
                           duration: 300,
                           easing: 'ease-in-out',
                           opener: function(openerElement) {
                               return openerElement.is('img') ? openerElement : openerElement.find('img');
                           }
                       }
                   });
               }
               popup();
           });




            // Banner Slider
               $('.banner-slider ').slick({
                   vertical: true,
                   autoplay:true,
                   autoplaySpeed:5000,
                   verticalSwiping: true,
                   adaptiveHeight: true,
                   slidesToShow: 1,
                   slidesToScroll: 1,
                   dots: true,
                   arrows: false,
           //        prevArrow: '<div><button class="prevArrow arrowBtn"><i class="fa fa-angle-left"></i></button></div>',
           //        nextArrow: '<div><button class="nextArrow arrowBtn"><i class="fa fa-angle-right"></i></button></div>',

                   responsive: [{
                       breakpoint: 768,
                       settings: {
                           slidesToShow: 1,
                           slidesToScroll: 1,
                           vertical: false,
                           verticalSwiping: false,

                       }
                   }]
               });
            // Banner Slider

           $(window).on('load', function(){
               var $container = $('.portfolioContainer');

               var url_full =  window.location.href;
               var newurl = url_full.split('/');

             if(newurl[newurl.length-1]=='about-us' || newurl[newurl.length-1]=='jupiter' || newurl[newurl.length-1]=='sobre-nos'){
               $container.isotope({
                   filter: '.term-11',
                   animationOptions: {
                       duration: 750,
                       easing: 'linear',
                       queue: false
                   }
               });
              }else{
                $container.isotope({
                  filter: '.term-24',
                  animationOptions: {
                      duration: 750,
                      easing: 'linear',
                      queue: false
                  }
                });
              }



              $('.portfolioFilter a').click(function(){
                   $('.portfolioFilter .current').removeClass('current');
                   $(this).addClass('current');
                   $(".portfolioContainer .hide").addClass("portfolio-item");
                   $(".portfolioContainer .portfolio-item").removeClass("hide");
                   var selector = $(this).attr('data-filter');
                   if(selector != "*")
                   {
                       $(".portfolioContainer .categories:not( "
                       +selector+") .portfolio-item").addClass('hide');
                       $(".portfolioContainer .categories:not( "
                       +selector+") .hide").removeClass('portfolio-item');

                   }
                   $('.portfolio-item .portfolio-popup').magnificPopup({
                       type: 'image',
                       removalDelay: 300,
                       mainClass: 'mfp-fade',
                       gallery: {
                           enabled: true
                       },
                       zoom: {
                           enabled: false,
                           duration: 300,
                           easing: 'ease-in-out',
                           opener: function(openerElement) {
                               return openerElement.is('img') ? openerElement : openerElement.find('img');
                           }
                       }
                   });

                   $container.isotope({
                       filter: selector,
                       animationOptions: {
                           duration: 750,
                           easing: 'linear',
                           queue: false
                       }
                    });
                    return false;
               });
              var reSearchUrl = location.href;
              //$('.search-form').attr('action',reSearchUrl.split('/').slice(0,6).join('/'));

              if(document.getElementsByTagName('h3')[0].textContent == "A sua pesquisa não obteve resultados."){
                document.getElementsByTagName('footer')[0].style.marginTop = "100%";
              }
           });

       $("ul.tabs").addClass("tabs-top");

       jQuery(window).scroll(function(){
        if ($(window).width() > 768) {
          var scroll = $(window).scrollTop();
          if (scroll >= 125) {
              $(".container-header").addClass("fixed-top ");
              $("ul.tabs").addClass("tabs-top");
          } else {
              $(".container-header").removeClass("fixed-top");
              $("ul.tabs").removeClass("tabs-top");
          }
        }
       });

            var main_color = drupalSettings.main_color;
           // alert("Main Color "+main_color);
           $(':root').css('--main-theme-color', main_color);

           $("time.timeago").timeago();
           $('.carousel-item:first-child').addClass('active');
   }}})(jQuery, Drupal);// End of use strict


