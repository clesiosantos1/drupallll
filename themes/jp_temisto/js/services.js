//cilindradas
const cilindradas = [];
let premios = []; 
const premio = [];
let ptp = "";

const $textCobertura = document.querySelector("[for=edit-ambito-de-categoria-de-cobertura]")
const $textPremio = document.querySelector("[for=edit-periodo-de-cobertura-maximo-12-meses]")

function criarSelect(id, $append){
    $select = document.createElement("select")
    $select.setAttribute("id", id)
    $select.setAttribute('class', 'form-control')

    $append.append( $select);
}

try {

    criarSelect('select_categoria', $textCobertura);
    criarSelect('select_cilindrada', $textCobertura);
    criarSelect('select_premios', $textPremio);

    
} catch (error) {
    console.log(error);
}
//Selects
const $editselecioneCategoria = document.querySelector("#select_categoria")
const $editSelecioneCilindrada = document.querySelector("#select_cilindrada")
const $editSelecionePremios = document.querySelector("#select_premios")
const $editValorApolice = document.querySelector(".valor-apolice")
const $editCategoraCode = document.querySelector(".categora-code")
const $editTipoPremio = document.querySelector(".tipo-premio")
const $editCampoCilindrada = document.querySelector(".campo-cilindrada")

let $cor = document.querySelector("div#edit-container-04")
 
const submit = document.querySelector(".js_simular_solicitar_proposta_categoria")
console.log(submit);
try{
    $editselecioneCategoria.innerHTML = "";
    $editSelecioneCilindrada.innerHTML = "";
    $editSelecionePremios.innerHTML = "";

    createOption($editselecioneCategoria, "Seleccione", "")
    createOption($editSelecioneCilindrada, "Seleccione", "")
    createOption($editSelecionePremios, "Seleccione", "")
}catch(e){
    console.log(e);
}

