<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* themes/jp_temisto/templates/layout/page--front.html.twig */
class __TwigTemplate_fb63d7ce60751c6816576caccfcbceb1 extends \Twig\Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
        $this->sandbox = $this->env->getExtension('\Twig\Extension\SandboxExtension');
        $this->checkSecurity();
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 1
        echo "<div class=\"main-menu-area\" id=\"main-menu\">
\t<div class=\"search-block-form contextual-region block block-search container-inline\"
\t\tdata-drupal-selector=\"search-block-form\" id=\"block-bartik-search\" role=\"search\">
\t\t<div class=\"content container-inline\">
\t\t\t<form action=\"/pesquisar\" method=\"get\" id=\"search-block-form\" accept-charset=\"UTF-8\"
\t\t\t\tclass=\"search-form search-block-form\" data-drupal-form-fields=\"edit-keys\">
\t\t\t\t<div
\t\t\t\t\tclass=\"js-form-item form-item js-form-type-search form-type-search js-form-item-keys form-item-keys form-no-label\">
\t\t\t\t\t<div class=\"search_box\">
\t\t\t\t\t<input title=\"Enter the terms you wish to search for.\" data-drupal-selector=\"edit-keys\"
\t\t\t\t\t\ttype=\"search\" id=\"edit-keys\" name=\"filter\" value=\"\" size=\"13\" maxlength=\"128\"
\t\t\t\t\t\tclass=\"form-search\" placeholder=\"";
        // line 12
        echo $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(t("O que procura?"));
        echo "\">
\t\t\t\t\t\t<button type=\"submit\" class=\"enviar \">BUSCAR</button>
\t\t\t\t\t</div>
\t\t\t\t\t\t<span class=\"d-flex justify-content-end text-white\">Insira os termos que voce deseja pesquisar.</span>
\t\t\t\t</div>
\t\t\t\t<span class=\"btn-search\">
\t\t\t\t\t<i class=\"fa fa-times-circle\"></i>
\t\t\t\t</span>
\t\t\t</form>
\t\t</div>
\t</div>

\t<div class=\"container-fluid fundo-header\">
\t\t<div class=\"row header-info\">
\t\t\t<div class=\"col-md-4 pt-1 phone\">
\t\t\t\t<img class=\"icones-header\" src=\"themes/jp_temisto/assets/phone-branco.png\">
\t\t\t\t<span class=\"info-contacto\"> Telefones: (+244) 222 011 009 | 918 84 81 50 | 932 34 66 48</span>
\t\t\t</div>
\t\t\t<div class=\"col-md-4 pt-1 email text-center\">
\t\t\t\t<img class=\"icones-header\" src=\"themes/jp_temisto/assets/mail-branco.png\">
\t\t\t\t<span class=\"info-contacto\"> Email:<span class=\"pl-2\">apoiocliente@mundial.co.ao</span></span>
\t\t\t</div>



\t\t\t<div class=\"barra-social  col-md-3\">
\t\t\t\t<div class=\"icones text-right\">
\t\t\t\t\t<a href=\"https://www.facebook.com/amuseseguros\" target=\"_blank\"><i class=\"fa fa-facebook\"></i></a>
\t\t\t\t\t<a href=\"https://twitter.com/amundialseguros\" target=\"_blank\"><i class=\"fa fa-twitter\"></i></a>
\t\t\t\t\t<a href=\"https://www.instagram.com/amundialseguros\" target=\"_blank\"><i
\t\t\t\t\t\t\tclass=\"fa fa-instagram\"></i></a>
\t\t\t\t    <a href=\"https://www.linkedin.com/company/a-mundial-seguros/\" target=\"_blank\"><i class=\"fa fa-linkedin\"></i></a>
\t\t\t\t    <a href=\"https://www.youtube.com/channel/UClDKhYKFeBzNkuNmjA00Qng\" target=\"_blank\"><i class=\"fa fa-youtube\"></i></a>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</div>

\t<div class=\"container-header\">
\t\t<nav class=\"navbar text-right navbar-expand-lg navbar-white site-navigation navbar-togglable\">
\t\t\t<a href=\"http://localhost/drupallll/node/52\">
\t\t\t\t<img class=\"logo-principal float-left\" width=\"210px\" height=\"55px;\"
\t\t\t\t\tsrc=\"themes/jp_temisto/assets/academia.png\">
\t\t\t</a>
\t\t\t<button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarCollapse\"
\t\t\t\taria-controls=\"navbarCollapse\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">
\t\t\t\t<span class=\"fa fa-bars\"></span>
\t\t\t</button>
\t\t\t";
        // line 60
        echo $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(twig_get_attribute($this->env, $this->source, ($context["page"] ?? null), "primary_menu", [], "any", false, false, true, 60), 60, $this->source), "html", null, true);
        echo "
