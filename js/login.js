const CHAVE_USUARIOS = "bernasoft_usuarios";
const CHAVE_USUARIO_LOGADO = "bernasoft_usuario_logado";

function mostrarMensagem(elementoId, mensagem, tipo) {
    const elemento = document.getElementById(elementoId);
    if (!elemento) return;
    
    elemento.textContent = mensagem;
    elemento.className = `mensagemAutenticacao ${tipo}`;
    elemento.style.display = 'block';
    
    setTimeout(() => {
        elemento.textContent = '';
        elemento.className = 'mensagemAutenticacao';
        elemento.style.display = 'none';
    }, 3000);
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

if (document.getElementById('loginForm')) {
    const formularioLogin = document.getElementById('loginForm');
    const usuarios = JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
    
    const usuarioLembrado = usuarios.find(u => u.lembrar);
    if (usuarioLembrado) {
        document.getElementById('email').value = usuarioLembrado.email;
        document.getElementById('senha').value = usuarioLembrado.senha;
        document.getElementById('lembrar').checked = true;
    }
    
    formularioLogin.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;
        const lembrar = document.getElementById('lembrar').checked;
        
        if (!email || !senha) {
            mostrarMensagem('mensagemLogin', 'Preencha todos os campos', 'erro');
            return;
        }
        
        if (!validarEmail(email)) {
            mostrarMensagem('mensagemLogin', 'E-mail inválido', 'erro');
            return;
        }

        const usuario = usuarios.find(u => u.email === email && u.senha === senha);
        
        if (usuario) {
            if (lembrar !== usuario.lembrar) {
                usuario.lembrar = lembrar;
                localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
            }
            
            sessionStorage.setItem(CHAVE_USUARIO_LOGADO, JSON.stringify(usuario));
            
            mostrarMensagem('mensagemLogin', 'Login realizado!', 'sucesso');
            
            setTimeout(() => {
                window.location.href = 'inicio.html';
            }, 1000);
        } else {
            mostrarMensagem('mensagemLogin', 'E-mail ou senha incorretos', 'erro');
        }
    });
}

if (document.getElementById('formCadastro')) {
    const formularioCadastro = document.getElementById('formCadastro');
    
    formularioCadastro.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('emailCadastro').value.trim();
        const senha = document.getElementById('senhaCadastro').value;
        const cpf = document.getElementById('cpf').value.replace(/\D/g, '');
        
        if (!nome || !email || !senha || !cpf) {
            mostrarMensagem('mensagemCadastro', 'Preencha todos os campos', 'erro');
            return;
        }
        
        if (!validarEmail(email)) {
            mostrarMensagem('mensagemCadastro', 'E-mail inválido', 'erro');
            return;
        }
        
        if (senha.length < 6) {
            mostrarMensagem('mensagemCadastro', 'Senha deve ter 6+ caracteres', 'erro');
            return;
        }
        
        const usuarios = JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
        if (usuarios.some(u => u.email === email)) {
            mostrarMensagem('mensagemCadastro', 'E-mail já cadastrado', 'erro');
            return;
        }
        
        const novoUsuario = {
            id: Date.now().toString(),
            nome,
            email,
            senha,
            cpf,
            lembrar: false,
            dataCriacao: new Date().toISOString()
        };
        
        usuarios.push(novoUsuario);
        localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
        
        mostrarMensagem('mensagemCadastro', 'Cadastro realizado!', 'sucesso');

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    });
}

function verificarAutenticacao() {
    const paginasPublicas = ['login.html', 'cadastro.html'];
    const paginaAtual = window.location.pathname.split('/').pop();
    
    if (!paginasPublicas.includes(paginaAtual)) {
        const usuarioLogado = sessionStorage.getItem(CHAVE_USUARIO_LOGADO);
        if (!usuarioLogado) {
            window.location.href = 'login.html';
        }
    }
}

document.addEventListener('DOMContentLoaded', verificarAutenticacao);