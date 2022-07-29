const periodos = []
let plano = 0;

const $textSelect = document.querySelector("[for=edit-periodo-de-cobertura-maximo-92-dias-consecutivos-por-viagem]")
const $textSelecioneCober = document.querySelector("[for=edit-ambito-geografico-de-cobertura]")

try {
    function criarSelect(id, $append){
        $select = document.createElement("select")
        $select.setAttribute("id", id)
        $select.setAttribute('class', 'form-control')
    
        $append.append( $select);
    }
    
    
    criarSelect('select', $textSelect);
    criarSelect('selecione_cober', $textSelecioneCober);
    
    
} catch (error) {
    console.log(error);
}
//Selects
const $editSelecione = document.querySelector("#select")
const $editSelecioneCober = document.querySelector("#selecione_cober")




$core = document.querySelector("div#edit-container-04")
$submitPeriodo = document.querySelector(".js_simular_solicitar_periodo")

const servicosPeriodo =[
    {
        periodo: "1 a 7 Dias",  planos: [
            {
                plano:"EUROPA", valor: "7.978,18"
            },
            {
                plano:"EUROPA BÁSICO", valor: "6.426,86"
            },
            {
                plano:"MUNDIAL TRAVELLER", valor: "14.848,27"
            },
            {
                plano:"MUNDIAL PEARL", valor: "11.856,46"
            },
            {
                plano:"ÁFRICA", valor: "6.260,65"
            },
            {
                plano:"ZONA I", valor: ""
            },
            {
                plano:"ZONA II", valor: ""
            },
        ],
    },

    {

        periodo: "8 a 10 Dias",  planos: [
            {
                plano:"EUROPA", valor: "9.418,68"
            },
            {
                plano:"EUROPA BÁSICO", valor: "7.590,35"
            },
            {
                plano:"MUNDIAL TRAVELLER", valor: "19.945,44"
            },
            {
                plano:"MUNDIAL PEARL", valor: "19.945,44"
            },
            {
                plano:"ÁFRICA", valor: "8.864,64"
            },
            {
                plano:"ZONA I", valor: ""
            },
            {
                plano:"ZONA II", valor: ""
            },
        ]
    },
    {
        periodo: "11 a 15 Dias",  planos: [
            {
                plano:"EUROPA", valor: "12.078,07"
            },
            {
                plano:"EUROPA BÁSICO", valor: "9.695,7"
            },
            {
                plano:"MUNDIAL TRAVELLER", valor: "21.053,52"
            },
            {
                plano:"MUNDIAL PEARL", valor: "16.953,62"
            },
            {
                plano:"ÁFRICA", valor: "12.742,92"
            },
            {
                plano:"ZONA I", valor: ""
            },
            {
                plano:"ZONA II", valor: ""
            },
        ]
    },

    {
        periodo: "16 a 21 Dias",  planos: [
            {
                plano:"EUROPA", valor: "17.175,24"
            },
            {
                plano:"EUROPA BÁSICO", valor: "13.740,19"
            },
            {
                plano:"MUNDIAL TRAVELLER", valor: "33.796,44"
            },
            {
                plano:"MUNDIAL PEARL", valor: "27.147,96"
            },
            {
                plano:"ÁFRICA", valor: "15.734,74"
            },
            {
                plano:"ZONA I", valor: ""
            },
            {
                plano:"ZONA II", valor: ""
            },
        ]
    },
    {
        periodo: "22 a 30 Dias",  planos: [
            {
                plano:"EUROPA", valor: "25.929,07"
            },
            {
                plano:"EUROPA BÁSICO", valor: "20.721,1"
            },
            {
                plano:"MUNDIAL TRAVELLER", valor: "52.079,76"
            },
            {
                plano:"MUNDIAL PEARL", valor: "41.774,62"
            },
            {
                plano:"ÁFRICA", valor: "19.280,59"
            },
            {
                plano:"ZONA I", valor: ""
            },
            {
                plano:"ZONA II", valor: ""
            },
        ]
    },
    {
        periodo: "31 a 60 Dias",  planos: [
            {
                plano:"EUROPA", valor: "43.215,12"
            },
            {
                plano:"EUROPA BÁSICO", valor: "34.82,9"
            },
            {
                plano:"MUNDIAL TRAVELLER", valor: "89.532,86"
            },
            {
                plano:"MUNDIAL PEARL", valor: "71.692,78"
            },
            {
                plano:"ÁFRICA", valor: "33.796,44"
            },
            {
                plano:"ZONA I", valor: ""
            },
            {
                plano:"ZONA II", valor: ""
            },
        ]
    },
    {
        periodo: "61 a 90 Dias",  planos: [
            {
                plano:"EUROPA", valor: "53.963,5"
            },
            {
                plano:"EUROPA BÁSICO", valor: "43.159,72"
            },
            {
                plano:"MUNDIAL TRAVELLER", valor: "10.3051,44"
            },
            {
                plano:"MUNDIAL PEARL", valor: "82.551,96"
            },
            {
                plano:"ÁFRICA", valor: "45.985,32"
            },
            {
                plano:"ZONA I", valor: ""
            },
            {
                plano:"ZONA II", valor: ""
            },
        ]
    },

    {
        periodo: "91 a 180 Dias",  planos: [
            {
                plano:"EUROPA", valor: "64.745,11"
            },
            {
                plano:"EUROPA BÁSICO", valor: "51.802,74"
            },
            {
                plano:"MUNDIAL TRAVELLER", valor: "13.9618,08"
            },
            {
                plano:"MUNDIAL PEARL", valor: "111.583,66"
            },
            {
                plano:"ÁFRICA", valor: "70.473,89"
            },
            {
                plano:"ZONA I", valor: ""
            },
            {
                plano:"ZONA II", valor: ""
            },
        ]
    },
    {
        periodo: "Multiplas Viagens Anuais",  planos: [
            {
                plano:"EUROPA", valor: "96.957,00"
            },
            {
                plano:"EUROPA BÁSICO", valor: "77.621,00"
            },
            {
                plano:"MUNDIAL TRAVELLER", valor: "185.603,40"
            },
            {
                plano:"MUNDIAL PEARL", valor: "148.482,72"
            },
            {
                plano:"ÁFRICA", valor: "84.214,08"
            },
            {
                plano:"ZONA I", valor: ""
            },
            {
                plano:"ZONA II", valor: ""
            },
        ]
    },
    {
        periodo: "6 Meses > 180 dias Seguidos",  planos: [
            {
                plano:"EUROPA", valor: ""
            },
            {
                plano:"EUROPA BÁSICO", valor: ""
            },
            {
                plano:"MUNDIAL TRAVELLER", valor: ""
            },
            {
                plano:"MUNDIAL PEARL", valor: ""
            },
            {
                plano:"ÁFRICA", valor: ""
            },
            {
                plano:"ZONA I", valor: "327.638,82"
            },
            {
                plano:"ZONA II", valor: "351.466,31"
            },
        ]
    },

    {  
        periodo: "1 ano > 365 dias Seguidos",  planos: [
            {
                plano:"EUROPA", valor: ""
            },
            {
                plano:"EUROPA BÁSICO", valor: ""
            },
            {
                plano:"MUNDIAL TRAVELLER", valor: ""
            },
            {
                plano:"MUNDIAL PEARL", valor: ""
            },
            {
                plano:"ÁFRICA", valor: ""
            },
            {
                plano:"ZONA I", valor: "52.4215,66"
            },
            {
                plano:"ZONA II", valor: "56.3928,15"
            },
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
try {
    /* $textSelecioneCober.setAttribute('class', 'col-md-6') */
    createOption($editSelecione, "Seleccione", "")
    servicosPeriodo.forEach((e) => {
        createOption($editSelecione, e.periodo, e.periodo);
    });

    
} catch (error) {
    console.log(error);
}

try {

    function carregacobertura(periodo){
        console.log(periodo);
        servicosPeriodo.forEach(servico =>{
            if(servico.periodo == periodo ){
                servico.planos.map(c =>{
                    createOption($editSelecioneCober, c.plano, c.plano)
                })
            }
        })
    
    }
    $editSelecione.addEventListener("change", function(e){
        $editSelecioneCober.innerHTML = "";
        createOption($editSelecioneCober, "Seleccione", "")
        carregacobertura(e.target.value)
    })
    
} catch (error) {
    console.log(error);
}

function getPremio(){
    $core.innerHTML =`
    <div class="d-flex justify-content-around align-items-center inside" >
        <div>
            <label class="text-center text-white mt-3"><strong>Período</strong></label>
            <p class="text-white text-center">${$editSelecione.value.toUpperCase()}</p>
        </div>
        <div class="d-flex justify-content-around flex-column">
            <label class="text-center text-white mt-3"><strong>Plano/Cobetura:</strong></label>
            <p class="text-white text-center">${$editSelecioneCober.value.toUpperCase()}</p>
        </div>
    </div>
    <div class="d-flex justify-content-around align-items-center inside">
           <div>
            <label class="text-center text-white mt-2"><strong class="h4">Valor da apólice</strong></label>
            <p class="text-white text-center h4 ">${plano}</p>
            </div>
    </div>

    `;
}

function calculaPremio(c, p){

    servicosPeriodo.forEach(s => {
        if(s.periodo == c){
            s.planos.forEach( pl => {

                if(pl.plano == p)
                 plano = pl.valor
                
            });
        }
    })

}

try {
    $submitPeriodo.addEventListener("click", function(e){
        e.preventDefault()
        calculaPremio($editSelecione.value,$editSelecioneCober.value)
    
        const $periodo1 = document.querySelector("#edit-ambitoperiodo")
        $periodo1.value = $editSelecione.value.toUpperCase();
        const $periodo2 = document.querySelector("#edit-periodo")
        $periodo2.value = $editSelecioneCober.value.toUpperCase()
        const $premioplano = document.querySelector("#edit-premioplano")
        $premioplano.value = plano
    
        getPremio()
    })
    
    
} catch (error) {
    console.log(error);
}