\t\t</nav>
\t</div>
</div>

<!-- End NavBar -->

";
        // line 67
        $context["url"] = $this->extensions['Drupal\Core\Template\TwigExtension']->getUrl("<current>");
        // line 68
        echo "\t";
        if (twig_in_filter("user", $this->extensions['Drupal\Core\Template\TwigExtension']->renderVar($this->extensions['Drupal\Core\Template\TwigExtension']->renderVar(($context["url"] ?? null))))) {
            // line 69
            echo "\t<section class=\"section page-title bg-fixed bg-cover\" style=\"background-image: url(";
            echo $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(($context["banner_image"] ?? null), 69, $this->source), "html", null, true);
            echo ");\">
\t\t<div class=\"container\">
\t\t\t<div class=\"row align-items-center justify-content-center\">
\t\t\t\t<div class=\"col-md-6\">
\t\t\t\t\t<div class=\"service-banner\">
\t\t\t\t\t\t<h1>";
            // line 74
            echo $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed((($__internal_compile_0 = ($context["page"] ?? null)) && is_array($__internal_compile_0) || $__internal_compile_0 instanceof ArrayAccess ? ($__internal_compile_0["#title"] ?? null) : null), 74, $this->source), "html", null, true);
            echo "</h1>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t</section>
\t";
        }
        // line 81
        echo "\t";
        echo $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(twig_get_attribute($this->env, $this->source, ($context["page"] ?? null), "content", [], "any", false, false, true, 81), 81, $this->source), "html", null, true);
        echo "

\t<footer class=\"footer\">

\t\t<div class=\"footer-section pt-0\">
\t\t\t<div class=\"container\">
\t\t\t\t<div class=\"row\">
\t\t\t\t\t<div class=\"col-lg-4 col-md-6 m-15 px-tb col-sm-12\">
\t\t\t\t\t\t<div class=\"footer-content\">
\t\t\t\t\t\t\t";
        // line 90
        echo $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(twig_get_attribute($this->env, $this->source, ($context["page"] ?? null), "footer_col_4", [], "any", false, false, true, 90), 90, $this->source), "html", null, true);
        echo "
\t\t\t\t\t\t\t<div class=\"fot-contacte-nos\">
\t\t\t\t\t\t\t\t<h5 class=\"foot-1\">CONTACTE-NOS</h5>

\t\t\t\t\t\t\t\t<div class=\"local-endereco\">
\t\t\t\t\t\t\t\t\t<div><span class=\"localy\">Morada : </span>Av. Samora Machel. LOTE CS5B - (Talatona -
\t\t\t\t\t\t\t\t\t\tLuanda)
\t\t\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t\t\t\t<div><span class=\"localy\">Telefone :</span> (+244) 222 011 009 | 946 441 973</div>
\t\t\t\t\t\t\t\t\t<div><span class=\"localy\">E-mail :</span> apoiocliente@mundial.co.ao</div>
\t\t\t\t\t\t\t\t\t<div><span class=\"localy\">Segunda - Sexta :</span> 8:00 - 17:00</div>
\t\t\t\t\t\t\t\t\t<div><span class=\"localy\">Sábado - Domingo :</span> Fechado</div>
\t\t\t\t\t\t\t\t</div>


\t\t\t\t\t\t\t\t<h5 class=\"assine\">ASSINE NOSSA NEWSLETTER </h5>

\t\t\t\t\t\t\t\t<p class=\"paragrafo-assine\">Não enviaremos spam, nem repassaremos seu endereço de email
\t\t\t\t\t\t\t\t\ta terceiros.
\t\t\t\t\t\t\t\t\tEnviaremos apenas
\t\t\t\t\t\t\t\t\tactualizações jurídicas. A qualquer momento você poderá se descadastrar.</p>

\t\t\t\t\t";
        // line 114
        echo "\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t\t<div class=\"col-lg-3 m-15 px-tb col-md-6 col-sm-12\">
\t\t\t\t\t\t<div class=\"footer-content d-flex\">
\t\t\t\t\t\t\t<div class=\"menu1\">";
        // line 119
        echo $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(twig_get_attribute($this->env, $this->source, ($context["page"] ?? null), "footer_col_3", [], "any", false, false, true, 119), 119, $this->source), "html", null, true);
        echo "</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t\t<div class=\"col-lg-3 m-15px-tb col-md-8\">
