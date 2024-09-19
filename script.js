function pokeBusca() {
    let nome = document.querySelector('#nome').value.toLowerCase();

    fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokémon não encontrado'); 
            }
            return response.json();
        })
        .then(dados => {
            document.querySelector('#pokeNome').innerHTML = "Nome: " + dados.name.charAt(0).toUpperCase() + dados.name.slice(1);
            document.querySelector('#pokeID').innerHTML = "ID: " + dados.id;
            document.querySelector('#pokeImg').src = dados.sprites.versions['generation-v']['black-white'].animated.front_default;
        })
        .catch(error => {
            document.querySelector('#pokeImg').src = ''; 
            document.querySelector('#pokeID').innerHTML = 'Pokémon não encontrado'; 
            document.querySelector('#pokeNome').innerHTML = ''; 
            console.error('Erro:', error);
        });
}

document.getElementById('nome').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        pokeBusca();
    }
});


function removerPontoFinal(texto) {
    return texto.endsWith('.') ? texto.slice(0, -1) : texto;
}


function iniciarReconhecimentoDeVoz() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'pt-BR'; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1; 

    recognition.start(); 

    recognition.onstart = () => {
        console.log('Reconhecimento de voz iniciado...');
        document.getElementById('mic-btn').classList.add('active'); 
    };

    recognition.onspeechend = () => {
        recognition.stop(); 
    };

    recognition.onresult = (event) => {
        let resultado = event.results[0][0].transcript;

        resultado = removerPontoFinal(resultado);

        console.log('Texto reconhecido (sem ponto final):', resultado);

       
        document.querySelector('#nome').value = resultado;

        pokeBusca();
    };

    recognition.onerror = (event) => {
        console.error('Erro no reconhecimento de voz:', event.error);
    };

    recognition.onend = () => {
        document.getElementById('mic-btn').classList.remove('active');
    };
}

document.getElementById('mic-btn').addEventListener('click', iniciarReconhecimentoDeVoz);