const servicos =[
    {
        categoria: "lp", nome: "Ligeiro Particular",  cilindradas: [
            {
                cilindrada:"Até 1.500 CC", premio: [
                    {plano: "anual", valor: "32.007,1"},
                    {plano: "semestral", valor: "24.166,42"},
                    {plano: "trimestral", valor: "12.083,21"},
                ]
            }, 
            {
                cilindrada:"De 1501 CC Até 2.500 CC", premio: [
                    {plano: "anual", valor: "39.671,95"},
                    {plano: "semestral", valor: "29.953,64"},
                    {plano: "trimestral", valor: "14.976,82"},
                ]
            },

            {
                cilindrada:"Acima De 2.500 CC", premio: [
                    {plano: "anual", valor: "41.609,22"},
                    {plano: "semestral", valor: "31.416,34"},
                    {plano: "trimestral", valor: "15.708,17"},
                ]
            }

        
        ] 
    },

    {
        categoria: "lpa", 
        nome: "Ligeiro Particular Até 9 Lugares", 
        cilindradas: [
            {
                cilindrada:"Até 1.500 CC", premio: [
                    {plano: "anual", valor: "53.738,23"},
                    {plano: "semestral", valor: "40.574,15"},
                    {plano: "trimestral", valor: "20.287,07"},
                ]
            },

            {
                cilindrada:"De 1501 Até 2.500 CC", premio: [
                    {plano: "anual", valor: "58.876,21"},
                    {plano: "semestral", valor: "44.453,49"},
                    {plano: "trimestral", valor: "22.226,75"},
                ]
            },
            {
                cilindrada:"Acima De 2.500 CC", premio: [
                    {plano: "anual", valor: "64.014,19"},
                    {plano: "semestral", valor: "48.332,84"},
                    {plano: "trimestral", valor: "24.166,42"},
                ]
            },

        ]
    },
    {
        categoria: "lm", 
        nome: "Ligeiro Misto DE 650 KG ATÉ  1.100 KG", 
        cilindradas: [
            {
                cilindrada:"Até 1.500 CC", premio: [
                    {plano: "anual", valor: "44.809,93"},
                    {plano: "semestral", valor: "40.574,15"},
                    {plano: "trimestral", valor: "20.287,07"},
                ]
            },

            {
                cilindrada:"De 1501 Até 2.500 CC", premio: [
                    {plano: "anual", valor: "58.876,21"},
                    {plano: "semestral", valor: "44.453,49"},
                    {plano: "trimestral", valor: "22.226,75"},
                ]
            },
            {
                cilindrada:"Acima De 2.500 CC", premio: [
                    {plano: "anual", valor: "64.014,19"},
                    {plano: "semestral", valor: "48.332,84"},
                    {plano: "trimestral", valor: "24.166,42"},
                ]
            },

        ]
    },
    {
        categoria: "cpa", 
        nome: "Camioneta Particular ATÉ 3.600 KG PB", 
        cilindradas: [
            {
                cilindrada:"Até 1.500 CC", premio: [
                    {plano: "anual", valor: "64.014,19"},
                    {plano: "semestral", valor: "48.332,84"},
                    {plano: "trimestral", valor: "24.166,42"},
                ]
            },

            {
                cilindrada:"De 1501 Até 2.500 CC", premio: [
                    {plano: "anual", valor: "76.143,2"},
                    {plano: "semestral", valor: "57.490,64"},
                    {plano: "trimestral", valor: "28.745,32"},
                ]
            },
            {
                cilindrada:"Acima De 2.500 CC", premio: [
                    {plano: "anual", valor: "89.619.87"},
                    {plano: "semestral", valor: "67.665,97"},
                    {plano: "trimestral", valor: "33.832,99"},
                ]
            },
/*             {
                cilindrada:"Até 1.500 CC", premio: [
                    {plano: "anual", valor: "67.214,9"},
                    {plano: "semestral", valor: "50.749,48"},
                    {plano: "trimestral", valor: "25.374,74"},
                ]
            },
            {
                cilindrada:"De 1.501 Até 2.500 CC", premio: [
                    {plano: "anual", valor: "80.691,57"},
                    {plano: "semestral", valor: "60.924,81"},
                    {plano: "trimestral", valor: "30.462,41"},
                ]
            }, 
            {
                cilindrada:"Acima De 2.500 CC", premio: [
                    {plano: "anual", valor: "91.557,14"},
                    {plano: "semestral", valor: "60.128,68"},
                    {plano: "trimestral", valor: "34.564,34"},
                ]
            },  */

        ]
    },
    {
        categoria: "cp", 
        nome: "Camião Particular", 
        cilindradas: [
            {
                cilindrada:"Até 10.000 KG PB Até 1.500 CC", premio: [
                    {plano: "anual", valor: "44.809,93"},
                    {plano: "semestral", valor: "40.574,15"},
                    {plano: "trimestral", valor: "20.287,07"},
                ]
            },

            {
                cilindrada:"Até 10.000 KG PB Acima De 1.500 CC", premio: [
                    {plano: "anual", valor: "58.876,21"},
                    {plano: "semestral", valor: "44.453,49"},
                    {plano: "trimestral", valor: "22.226,75"},
                ]
            },
            {
                cilindrada:"Acima De 10.000 KG PB Até 1.500 CC", premio: [
                    {plano: "anual", valor: "64.014,19"},
                    {plano: "semestral", valor: "48.332,84"},
                    {plano: "trimestral", valor: "24.166,42"},
                ]
            },
            {
                cilindrada:"Acima De 10.000 KG PB Acima De 1.500 CC", premio: [
                    {plano: "anual", valor: "64.014,19"},
                    {plano: "semestral", valor: "48.332,84"},
                    {plano: "trimestral", valor: "24.166,42"},
                ]
            }
            

        ]
    },

    {
        categoria: "ca", 
        nome: "Camião Aluguer", 
        cilindradas: [
            {
                cilindrada:"Até 1.500 CC", premio: [
                    {plano: "anual", valor: "44.809,93"},
                    {plano: "semestral", valor: "40.574,15"},
                    {plano: "trimestral", valor: "20.287,07"},
                ]
            },

            {
                cilindrada:"De 1501 Até 2.500 CC", premio: [
                    {plano: "anual", valor: "58.876,21"},
                    {plano: "semestral", valor: "44.453,49"},
                    {plano: "trimestral", valor: "22.226,75"},
                ]
            },
            {
                cilindrada:"Acima De 2.500 CC", premio: [
                    {plano: "anual", valor: "64.014,19"},
                    {plano: "semestral", valor: "48.332,84"},
                    {plano: "trimestral", valor: "24.166,42"},
                ]
            }          
        ]
    },
    {
        categoria: "ap", 
        nome: "Autocarros  Particular", 
        cilindradas: [
            {
                cilindrada:"Até 1.500 CC", premio: [
                    {plano: "anual", valor: "44.809.93"},
                    {plano: "semestral", valor: "40.574,15"},
                    {plano: "trimestral", valor: "20.287,07"},
                ]
            },

            {
                cilindrada:"Acima De 2.500 CC", premio: [
                    {plano: "anual", valor: "64.014,19"},
                    {plano: "semestral", valor: "48.332,84"},
                    {plano: "trimestral", valor: "24.166,42"},
                ]
            },               
        ]
    },
    {
        categoria: "tuc", 
        nome: "Taxi de Uso Colectivo  até 9 lugares ( Azul e Branco)", 
        cilindradas: [
            {
                cilindrada:"Até 1.500 CC", premio: [
                    {plano: "anual", valor: "44.809,93"},
                    {plano: "semestral", valor: "40.574,15"},
                    {plano: "trimestral", valor: "20.287,07"},
                ]
            },

            {
                cilindrada:"De 1501 Até 2.500 CC", premio: [
                    {plano: "anual", valor: "58.876,21"},
                    {plano: "semestral", valor: "44.453,49"},
                    {plano: "trimestral", valor: "22.226,75"},
                ]
            },  
            {
                cilindrada:"Acima De 2.500 CC", premio: [
                    {plano: "anual", valor: "64.014,19"},
                    {plano: "semestral", valor: "48.332,84"},
                    {plano: "trimestral", valor: "24.166,42"},
                ]
            }                
        ]
    },
    {
        categoria: "ar", 
        nome: "Atrelado/Reboques", 
        cilindradas: [
            {
                cilindrada:"Até 1.500 CC", premio: [
                    {plano: "anual", valor: "44.809,93"},
                    {plano: "semestral", valor: "40.574,15"},
                    {plano: "trimestral", valor: "20.287,07"},
                ]
            },

            {
                cilindrada:"De 1501 Até 2.500 CC", premio: [
                    {plano: "anual", valor: "58.876,21"},
                    {plano: "semestral", valor: "44.453,49"},
                    {plano: "trimestral", valor: "22.226,75"},
                ]
            },  
            {
                cilindrada:"Acima De 2.500 CC", premio: [
                    {plano: "anual", valor: "64.014,19"},
                    {plano: "semestral", valor: "48.332,84"},
                    {plano: "trimestral", valor: "24.166,42"},
                ]
            }                
        ]
    },
    {
        categoria: "m", 
        nome: "Motociclo", 
        cilindradas: [
            {
                cilindrada:"Até 1.500 CC", premio: [
                    {plano: "anual", valor: "44.809,93"},
                    {plano: "semestral", valor: "40.574,15"},
                    {plano: "trimestral", valor: "20.287,07"},
                ]
            },

            {
                cilindrada:"De 1501 Até 2.500 CC", premio: [
                    {plano: "anual", valor: "58.876,21"},
                    {plano: "semestral", valor: "44.453,49"},
                    {plano: "trimestral", valor: "22.226,75"},
                ]
            },  
            {
                cilindrada:"Acima De 2.500 CC", premio: [
                    {plano: "anual", valor: "64.014,19"},
                    {plano: "semestral", valor: "48.332,84"},
                    {plano: "trimestral", valor: "24.166,42"},
                ]
            }                
        ]
    }


]

