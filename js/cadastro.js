/* https://crm-trabalhoidw3-default-rtdb.firebaseio.com/ */

const formulario= document.querySelector('#form-cadastro')


var empresas = [];

formulario.addEventListener('submit', async (e) => {

        e.preventDefault();

        var cliente = {
            nome_empresa: formulario.nomeEmpresa.value,
            nome_proprietario: formulario.nomeProprietario.value,
            telefone: formulario.telefone.value,
            email: formulario.email.value,
            status: 'Pré-contato'
        };
        console.log(empresas)

        if(validarTelefone(cliente.telefone)){
        if(validarEmail(cliente.email)){
            if(empresas.some( (nome) => nome == cliente.nome_empresa ) == false){

                valor_telefone = mascaraTelefone(cliente.telefone)
                cliente = {
                    nome_empresa: formulario.nomeEmpresa.value,
                    nome_proprietario: formulario.nomeProprietario.value,
                    telefone: valor_telefone,
                    email: formulario.email.value,
                    status: 'Pré-contato'
                }

                const envio = await fetch('https://crm-trabalhoidw3-default-rtdb.firebaseio.com/clientes.json', {
                    method : 'POST',
                    body : JSON.stringify(cliente),
                    headers: {
                    'Content-Type': 'application/json'
                    }
                })
        
                if(envio.ok){
                    formulario.reset();
                }
            } else{
                alert("Cliente já cadastrado")
            }
        }
      }
    }

)

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

function validarEmail(emailRecebido) {

    const email = emailRecebido;

    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!regexEmail.test(email)) {
        console.log("Email Inválido");
        alert("Email Inválido");
        return false;
    }
    return true;
}

function validarTelefone(telefoneRecebido) {

    const telefone = telefoneRecebido;
   
   
    const regex = /^\(?\d{2}\)?\s?\d{1}\s?\d{4}-?\d{4}$/;

    if (!regex.test(telefone)) {
        alert("Número de telefone inválido");
        return false;
    }

    return true;
}
function mascaraTelefone(telefone) {
    return telefone
      .replace(/\D/g, '')                   
      .replace(/^(\d{2})(\d)/g, '($1)$2 ')    
      .replace(/(\d{4})(\d{4})$/, '$1-$2');   
  }