\t\t\t\t\t\t<div class=\"footer-content d-flex\">
\t\t\t\t\t\t\t<div  class=\"menu2\">";
        // line 124
        echo $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(twig_get_attribute($this->env, $this->source, ($context["page"] ?? null), "footer_col_2", [], "any", false, false, true, 124), 124, $this->source), "html", null, true);
        echo "</div>
\t\t\t\t\t\t</div>


\t\t\t\t\t</div>
\t\t\t\t\t<div class=\"col-lg-2 m-15 px-tb col-md-3 col-sm-12 logo-footer\">
\t\t\t\t\t\t<div class=\"footer-content\">
\t\t\t\t\t\t\t<div class=\"menu3\">\t";
        // line 131
        echo $this->extensions['Drupal\Core\Template\TwigExtension']->escapeFilter($this->env, $this->sandbox->ensureToStringAllowed(twig_get_attribute($this->env, $this->source, ($context["page"] ?? null), "footer_col_1", [], "any", false, false, true, 131), 131, $this->source), "html", null, true);
        echo "
\t\t\t\t\t\t\t<div class=\"footer-social\">
\t\t\t\t\t\t\t\t<h1 class=\"seguir\">SIGA NOSSAS REDES SOCIAIS </h1>
\t\t\t\t\t\t\t\t<ul>
\t\t\t\t\t\t\t\t\t<li><a href=\"https://www.facebook.com/amuseseguros\" target=\"_blank\"><i
\t\t\t\t\t\t\t\t\t\t\t\tclass=\"fa fa-facebook\"></i></a></li>
\t\t\t\t\t\t\t\t\t<li><a href=\"https://instagram.com/amundialseguros?igshid=1tel197g7t600\"
\t\t\t\t\t\t\t\t\t\t\ttarget=\"_blank\"><i class=\"fa fa-instagram\"></i></a></li>
\t\t\t\t\t\t\t\t\t<li><a href=\"https://twitter.com/amundialseguros\" target=\"_blank\"><i
\t\t\t\t\t\t\t\t\t\t\t\tclass=\"fa fa-twitter\"></i></a></li>
\t\t\t\t\t\t\t\t\t<li><a href=\"https://www.linkedin.com/company/a-mundial-seguros/\"><i class=\"fa fa-linkedin\"></i></a></li>
\t\t\t\t\t\t\t\t\t<li><a href=\"https://www.youtube.com/channel/UClDKhYKFeBzNkuNmjA00Qng\"><i class=\"fa fa-youtube\"></i></a></li>
\t\t\t\t\t\t\t\t</ul>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t\t<div class=\"copyright-text pb-0\">
\t\t\t\t\t\t<p class=\"copyright\"> © 2022 |<a href=\"/pt-pt\" class=\"mundiseg\"> Mundial Seguros
\t\t\t\t\t\t\t</a>|
\t\t\t\t\t\t\tTodos direitos Reservados.</p>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t</div>
\t\t</div>
\t\t</div>
\t</footer>

\t<style>
\t\t.barra-social {
\t\t\tbackground: red;;
\t\t\tcolor: #fff;
\t\t\tdisplay: flex;
\t\t\tjustify-content: flex-end;
\t\t\tpadding-right: 0px;
\t\t\theight: 50px;
\t\t\tmargin-top: 2px;
\t\t}

\t\t.barra-social i.fa {
\t\t\tborder: 1px solid #fff;
\t\t\tborder-radius: 100%;
\t\t\tpadding: 7px;
\t\t\tpadding-right: 8px;
\t\t\tmargin: 10px 2px 10px 0;
\t\t\twidth: 30px;
\t\t\theight: 30px;
\t\t\tline-height: 1.1;
\t\t}

\t\t.search_box {
\t\t\tdisplay: flex !important;
\t\t\tjustify-content: space-between;
\t\t}
\t\t.icones.text-right a {
\t\t\tcolor: #fff;
\t\t}

\t\t.header-info {
\t\t\tmargin-right: -15px;
\t\t}

\t\ta.letras-ask.mt-4 {
\t\t\ttext-decoration: none;
\t\t\tposition: relative;
\t\t\ttop: 4px;
\t\t}


\t\t.icones-header {
\t\t\twidth: 23px;
\t\t\theight: 23px;
\t\t\tmargin: 10px;
\t\t}

\t\ta.letras-ask.mt-4:hover {
\t\t\tcolor: #00455b;
\t\t}

\t\tspan.info-contacto {
\t\t\tcolor: #fff;
\t\t}

\t\t.formSuimuladorPrivacidedosDados legend {
\t\t\tline-height: 0.5 !important;
\t\t}

\t\ta.info-contacto {
\t\t\tcolor: #00455b;
\t\t\ttext-decoration: none;
\t\t}

