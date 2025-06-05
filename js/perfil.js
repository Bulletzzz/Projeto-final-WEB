const CHAVE_USUARIOS = "bernasoft_usuarios";
const CHAVE_USUARIO_LOGADO = "bernasoft_usuario_logado";

// Print de mensagens
function mostrarMensagemPerfil(elementoId, mensagem, tipo) {
    const elemento = document.getElementById(elementoId);
    if (!elemento) return;
    
    elemento.textContent = mensagem;
    elemento.className = `mensagem-perfil ${tipo}`;
    elemento.style.display = 'block';
    
    setTimeout(() => {
        elemento.textContent = '';
        elemento.className = 'mensagem-perfil';
        elemento.style.display = 'none';
    }, 3000);
}

// Formata CPF
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Valida email
function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Puxando dados do usuario
function carregarDadosUsuario() {
    const usuarioLogado = JSON.parse(sessionStorage.getItem(CHAVE_USUARIO_LOGADO));
    
    if (usuarioLogado) {
        document.getElementById('nome-perfil').value = usuarioLogado.nome || '';
        document.getElementById('cpf-perfil').value = usuarioLogado.cpf ? formatarCPF(usuarioLogado.cpf) : '';
        document.getElementById('email-perfil').value = usuarioLogado.email || '';
        
        if (usuarioLogado.fotoPerfil) {
            document.getElementById('foto-perfil').src = usuarioLogado.fotoPerfil;
        }
    } else {
        window.location.href = 'login.html';
    }
}

// Configuração do sistema da foto
function configurarUploadFoto() {
    document.getElementById('botao-foto').addEventListener('click', function() {
        document.getElementById('input-foto').click();
    });

    document.getElementById('input-foto').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('foto-perfil').src = event.target.result;
                atualizarFotoPerfil(event.target.result);
                mostrarMensagemPerfil('mensagem-perfil', 'Foto atualizada com sucesso!', 'sucesso');
            };
            reader.readAsDataURL(file);
        }
    });
}

function atualizarFotoPerfil(fotoBase64) {
    const usuarioLogado = JSON.parse(sessionStorage.getItem(CHAVE_USUARIO_LOGADO));
    usuarioLogado.fotoPerfil = fotoBase64;
    sessionStorage.setItem(CHAVE_USUARIO_LOGADO, JSON.stringify(usuarioLogado));

    const usuarios = JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
    const usuarioIndex = usuarios.findIndex(u => u.id === usuarioLogado.id);
    if (usuarioIndex !== -1) {
        usuarios[usuarioIndex].fotoPerfil = fotoBase64;
        localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
    }
}

// Formularios do perfil
function configurarFormularioPerfil() {
    document.getElementById('form-perfil').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome-perfil').value.trim();
        const cpf = document.getElementById('cpf-perfil').value.replace(/\D/g, '');
        const email = document.getElementById('email-perfil').value.trim();
        
        if (!nome || !cpf || !email) {
            mostrarMensagemPerfil('mensagem-perfil', 'Preencha todos os campos', 'erro');
            return;
        }
        
        if (!validarEmail(email)) {
            mostrarMensagemPerfil('mensagem-perfil', 'E-mail inválido', 'erro');
            return;
        }
        
        const usuarioLogado = JSON.parse(sessionStorage.getItem(CHAVE_USUARIO_LOGADO));
        const usuarios = JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
        
        usuarioLogado.nome = nome;
        usuarioLogado.cpf = cpf;
        usuarioLogado.email = email;
        
        sessionStorage.setItem(CHAVE_USUARIO_LOGADO, JSON.stringify(usuarioLogado));
        
        const usuarioIndex = usuarios.findIndex(u => u.id === usuarioLogado.id);
        if (usuarioIndex !== -1) {
            usuarios[usuarioIndex] = usuarioLogado;
            localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
        }
        
        mostrarMensagemPerfil('mensagem-perfil', 'Perfil atualizado com sucesso!', 'sucesso');
    });
}

// Formato CPF
function configurarMascaraCPF() {
    document.getElementById('cpf-perfil').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 3) {
            value = value.replace(/^(\d{3})/, '$1.');
        }
        if (value.length > 7) {
            value = value.replace(/^(\d{3})\.(\d{3})/, '$1.$2.');
        }
        if (value.length > 11) {
            value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})/, '$1.$2.$3-');
        }
        
        e.target.value = value.substring(0, 14);
    });
}

// Botão de sair
function configurarBotaoSair() {
    document.getElementById('botao-sair').addEventListener('click', function() {
        sessionStorage.removeItem(CHAVE_USUARIO_LOGADO);
        window.location.href = 'conv.html';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    carregarDadosUsuario();
    configurarUploadFoto();
    configurarFormularioPerfil();
    configurarMascaraCPF();
    configurarBotaoSair();
});