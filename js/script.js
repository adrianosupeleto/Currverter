const apiKey = '456898f9a9d327b5b4e07aba';
const currencyList = document.querySelectorAll(".currency-list select"),
primaryCurrency = document.querySelector(".primary-currency select"),
secundaryCurrency = document.querySelector(".secundary-currency select"),
getButton = document.querySelector("form button");

for(let i = 0; i < currencyList.length; i++) {
    for(currencyCode in country_list){
        //padronizando Dólar e Real selecionado
        let selected;
        if(i ==0){
            selected = currencyCode == "USD" ? "selected" : "";
        }else if(i == 1){
            selected = currencyCode == "BRL" ? "selected" : "";
        }

        //criando um 'option' passando o codigo e value (semelhante ao php e mysql)
        let optionTag = `<option value="${currencyCode}" ${selected}>${currencyCode}</option>`;

        //inserindo tag 'option' dentro da tag 'select'
        currencyList[i].insertAdjacentHTML("beforeend",optionTag);

        currencyList[i].addEventListener("change", e =>{
            trocarBandeira(e.target);
        });

    }   
}
//carregar bandeira de acordo com a moeda selecionada
function trocarBandeira(element){
    for(let regiao in country_list){
        if(regiao == element.value){
            let novaBandeira = element.parentElement.querySelector("img");
            novaBandeira.src = `https://flagcdn.com/48x36/${country_list[regiao].toLowerCase()}.png`;
        }
    }
}

window.addEventListener("load", ()=>{
    valorConvertido();
});

getButton.addEventListener("click", e =>{
    valorConvertido();
});

//define a 'seta de troca'
const setaConversao = document.querySelector("form .icon");

//trocar a taxa de cambio na ordem inversa de moedas
setaConversao.addEventListener("click", ()=>{
    let moedaAux = primaryCurrency.value;
    primaryCurrency.value = secundaryCurrency.value;
    secundaryCurrency.value = moedaAux;
    trocarBandeira(primaryCurrency);
    trocarBandeira(secundaryCurrency);
    valorConvertido();
})

function valorConvertido(){
    //recebendo a quantia da moeda primaria para conversao e salvano seu valor
    const quantia = document.querySelector(".currency-value input");
    let valorQuantia = quantia.value;

    //recebendo a mensagem da conversão final
    const valorConvertidoTxt = document.querySelector("form .currency-conversion");
    valorConvertidoTxt.innerText = "Convertendo...";

    if(valorQuantia <= 0){
        valorConvertidoTxt.innerText = "Valor inválido...";
        return;
    }
    
    let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${primaryCurrency.value}`;

    fetch(url).then(response => response.json()).then(result =>{
        //recebendo da api o valor para a conversão da moeda primaria
        let cambio = result.conversion_rates[secundaryCurrency.value];

        //realizando a conversao e fixando o valor para 2 casas
        let totalConvertido = (valorQuantia * cambio).toFixed(2);

        //Exibindo ao usuario o resultado da conversão
        valorConvertidoTxt.innerText = `${valorQuantia} ${primaryCurrency.value} = ${totalConvertido} ${secundaryCurrency.value}`;

    //porém se algo deu errado com a api ou valor inserido
    }).catch(() =>{
        valorConvertidoTxt.innerText = "Infelizmente a conversão falhou...Tente novamente!";
    });
}