\t\t.letras-ask {
\t\t\tcolor: #00455b;
\t\t\tfont-weight: 600;
\t\t\tline-height: 1;
\t\t\tfont-size: 13px;
\t\t}

\t\t.ajuda {
\t\t\tmax-width: 12.666667%;
\t\t\ttext-align: center;
\t\t}

\t\ti.fa {
\t\t\tborder: 1px solid #fff;
\t\t\tborder-radius: 46%;
\t\t\tpadding: 5px;
\t\t\tmargin: 5px;
\t\t}

\t\t.fa-twitter:before {
\t\t\tcontent: \"\\f099\";
\t\t\tmargin-top: 9px;
\t\t\tpadding-top: 22px;
\t\t}

\t\t.fa-facebook-f:before,
\t\t.fa-facebook:before {
\t\t\tcontent: \"\\f09a\";
\t\t\tpadding-right: 2px;

\t\t}

\t\t.logo-principal {
\t\t\theight: 55px;
\t\t\twidth: 210px;

\t\t\tmargin-left: 15px;
\t\t\tmargin-bottom: 14px;
\t\t\tmargin-top: 5px;
\t\t}

\t\t.fundo-header {
\t\t\tbackground: red;
\t\t}

\t\th5.foot-1 {
\t\t\tcolor: #fff;
\t\t\tfont-weight: 500;
\t\t\tfont-size: 18px;
\t\t\tmargin-bottom: 22px;
\t\t\tmargin-top: 62px;
\t\t}

\t\th5.assine {
\t\t\tmargin-top: 50px;
\t\t\tcolor: #fff;
\t\t\tfont-size: 16px;
\t\t\tfont-weight: 500;
\t\t}

\t\tp.paragrafo-assine {
\t\t\tcolor: #fff9 !important;
\t\t\tfont-size: 10px !important;
\t\t\tjustify-items: left;
\t\t\tline-height: 2;
\t\t\tmargin-top: 22px;
\t\t\tfont-weight: normal;
\t\t}

\t\t.local-endereco {
\t\t\tfont-size: 10px;
\t\t\tline-height: 26px;
\t\t\tcolor: #fff9;
\t\t}

\t\tspan.localy {
\t\t\tcolor: #009bcc;
\t\t\tfont-weight: 500;
\t\t}

\t\t.region-footer-col-2 nav ul li a,
\t\t.region-footer-col-3 nav ul li a {
\t\t\tfont-size: 9.8pt !important;
\t\t}

\t\tul.menu {
\t\t\tmargin-top: -24px;

\t\t}

\t\t.region-footer-col-3 nav h2 {
\t\t\tdisplay: block;
\t\t\tfont-size: 18px !important;
\t\t\tfont-weight: 500;
\t\t}

\t\th2#block-produtos-menu {
\t\t\tmargin-top: 32px;
\t\t\tfont-size: 18px !important;
\t\t\tfont-weight: 500;
\t\t}

\t\th2#block-restrito-menu {
\t\t\tfont-size: 18px !important;
\t\t\tmargin-top: 62px;
\t\t\tfont-weight: 500;
\t\t\tmargin-left: 11px;
\t\t}

\t\th2#block-exploreosite-menu {
\t\t\tfont-size: 18px !important;
\t\t\tmargin-top: 32px;
\t\t\tfont-weight: 500;
\t\t\tmargin-left: -2px;
\t\t}

\t\t.menu-item {
\t\t\twidth: 200px;
\t\t\tfont-weight: 400;
\t\t}

\t\tli.menu-item a.is-active {
\t\t\tborder: none;
\t\t}

\t\th2#block-restrito-menu a.is-active {
\t\t\tcolor: #9a9b9d !important;
\t\t\tfont-size: 9.8pt !important;
\t\t}

\t\t.footer-content li a {
\t\t\tcolor: #9a9b9d !important;
\t\t\tfont-size: 13px !important;
\t\t\ttext-transform: capitalize !important;
\t\t}

\t\ta.mundiseg {
\t\t\ttext-decoration: none;
\t\t\tcolor: #009acb;
\t\t}

\t\t.col-md-4.pt-1.email {
\t\t\tpadding-top: 6px !important;
\t\t\tpadding: 0px;
\t\t}

\t\t.col-md-4.pt-1.phone {
\t\t\tpadding-top: 6px !important;
\t\t\tpadding: 0px;
\t\t\tmargin-left: 38px;
\t\t}

\t\th1.seguir {
\t\t\tmargin-top: 123px;
\t\t\tfont-size: 16px;
\t\t\tcolor: #fff;
\t\t\tfont-weight: 500;
\t\t\tmargin-left: 10px;
\t\t\twidth: 292px;
\t\t}

