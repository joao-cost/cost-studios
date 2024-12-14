const formulario= document.querySelector('#form-cadastro')


var empresas = [];

const form = document.getElementById('form-cadastro');
const systemMessage = document.getElementById('system');

// Função para exibir a mensagem no sistema
function showMessage(message, type) {
    systemMessage.textContent = message; // Define o texto da mensagem
    systemMessage.classList.remove('success'); // Remove a classe de sucesso (caso exista)
    
    if (type === 'success') {
        systemMessage.classList.add('success'); // Adiciona a classe de sucesso
    }
    
    systemMessage.style.display = 'block'; // Exibe o pop-up de mensagem

    // Oculta a mensagem automaticamente após 5 segundos
    setTimeout(() => {
        systemMessage.style.display = 'none';
    }, 5000);
}

const carregar_empresas = async () => {

    const resultado = await fetch('https://crm-trabalhoidw3-default-rtdb.firebaseio.com/clientes.json', {method: 'GET'});
    if(resultado.ok){
        const clientes = await resultado.json();
        empresas = [];
            for(let id in clientes){
                empresas.push(clientes[id].nome_empresa);
            };
    }
}

carregar_empresas();

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

            valor_telefone = mascaraTelefone(cliente.telefone)
            cliente.telefone = valor_telefone
            
        if(validarEmail(cliente.email)){
            if(empresas.some( (nome) => nome == cliente.nome_empresa ) == false){

                console.log(empresas.some( (nome) => nome == cliente.nome_empresa ) == false)

                const envio = await fetch('https://crm-trabalhoidw3-default-rtdb.firebaseio.com/clientes.json', {
                    method : 'POST',
                    body : JSON.stringify(cliente),
                    headers: {
                    'Content-Type': 'application/json'
                    }
                })
        
                if(envio.ok){
                    formulario.reset();
                    showMessage('Sucesso: Cliente cadastrado com sucesso!', 'success');
                    carregar_empresas();
                }
            } else{
                showMessage('Erro: Empresa existente!', 'error');
            }
        }
      }
    }

)



function validarEmail(emailRecebido) {

    const email = emailRecebido;

    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!regexEmail.test(email)) {
        console.log("Email Inválido");
        showMessage('Erro: Email Inválido', 'error');
        return false;
    }
    return true;
}

function validarTelefone(telefoneRecebido) {

    const telefone = telefoneRecebido;
   
   
    const regex = /^\(?\d{2}\)?\s?\d{1}\s?\d{4}-?\d{4}$/;

    if (!regex.test(telefone)) {
        showMessage('Erro: Número de telefone Inválido', 'error');
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