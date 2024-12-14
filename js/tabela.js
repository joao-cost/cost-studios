const corpoTabela = document.querySelector('#dados');

const lerDados = async () => {
    
    const resultado = await fetch('https://crm-trabalhoidw3-default-rtdb.firebaseio.com/clientes.json', {
        method: 'GET',
    });

    if(resultado.ok){
        corpoTabela.innerHTML = '';

        const dados = await resultado.json();
  
        for(let id in dados){
            const tr = document.createElement('tr');
            const clientes = dados[id];

            tr.innerHTML = `<td>${clientes.nome_empresa}</td><td>${clientes.nome_proprietario}</td><td>${clientes.telefone}</td><td>${clientes.email}</td>`;

            tr.innerHTML += `<td><button onclick="editar('${id}')">Editar</button>
            <button onclick="excluir('${id}')">Excluir</button></td>`;

            corpoTabela.appendChild(tr);
        }
    }
}

lerDados();

const excluir = async (id) => {
    const resultado = await fetch('https://crm-trabalhoidw3-default-rtdb.firebaseio.com/clientes/' + id +'.json',{method: 'DELETE'});

    if(resultado.ok){
        lerDados();
    }
}

const editar = async (id) => {
    const clientes = {};
    clientes.nome_empresa = prompt('Digite o novo nome da empresa: ');
    clientes.nome_empresa = validar_empresas(clientes.nome_empresa);
    clientes.nome_proprietario = prompt('Digite o novo nome do proprietário: ');

    clientes.telefone = prompt('Digite o novo telefone: ');
    clientes.telefone = validarTelefone(clientes.telefone);
    
    clientes.email = prompt("Digite o novo email do usuario: ");
    clientes.email = validarEmail(clientes.email);
 

    const resultado = await fetch('https://crm-trabalhoidw3-default-rtdb.firebaseio.com/clientes/' + id +'.json', {
        method: 'PUT',
        body: JSON.stringify(clientes),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if(resultado.ok){
        lerDados();
    }


};

/* REPETINDO FUNÇÕES */

var empresas = [];

const carregar_empresas = async () => {

    const resultado = await fetch('https://crm-trabalhoidw3-default-rtdb.firebaseio.com/clientes.json', {method: 'GET'});
    if(resultado.ok){
        const clientes = await resultado.json();

            for(let id in clientes){
                empresas.push(clientes[id].nome_empresa);
            };
    }
}

carregar_empresas();

function validar_empresas(nome_empresa){

    while(true){
        if(empresas.some( (nome) => nome == nome_empresa) == false){
            return nome_empresa
        } else{
            nome_empresa = prompt('Empresa já existente, digite o novo nome de empresa: ');
        }
    }
}

function validarEmail(emailRecebido) {

    const email = emailRecebido;

    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    while(true)
    if (regexEmail.test(email)) {
        return email
    
    }else{
        email = prompt("Email invalido burro, reinsira")
    }
}

function validarTelefone(telefoneRecebido) {

    let telefone = telefoneRecebido;
      
    const regex = /^\(?\d{2}\)?\s?\d{1}\s?\d{4}-?\d{4}$/;

    while(true){
        if (!regex.test(telefone)) {
           telefone = prompt('Telefone Inválido. Digite o novo telefone: ')
        } else{
            return mascaraTelefone(telefone)
        }

    }
   

    
}
function mascaraTelefone(telefone) {
    return telefone
      .replace(/\D/g, '')                   
      .replace(/^(\d{2})(\d)/g, '($1)$2 ')    
      .replace(/(\d{4})(\d{4})$/, '$1-$2');   
  }

function printDados() {
    window.print();
}
document.getElementById('print').addEventListener('click', printDados);