\t\t.baixe {
\t\t\tfont-size: 16px;
\t\t\tfont-weight: 500;
\t\t\tcolor: #fff;
\t\t\tmargin-top: 16px;
\t\t}

\t\tp.copyright {
\t\t\tmargin-top: 85px;
\t\t\tfont-size: 14px !important;
\t\t\tfont-weight: 500;
\t\t\tcolor: #9a9b9d !important;
\t\t\tmargin-left: 12px;
\t\t}

\t\tfooter {
\t\t\tfont-size: 16px;
\t\t}

\t\t.footer-social ul li a i {
\t\t\twidth: 30px;
\t\t\theight: 30px;
\t\t\tline-height: 1.1;
\t\t\tcolor: #fff;
\t\t\tborder: 2px solid #fff;
\t\t\tmargin: -4px;
\t\t\tmargin-top: 18px;
\t\t\tfont-size: 18px;
\t\t\tpadding: 4px;
\t\t\ttext-align: center;
\t\t\t-webkit-transition: 400ms;
\t\t\t-moz-transition: 400ms;
\t\t\t-o-transition: 400ms;
\t\t\ttransition: 400ms;
\t\t}

\t\t.footer-social {
\t\t\tmargin-left: 2px;
\t\t}

\t\t.footer-social ul {
\t\t\tlist-style: none;
\t\t\tmargin: -18px;
\t\t\tpadding: 0;
\t\t\tmargin-left: 55px;
\t\t\twidth: 288px;
\t\t}

\t\timg.icones-app-store {
\t\t\twidth: 180px;
\t\t\tmargin-left: 3px;
\t\t}

\t\t.icones-google-play {
\t\t\twidth: 184px;
\t\t\tmargin-top: 10px;
\t\t}

\t\t.col-lg-3.m-15px-tb.col-md-8 {
\t\t\tmargin-top: 0px;
\t\t}

\t\tul li i.fa {
\t\t\tfont-size: 22px;
\t\t}

\t\tspan.mundiseg {
\t\t\tcolor: #009bcc;
\t\t}

\t\t.form-outline input#email {
\t\t\tborder-radius: 4px;
\t\t\theight: 40px !important;
\t\t\tfont-size: 13px !important;
\t\t\twidth: 175px;
\t\t}

\t\tbutton.botao-enviar {
\t\t\theight: 40px;
\t\t\twidth: 85px;
\t\t\tmargin-top: -30px;
\t\t\tborder: none;
\t\t\tborder-radius: 3px;
\t\t\tcolor: #fff;
\t\t\tbackground: #009acb;
\t\t\tmargin-left: -11px;
\t\t}
\t\t.js-form-item.form-item.js-form-type-search.form-type-search.js-form-item-keys.form-item-keys.form-no-label {
\t\t\twidth: 100%;
\t\t}

\t\tbutton.enviar{
\t\t\twidth: 111px;
\t\t\tmargin-top: 8px;
\t\t\theight: 46px;
\t\t\tborder-radius: 3px 37px 33px 1px;
\t\t\tbackground-color: #023140 !important;
\t\t\tborder: none;
\t\t}
\t\tbutton.enviar:focus{
\t\t\toutline:none;
\t\t}
\t\tbutton.enviar:hover {
\t\t\tcolor: #fff;
\t\t\tfont-weight: 500px !important;
\t\t}
\t\tspan.d-flex.justify-content-end.text-white {
\t\t\tmargin-right: 107px;
\t\t\tmargin-top: 9px;
\t\t\tfont-weight: lighter;
\t\t\tfont-size: 12px;
\t\t}

\t\t.single-item.col-3 :active :hover {
\t\t\tbackground-color: #009bcc;
\t\t}

\t\t.navbar-white .navbar-nav .nav-link {
\t\t\tcolor: #fff !important;
\t\t\tfont-weight: 500;
\t\t}

\t\t@media(min-width:0px) and (max-width: 767.99px) {
\t\t\t.barra-social {
\t\t\t\tdisplay: none;
\t\t\t}
\t\t\t.footer-social {
\t\t\t\tmargin-top: -6rem;
\t\t\t}
\t\t\t.footer-social ul{
\t\t\t\tmargin-left: auto;
\t\t\t}
\t\t\t.col-lg-4.col-md-6.m-15.px-tb.col-sm-12{
\t\t\t\tmargin-top: -3rem;
\t\t\t}
\t\t\t.header-info {
\t\t\t\tdisplay: none;
\t\t\t}
\t\t\t.icones.text-center {
\t\t\t\tmargin-left: 50px;
\t\t\t}

\t\t\tspan.localy {
\t\t\t\tfont-size: 15px;
\t\t\t}

\t\t\tfooter.footer {
\t\t\t\tpadding: 5px;
\t\t\t}

\t\t\t.local-endereco {
\t\t\t\tfont-size: 15px;
\t\t\t\tfont-weight: 500;
\t\t\t}

\t\t\t.letras-ask {
\t\t\t\tmargin: 3px;
\t\t\t}

\t\t\t.icones-header-ask {
\t\t\t\tmargin-left: -169px;
\t\t\t\tmargin-top: 0px;
\t\t\t}
\t\t\tnav#block-restrito ul {
\t\t\t\tmargin-left: 0rem;
\t\t\t}
\t\t\th2#block-produtos-menu {
\t\t\t\tfont-size: 18px !important;
\t\t\t\tmargin-left: -4px;
\t\t\t}