function createOption($el, text, value){
    //$el.innerHTML = "";
    const $option = document.createElement("option");
    $option.innerText = text;
    $option.setAttribute("value", value) 
    $el.appendChild($option);

}

// polular input das categorias
try {

    const categorias = servicos.map( servico => {
        createOption($editselecioneCategoria, servico["nome"], servico["categoria"])
    })
    
} catch (error) {
    
}


function carregaCilindradas(categoria){
    console.log(categoria);
    servicos.forEach(servico => {
        if(servico.categoria == categoria){
            servico.cilindradas.map(c => {
                cilindradas.push(c)
                createOption($editSelecioneCilindrada, c.cilindrada, c.cilindrada)
            })
        }

    })
}

function carregaPremios(cilindrada){

    cilindradas.forEach(_c => {
        if(_c.cilindrada == cilindrada){
            premios.push(_c.premio)
            _c.premio.forEach(p => createOption($editSelecionePremios, p.plano, p.valor))
        }
    })

}

function calculaPremioService(plano){
    $editSelecionePremios.querySelectorAll("option").forEach(op => {
        if(op.value == plano)
        {
            ptp = op.textContent  
        }
    })

    premios[0].forEach(_p => {
        if(_p.plano == plano)
        {
            premio.push({plano: _p.plano, valor: _p.valor});
            
        }

    }); 
}

