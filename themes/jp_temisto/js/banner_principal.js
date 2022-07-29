var request_path = 'http://www31.sise.co.ao/webservices/WS0011_ConsultaEmissao.asmx';
var data = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sise="http://www.sise-portal.co.ao/">
   <soapenv:Header>
      <sise:WS_Autenticacao>
         <sise:login>PORTAL-SISE</sise:login>
         <sise:senha>S3s21MpS4fTp4Rt1l</sise:senha>
         <sise:sistema>PORTAL</sise:sistema>
         <sise:usuario_logado>PORTAL-SISE</sise:usuario_logado>
      </sise:WS_Autenticacao>
   </soapenv:Header>
   <soapenv:Body>
      <sise:Gravar_AgenteProdutor>
         <sise:request>
            <sise:AgenteProdutor>
               <sise:Pessoa>
                  <sise:numero_documento>246777579CA9461</sise:numero_documento>
                  <sise:tipo_documento>NIF</sise:tipo_documento>
                  <sise:tipo_pessoa>Singular</sise:tipo_pessoa>
                  <sise:nome_pessoa>JIMI HENDRIX</sise:nome_pessoa>
                  <sise:tipo_sexo>Masculino</sise:tipo_sexo>
                  <sise:data_nascimento>2000-01-01T00:00:00</sise:data_nascimento>
               </sise:Pessoa>
               <sise:Produtor>
                  <sise:codigo_tipo_papel_pessoa>Corretor</sise:codigo_tipo_papel_pessoa>
                  <sise:codigo_orgao_produtor>1000</sise:codigo_orgao_produtor>
                  <sise:codigo_registro_arseg>757</sise:codigo_registro_arseg>
                  <sise:tipo_sociedade_mediacao_corretagem>Mediacao_de_Seguro_Directo</sise:tipo_sociedade_mediacao_corretagem>
                  <sise:numero_certificado_mediacao_corretagem>757/ARSEG/15</sise:numero_certificado_mediacao_corretagem>
                  <sise:data_certificado_mediacao_corretagem>2017-01-01T00:00:00</sise:data_certificado_mediacao_corretagem>
                  <sise:tipo_meio_pagamento>Cheque</sise:tipo_meio_pagamento>
                  <sise:tipo_periodicidade_pagamento>Semanal</sise:tipo_periodicidade_pagamento>
               </sise:Produtor>
               <sise:Conta>
                  <sise:codigo_banco>0057</sise:codigo_banco>
                  <sise:codigo_agencia>4444</sise:codigo_agencia>
                  <sise:numero_conta>5555</sise:numero_conta>
                  <sise:digito_conta>5</sise:digito_conta>
                  <sise:tipo_conta>Conta_Corrente</sise:tipo_conta>
                  <sise:indicador_conta_debito>true</sise:indicador_conta_debito>
                  <sise:indicador_conta_credito>true</sise:indicador_conta_credito>
               </sise:Conta>
            </sise:AgenteProdutor>
         </sise:request>
      </sise:Gravar_AgenteProdutor>
   </soapenv:Body>
</soapenv:Envelope>
`;
var parser = new DOMParser()

const response = fetch(request_path, {
   mode: "no-cors", // same-origin, no-cors
  credentials: "include", // omit, include
   method: "POST",
   headers: {
      "Content-Type": "text/xml",
      "Accept": "text/xml"
   },
   body: data,
  
});

response.then(response => response.json())
  .then(str => {
        console.log(str);
  })
  


