function filtrarCategoria(secao) {
    const mapaSecoes = {
        pagina: '#pagina-secao',
        sobre: '#sobre-secao-custom',
        quem: '#quem-secao-custom',
        extras: '#extras-secao'
    };

    const destino = document.querySelector(mapaSecoes[secao]);
    if (destino) {
        const offset = 150; // altura da barra fixa (ajuste se necessário)
        const top = destino.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // ========= Livro Interativo =========
    const conteudoPaginas = [
        "Img/capa.png",
        "Img/Errata.png",
        "Img/indice.png",
        "Img/O que é.png",
        "Img/História.png",
        "Img/Origem Brasil.png",
        "Img/Pixe vs Grafite.png",
        "Img/Marg (2).png",
        "Img/marg.png",
        "Img/OOutros E.png",
        "Img/OOutros D.png",
        "Img/Manifesttação.png",
        "Img/Design Beira 1.png",
        "Img/Design de Beira 2.png",
        "Img/Conclu.png",
        "Img/Expediente.png",
        "Img/Agradecimento.png",
        "Img/Linguá quebrada.png",
        "Img/Contracapa (0_1).png",
        "Img/contracapa.png"
    ];

    let paginaAtual = 0;
    const esquerda = document.getElementById("pagina-esquerda");
    const direita = document.getElementById("pagina-direita");
    const contador = document.getElementById("contador");
    const barra = document.getElementById("barra-categorias");

    function mostrarConteudo(indice) {
        const item = conteudoPaginas[indice] || '';
        if (item.startsWith("texto:")) {
            const txt = item.replace("texto:", "").trim();
            return `<div style="padding:20px; font-size:24px; text-align:center;">${txt}</div>`;
        }
        return `<img src="${item}" alt="Página ${indice + 1}">`;
    }

    function atualizarLivro() {
        const total = conteudoPaginas.length;
        esquerda.classList.remove("escondida");
        direita.classList.remove("escondida");

        if (paginaAtual === 0) {
            esquerda.innerHTML = mostrarConteudo(0);
            direita.classList.add("escondida");
            direita.innerHTML = "";
        } else if (paginaAtual === total - 1) {
            esquerda.classList.add("escondida");
            esquerda.innerHTML = "";
            direita.innerHTML = mostrarConteudo(paginaAtual);
        } else {
            esquerda.innerHTML = mostrarConteudo(paginaAtual);
            direita.innerHTML = mostrarConteudo(paginaAtual + 1);
        }

        contador.textContent = `${paginaAtual + 1} / ${total}`;
    }

    function avancar() {
        const total = conteudoPaginas.length;
        if (paginaAtual === 0) paginaAtual = 1;
        else if (paginaAtual < total - 2) paginaAtual += 2;
        else if (paginaAtual === total - 2) paginaAtual += 1;
        atualizarLivro();
    }

    function voltar() {
        if (paginaAtual === 1) paginaAtual = 0;
        else if (paginaAtual > 1) paginaAtual -= 2;
        atualizarLivro();
    }

    window.avancar = avancar;
    window.voltar = voltar;
    atualizarLivro();

    // ========= Fullscreen =========
    const btnFullscreen = document.getElementById("fullscreen-btn");
    btnFullscreen.onclick = () => {
        const livro = document.getElementById("livro-container");
        if (!document.fullscreenElement) {
            livro.requestFullscreen({ navigationUI: "hide" });
            livro.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90vw;
                max-height: 90vh;
            `;
            barra.style.opacity = "0";
        } else {
            document.exitFullscreen();
        }
    };

    document.addEventListener("fullscreenchange", () => {
        const livro = document.getElementById("livro-container");
        if (!document.fullscreenElement) {
            livro.style.cssText = "";
            livro.style.width = "720px";
            livro.style.maxHeight = "480px";
            barra.style.opacity = "1";
        }
    });

    // ========= Teclado =========
    window.addEventListener("keydown", e => {
        if (e.key === "ArrowRight") avancar();
        if (e.key === "ArrowLeft") voltar();
    });

    // ========= Fade-in da seção “Sobre” =========
    const sobreSecao = document.getElementById('sobre-secao-custom');
    if (sobreSecao) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        observer.observe(sobreSecao);
    }

    // ========= Clique nas mini-cartas “Quem Somos” com fade sempre =========
    document.querySelectorAll('.qs-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = document.getElementById('qs-card');
            if (!card) return;

            const nomeNovo = btn.alt.trim();
            const novoSrc = `Img/${nomeNovo}.png`;

            card.classList.remove('show');
            card.src = novoSrc;
            card.alt = nomeNovo;
            void card.offsetWidth; // força reflow
            card.classList.add('show');
        });
    });
});

// cliques na seção “Extras”
document.querySelectorAll('.extras-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const url = btn.dataset.href;
        if (url) window.location.href = url;
    });
});
