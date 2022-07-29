"use strict"

window.onload=function(){

  // Variáveis global
  var settingsElement = document.querySelector('script[type="application/json"][data-drupal-selector="drupal-settings-json"]');
  var drupalSettings = JSON.parse(settingsElement.textContent);
  var nodeid = drupalSettings['path']['currentPath'].split('/')[1];

  var url = location.href.split('/');
  var pageName = 4;


  function getCaptcha(id){
    var secret;
    var charsArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var lengthOtp = 6;
    var captcha = [];
    for (var i = 0; i < lengthOtp; i++) {
      //below code will not allow Repetition of Characters
      var index = Math.floor(Math.random() * charsArray.length + 1); //get the next character from the array
      if (captcha.indexOf(charsArray[index]) == -1)
        captcha.push(charsArray[index]);
      else i--;
    }
    var canv = document.createElement("canvas");
    canv.id = id;
    canv.width = 250;
    canv.height = 50;
    var ctx = canv.getContext("2d");
    ctx.font = "35px Verdana";
    ctx.strokeStyle = '#' + ('00000' + (Math.random() * 16777216 << 0).toString(16)).substr(-6);

    ctx.strokeText(captcha.join(""), 0, 30);
    secret = captcha.join("");
    var elem = document.getElementById(id);
    if(elem){
      elem.appendChild(canv);
    }
    return secret;
  }

  function confirmCaptcha(idForm, confirmForm, secret){
    var form = document.getElementById(idForm + '-add-form');
    var confirmCaptcha = document.getElementById(confirmForm);

    form.addEventListener('submit', function (e) {
      var errors = [];

      if(errors.length || confirmCaptcha.value != secret) {
        Swal.fire(
          '',
          url[4] == 'pt-pt' ||  url[3] == 'pt-pt' ? 'Erro! dados não enviados' : 'Error! data not sent',
          'error'
        );
        e.preventDefault(); // The browser will not make the HTTP POST request
        return;
        }else{
          Swal.fire(
            '',
            url[4] == 'pt-pt' ||  url[3] == 'pt-pt' ? 'Dados enviados com sucesso!' : 'Data sent successfully!',
            'success'
          );
        }
    });
  }
  
  if(url.length != 4 && url[pageName] == "contacto" || url[pageName] == "contact"){
    var cp = getCaptcha('edit-captcha-contacto');
      // COnfirmar Captcha
    confirmCaptcha(
      'webform-submission-solicitar-proposta-categoria-paragraph-171',
      'edit-insira-o-codigo-da-imagem',
      cp
    );

  } else {
    // Newsletter
    try {
      let cp = getCaptcha('edit-captcha');
      
      confirmCaptcha(
        'webform-submission-subscription-node-30',
        'edit-codigo-imagem',
        cp
      );
    } catch (error) {
      console.log(error);
    }

    // solicitacao-proposta-categoria
    var cp = getCaptcha('edit-captcha-contacto');
    
    try {
      
      confirmCaptcha(
        'webform-submission-solicitar-proposta-categoria-paragraph-171',
        'edit-insira-o-codigo-da-imagem',
        cp
      );

    } catch (error) {
      console.log(error);
    }

    // solicitacao-de-proposta
    try{
      confirmCaptcha(
        'webform-submission-solicitar-proposta-paragraph-170',
        'edit-insira-o-codigo-da-imagem',
        cp
      );
    }catch(error){
      console.log(error);
    }

    // seguro-vida-credito-bpc-salario
    try {
      confirmCaptcha(
        'webform-submission-solicitar-orcamento-node-11',
        'edit-insira-o-codigo-da-imagem',
        cp
      );

    } catch (error) {
      console.log(error);
    }
    
    //seguro-saude
    try {
      confirmCaptcha(
        'webform-submission-solicitar-orcamento-node-23',
        'edit-insira-o-codigo-da-imagem',
        cp
      );

    } catch (error) {
      console.log(error);
    }

    //seguro-
    try {
      confirmCaptcha(
        'webform-submission-solicitar-orcamento-node-20',
        'edit-insira-o-codigo-da-imagem',
        cp
      );

    } catch (error) {
      console.log(error);
    }
    
    // seguro-habitacao
    try {
      confirmCaptcha(
        'webform-submission-solicitar-orcamento-node-24',
        'edit-insira-o-codigo-da-imagem',
        cp
      );

    } catch (error) {
      console.log(error);
    }
   
    // periodo-de-cobertura
    try {
      confirmCaptcha(
        'webform-submission-solicitar-periodo-paragraph-172',
        'edit-insira-o-codigo-da-imagem',
        cp
      );
    } catch (error) {
      console.log(error);
    }

    // seguro-embarcacoes
    try {
      confirmCaptcha(
        'webform-submission-solicitar-orcamento-node-22',
        'edit-insira-o-codigo-da-imagem',
        cp
      );
    } catch (error) {
      console.log(error);
    }
    
    // seguro-avaria-de-maquinas
    try {
      confirmCaptcha(
        'webform-submission-solicitar-orcamento-node-19',
        'edit-insira-o-codigo-da-imagem',
        cp
      );
    } catch (error) {
      console.log(error);
    }
    
    // seguro-responsabilidade-civil-empresarial
    try {
      confirmCaptcha(
        'webform-submission-solicitar-orcamento-node-25',
        'edit-insira-o-codigo-da-imagem',
        cp
      );
    } catch (error) {
      console.log(error);
    }

    // seguro-
    try {
      confirmCaptcha(
        'webform-submission-solicitar-orcamento-node-18',
        'edit-insira-o-codigo-da-imagem',
        cp
      );
    } catch (error) {
      console.log(error);
    }
    
    
    // seguro-condomino
    try {
      confirmCaptcha(
        'webform-submission-solicitar-orcamento-node-21',
        'edit-insira-o-codigo-da-imagem',
        cp
      );
    } catch (error) {
      console.log(error);
    }

    // seguro-transporte
    try {
      confirmCaptcha(
        'webform-submission-solicitar-orcamento-node-17',
        'edit-insira-o-codigo-da-imagem',
        cp
      );
    } catch (error) {
      console.log(error);
    }
    
    // 
    try {
      confirmCaptcha(
        'webform-submission-solicitar-orcamento-node-16',
        'edit-insira-o-codigo-da-imagem',
        cp
      );
    } catch (error) {
      console.log(error);
    }
    
    // seguro-equipamentos-eletronicos
    try {
      confirmCaptcha(
        'webform-submission-solicitar-orcamento-node-15',
        'edit-insira-o-codigo-da-imagem',
        cp
      );
    } catch (error) {
      console.log(error);
    }
    
    // 
    try {
      confirmCaptcha(
        'webform-submission-solicitar-orcamento-node-18',
        'edit-insira-o-codigo-da-imagem',
        cp
      );
    } catch (error) {
      console.log(error);
    }

    // seguro-construcao-e-montagem
    try {
      confirmCaptcha(
        'webform-submission-solicitar-orcamento-node-13',
        'edit-insira-o-codigo-da-imagem',
        cp
      );
    } catch (error) {
      console.log(error);
    }

    // seguro-construcao-e-montagem
    try {
      confirmCaptcha(
        'webform-submission-solicitar-atendimento-paragraph-256',
        'edit-insira-o-codigo-da-imagem',
        cp
      );
    } catch (error) {
      console.log(error);
    }
  }
  



  // Formulário para descarregar portfólio
  if(url[pageName] == "descarregar-portifolio" || url[pageName] == "download-portfolio"){

    var downloadfrom = document.getElementById('webform-submission-descarregar-portifolio-node-'+nodeid+'-add-form');

    downloadfrom.addEventListener('submit', function (e) {
      var errors = [];

      if(errors.length) {
            sweetError();
            e.preventDefault(); // The browser will not make the HTTP POST request
            return;
        }else{
          sweetSuccess();
        }
    });
  }
 /*  if(url[pageName] == "solicitacao-de-proposta" || url[pageName] == "download-portfolio"){


    var downloadfrom = document.getElementById('webform-submission-solicitar-proposta-node-'+nodeid+'-add-form');
    console.log(downloadfrom)
    downloadfrom.addEventListener('submit', function (e) {
      var errors = [];

      if(errors.length) {
            sweetError();
            e.preventDefault(); // The browser will not make the HTTP POST request
            return;
        }else{
          sweetSuccess();
        }
    });
  } */

  // Formulário para submissão de vagas
  if(url[pageName] == 'trabalhe-connosco-0' || url[pageName] == "work-us"){

    var candidaturaForm = document.getElementById('webform-submission-formulario-candidatura-node-'+nodeid+'-add-form');

    candidaturaForm.addEventListener('submit', function (e) {
      var errors = [];

      if(errors.length) {
          sweetError();
          e.preventDefault(); // The browser will not make the HTTP POST request
          return;
      }else{
          sweetSuccess();
      }
    });

  }


  // Mensagens sweetalert
  function sweetSuccess(){
      Swal.fire(
        '',
        url[pageName - 1] == 'pt-pt' ? 'Dados enviados com sucesso!' : 'Data sent successfully!',
        'success'
      );
  }

  function sweetError(){
    Swal.fire(
      '',
      url[pageName - 1] == 'pt-pt' ? 'Erro! dados não enviados' : 'Error! data not sent',
      'error'
    );
  }

  // Formulário de Contacto
  if(url[pageName] == 'contacto' || url[pageName] == "contact"){

    var contactoForm = document.getElementById('webform-submission-entrar-em-contacto-node-'+nodeid+'-add-form');

    var contactCap = document.getElementById('edit-captcha-response');
    var confirmCaptcha = document.getElementById('edit-confirm-contact-captcha');

    contactoForm.addEventListener('submit', function (e) {
        var errors = [];

        // Check inputs...

        if(errors.length ||  confirmCaptcha.value  != contactCap.value ) {
          sweetError();
          e.preventDefault(); // The browser will not make the HTTP POST request
          return;
        }else{
          sweetSuccess();
        }
    });

  }

}