try{
    $editselecioneCategoria.addEventListener("change", function(e){
        $editSelecioneCilindrada.innerHTML = "";
        $editSelecionePremios.innerHTML = "";
        createOption($editSelecioneCilindrada, "Seleccione", "")
        createOption($editSelecionePremios, "Seleccione", "")
        carregaCilindradas(e.target.value)
    })
    
    $editSelecioneCilindrada.addEventListener("change", function(e){
        $editSelecionePremios.innerHTML = "";
        createOption($editSelecionePremios, "Seleccione", "")
        carregaPremios(e.target.value)
    })
    
    $editSelecionePremios.addEventListener("change", function(e){
        calculaPremioService(e.target.value);
    })

}catch(e){

}
function createPremio($el, val){
    const el = document.createElement("div")
    el.innerText = val
    $el.append(val)
}

function getPremioServico(){

    $selecioneCategoria = document.querySelector('#edit-selecionecategoria');
    $selecioneCilindrada = document.querySelector('#edit-cilindrada-');
    $selecionePremio = document.querySelector('#edit-premio');

    $cor.innerHTML =`
    <div class="d-flex justify-content-around align-items-center inside" >
        <div>
            <label class="text-center text-white"><strong>Categoria/Code</strong></label>
            <p class="text-white text-center">${$editselecioneCategoria.value.toUpperCase()}</p>
        </div>
        <div class="d-flex justify-content-around flex-column">
            <label class="text-center text-white"><strong>Cilindrada:</strong></label>
            <p class="text-white text-center">${$editSelecioneCilindrada.value}</p>
        </div>
        <div>
            <label class="text-center text-white"><strong>Tipo de Premio</strong></label>
            <p class="text-white text-center">${ptp.toUpperCase()}</p>
        </div>
    </div>
    <div class="d-flex justify-content-around align-items-center inside" >
        <div>
            <label class="text-center text-white"><strong class="h3">Valor da apólice</strong></label>
            <p class="text-white text-center h3">${$editSelecionePremios.value}</p>
        </div>
    </div>
    `;

    $selecioneCategoria.value = $editselecioneCategoria.value.toUpperCase();
    $selecioneCilindrada.value = ptp.toUpperCase();
    $selecionePremio.value = $editSelecionePremios.value;
}

submit.addEventListener("click", function(e){
    e.preventDefault()
    getPremioServico()

})