\t\t\t.ajuda {
\t\t\t\tmax-width: 100.666667%;
\t\t\t\theight: 44px;
\t\t\t\tpadding: 5px;
\t\t\t\ttext-align: center;
\t\t\t}
\t\t\t.single-item.col-md-3 {

\t\t\t\tmax-width: 300px;
\t\t\t}

\t\t\tinput[type=\"text\"] {
\t\t\t\tfont-size: 15px !important;
\t\t\t\theight: 42px !important;
\t\t\t}

\t\t\t.footer-section {
\t\t\t\tpadding: 0px;
\t\t\t}

\t\t\t.region-footer-col-2 nav ul li a,
\t\t\t.region-footer-col-3 nav ul li a {
\t\t\t\tfont-size: 11.8pt !important;
\t\t\t}

\t\t\tp.paragrafo-assine {
\t\t\t\tfont-size: 15px !important;
\t\t\t}

\t\t\th2#block-restrito-menu {
\t\t\t\tmargin-top: -0.4rem;
\t\t\t\tmargin-left: -10px;
\t\t\t}

\t\t\th2#block-exploreosite-menu {
\t\t\t\tmargin-left: -2px;
\t\t\t}

\t\t\th5.assine {
\t\t\t\tfont-size: 18px;
\t\t\t}

\t\t\th1.seguir {
\t\t\t\tfont-size: 16px;
\t\t\t\tcolor: #fff;
\t\t\t\tfont-weight: 500;
\t\t\t\twidth: 250px;
\t\t\t\tmargin-left: auto;
\t\t\t\tmargin-right: auto;
\t\t\t\twidth: 250px;
\t\t\t}

\t\t\t.baixe {
\t\t\t\tfont-size: 18px;
\t\t\t}

\t\t\tp.copyright {
\t\t\t\tmargin-top: 28px;
\t\t\t\tfont-size: 16px !important;
\t\t\t}
\t\t\t.footer-content li a {
\t\t\t\tfont-size: 16px !important;
\t\t\t}
\t\t}

\t\t@media (min-width: 768px) and (max-width: 1024px) {
\t\t\th2#block-restrito-menu {
\t\t\t\tmargin-left: -40px;
\t\t\t}
\t\t\tnav#block-restrito ul {
\t\t\t\tmargin-left: -40px;
\t\t\t}
\t\t\tspan.info-contacto.mt-2 {
\t\t\t\tfont-size: 13px !important;
\t\t\t}

\t\t\t.region-footer-col-3 {
\t\t\t\tmargin-left: 60px !important;
\t\t\t}

\t\t\t.col-md-3 nav ul li a {
\t\t\t\tfont-size: 10.8pt !important;
\t\t\t}


\t\t\ti.fa.fa-search.pr-1 {
\t\t\t\tmargin-left: 44rem !important;
\t\t\t}

\t\t\t.barra-social {
\t\t\t\tdisplay: none;
\t\t\t}

\t\t\t.header-info {
\t\t\t\tdisplay: none;
\t\t\t}

\t\t\t.region.region-footer-col-1 {
\t\t\t\tmargin-left: -26px;
\t\t\t\tmargin-top: -15rem !important;
\t\t\t}

\t\t\th1.seguir {
\t\t\t\tfont-size: 16px;
\t\t\t\tmargin-left: -59px;
\t\t\t\twidth: 300px;
\t\t\t}

\t\t\t.region-footer-col-2 nav ul,
\t\t\t.region-footer-col-3 nav ul {
\t\t\t\tmargin-left: -2px;
\t\t\t}

\t\t\t.footer-social ul {
\t\t\t\tmargin-left: -28px;
\t\t\t\twidth: 300px;
\t\t\t}

\t\t\tp.copyright {
\t\t\t\tfont-size: 18px !important;
\t\t\t}

\t\t\th5.assine {
\t\t\t\twidth: 300px;
\t\t\t}

\t\t\t.site-navigation .navbar-toggler {
\t\t\t\tmargin-top: -58px !important;
\t\t\t\tmargin-right: 40px !important;
\t\t\t}

\t\t\tp.paragrafo-assine {
\t\t\t\tfont-size: 12px !important;
\t\t\t}

\t\t\tinput[type=\"text\"] {
\t\t\t\theight: 42px !important;
\t\t\t}

\t\t\tbutton.botao-enviar {
\t\t\t\tmargin-top: -100px !important;
\t\t\t\tmargin-left: 142px !important;
\t\t\t}

\t\t\t.footer-section {
\t\t\t\tpadding: 40px;
\t\t\t}

\t\t\tul.menu {
\t\t\t\tmargin-left: -26px;
\t\t\t}

\t\t\t.logo-principal {
\t\t\t\tmargin-bottom: 14px;
\t\t\t}
\t\t}


\t\t@media(min-width:1025px) and (max-width:1366px) {
\t\t\tspan.info-contacto {
\t\t\t\tfont-size: 11px;
\t\t\t}

\t\t\t.owl-carousel .owl-item {
\t\t\t\tmargin-right: 0px !important;
\t\t\t}

\t\t\th1.field_texto_store {
\t\t\t\tfont-size: 35px;
\t\t\t}

\t\t\t#block-restrito ul.menu {
\t\t\t\tmargin-left: -41px !important;
\t\t\t}

\t\t\th5.field_subtexto_store {
\t\t\t\tfont-size: 20px;
\t\t\t}

\t\t\t.btn-slider a {
\t\t\t\tmargin-left: 0px !important;
\t\t\t}

\t\t\timg.icones-app-store {
\t\t\t\twidth: 88%;
\t\t\t}

\t\t\t.field_email_:before {
\t\t\t\ttop: 45px !important;
\t\t\t}
\t\t}

\t\t@media (min-width: 992px) and (max-width: 1199.98px) {
\t\t\timg.icones-app-store {
\t\t\t\twidth: 96%;
\t\t\t}

\t\t\t.region-footer-col-2 nav ul li a,
\t\t\t.region-footer-col-3 nav ul li a {
\t\t\t\tfont-size: 13.8pt !important;
\t\t\t}

\t\t\t.footer-content li a {
\t\t\t\tfont-size: 19px !important;
\t\t\t}

\t\t\th1.seguir {
\t\t\t\tmargin-top: 129px;
\t\t\t\twidth: 300px;
\t\t\t\tmargin-left: 19px;
\t\t\t}

\t\t\t.footer-social ul {
\t\t\t\twidth: 300px;
\t\t\t\tmargin-left: 42px;
\t\t\t}

\t\t\t.baixe {
\t\t\t\tmargin-top: 13px;
\t\t\t\twidth: 300px;
\t\t\t}

\t\t\t.fot-contacte-nos {
\t\t\t\tmargin-left: -18px;
\t\t\t}

\t\t\t.local-endereco {
\t\t\t\tfont-size: 13px;
\t\t\t\twidth: 191px !important;
\t\t\t}

\t\t\tp.copyright {
\t\t\t\tfont-size: 18px !important;
\t\t\t}

\t\t}

\t\t@media (max-width: 1440px) and (min-width: 900px) {
\t\t\tbutton.botao-enviar {
\t\t\t\tmargin-top: -100px;
\t\t\t\tmargin-left: 152px;
\t\t\t}
\t\t}

\t\t@media (max-width: 1680px) and (min-width: 1050px) {
\t\t\tbutton.botao-enviar {
\t\t\t\tmargin-top: -100px;
\t\t\t\tmargin-left: 171px;
\t\t\t}
\t\t}

\t\t@media (max-width: 1024px) and (min-width: 640px) {
\t\t\tbutton.botao-enviar {
\t\t\t\tmargin-top: -100px;
\t\t\t\tmargin-left: 152px;
\t\t\t}
\t\t}

\t\t@media (min-width: 667px) and (max-width: 768px) {
\t\t\t.container-fluid.fundo-header {
\t\t\t\tdisplay: none;
\t\t\t}

\t\t\tbutton.botao-enviar {
\t\t\t\tmargin-top: -29px;
\t\t\t\tmargin-left: -9px;
\t\t\t}
\t\t}

\t\t@media (min-width: 1024px) and (max-width: 1366px) {
\t\t\ti.fa.fa-search.pr-1 {
\t\t\t\tmargin-left: -3rem !important;
\t\t\t}

\t\t\th6.mt-3 {
\t\t\t\tfont-size: 22px;
\t\t\t}

\t\t\t.container-principais-noticias {
\t\t\t\tmin-height: 0px;
\t\t\t\tmargin-left: 0px;
\t\t\t\tmargin-right: 0px;
\t\t\t}

\t\t\th4.field_texto_color {
\t\t\t\tmargin-left: -80px;
\t\t\t}

\t\t\t.footer-content li a {
\t\t\t\tfont-size: 16px !important;
\t\t\t}

\t\t\t.footer-section {
\t\t\t\tpadding: 0px;
\t\t\t}

\t\t\th2#block-restrito-menu {
\t\t\t\tmargin-left: -42px;
\t\t\t\tmargin-top: 62px;
\t\t\t}

\t\t\t.region-footer-col-2 nav ul li a,
\t\t\t.region-footer-col-3 nav ul li a {
\t\t\t\tfont-size: 10.8pt !important;
\t\t\t}

\t\t\t.region.region-footer-col-1 {
\t\t\t\tmargin-left: 30px;
\t\t\t\tmargin-top: 0px !important;
\t\t\t}

\t\t\t.baixe {
\t\t\t\tfont-size: 15px;
\t\t\t}

\t\t\th1.seguir {
\t\t\t\tmargin-top: 152px;
\t\t\t\tmargin-left: -47px;
\t\t\t\tfont-size: 15px;
\t\t\t\twidth: 228px;
\t\t\t}

\t\t\t.region-footer-col-3 {
\t\t\t\tmargin-left: -3px !important;
\t\t\t\tmargin-top: 0px;
\t\t\t}

\t\t\t.footer-social ul {
\t\t\t\tmargin-left: -18px;
\t\t\t\twidth: 213px;
\t\t\t}

\t\t\t.local-endereco {
\t\t\t\tfont-size: 10px;
\t\t\t\twidth: 219px !important;
\t\t\t}

\t\t\th5.assine {
\t\t\t\tmargin-top: 35px;
\t\t\t\tfont-size: 15px;
\t\t\t}

\t\t\tul.menu {
\t\t\t\tmargin-left: -43px;
\t\t\t}

\t\t\t.middle-column .card-body .blog-box-content .post-title a {
\t\t\t\tfont-size: 14px !important;
\t\t\t}

\t\t\t.icones-google-play {
\t\t\t\twidth: 163px;

\t\t\t}

\t\t\tp.paragrafo-assine {
\t\t\t\tfont-weight: 100;
\t\t\t}

\t\t\timg.icones-app-store {
\t\t\t\twidth: 162px;
\t\t\t}
\t\t}

\t\t@media(min-width:280px) and (max-width:1320px){
\t\t\ti.fa.fa-search.pr-1 {
\t\t\t\tmargin-left: -3rem !important;
\t\t\t}

\t\t}
\t\t@media(min-width:1330px) and (max-width:1358px){
\t\t\ti.fa.fa-search.pr-1 {
\t\t\t\tmargin-left: -3rem !important;
\t\t\t}

\t\t}
\t\t@media(min-width:497px) and (max-width:1240px){
\t\t\ti.fa.fa-search.pr-1 {
\t\t\t\tmargin-left: -3rem !important;
\t\t\t}

\t\t}

\t</style>

";
    }

    public function getTemplateName()
    {
        return "themes/jp_temisto/templates/layout/page--front.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  200 => 131,  190 => 124,  182 => 119,  175 => 114,  150 => 90,  137 => 81,  127 => 74,  118 => 69,  115 => 68,  113 => 67,  103 => 60,  52 => 12,  39 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "themes/jp_temisto/templates/layout/page--front.html.twig", "C:\\xampp\\htdocs\\drupallll\\themes\\jp_temisto\\templates\\layout\\page--front.html.twig");
    }
    
    public function checkSecurity()
    {
        static $tags = array("set" => 67, "if" => 68);
        static $filters = array("trans" => 12, "escape" => 60, "render" => 68);
        static $functions = array("url" => 67);

        try {
            $this->sandbox->checkSecurity(
                ['set', 'if'],
                ['trans', 'escape', 'render'],
                ['url']
            );
        } catch (SecurityError $e) {
            $e->setSourceContext($this->source);

            if ($e instanceof SecurityNotAllowedTagError && isset($tags[$e->getTagName()])) {
                $e->setTemplateLine($tags[$e->getTagName()]);
            } elseif ($e instanceof SecurityNotAllowedFilterError && isset($filters[$e->getFilterName()])) {
                $e->setTemplateLine($filters[$e->getFilterName()]);
            } elseif ($e instanceof SecurityNotAllowedFunctionError && isset($functions[$e->getFunctionName()])) {
                $e->setTemplateLine($functions[$e->getFunctionName()]);
            }

            throw $e;
        }

    }
}
