// 1. CONTEÚDO DAS ROTAS
const rotas = {
home: `
<section class="grid-item hero-section">
<h2>Destaque Principal</h2>
<p>Campanha urgente de arrecadação contra a insegurança alimentar crônica. Apoie o trabalho dos nossos voluntários e faça a diferença.</p>
<div class="cta-group"><a href="#/ajudar" class="btn btn-alt" data-link="ajudar">Quero doar agora</a></div>
</section>
<section class="grid-item about-section">
<h2>Quem Somos</h2>
<p>Atuamos na distribuição macroscópica de alimentos excedentes e no combate direto à fome, servindo de ponte ativa entre quem quer doar e quem precisa receber.</p>
</section>
<aside class="grid-item sidebar-section">
<h2>Metas de Arrecadação</h2>
<p>Acompanhe o andamento das nossas metas mensais de arrecadação de toneladas de alimentos saudáveis para este ciclo.</p>
<div class="cta-group"><a href="#/transparencia" class="btn btn-primario" data-link="transparencia">Ver Painel</a></div>
</aside>`,
projetos: `
<section class="grid-item full-span">
<h2>Projeto Cozinha Comunitária</h2>
<p>Refeições nutritivas preparadas diariamente com todo o afeto, seguindo rigorosos padrões higiênico-sanitários.</p>
</section>
<section class="grid-item full-span">
<h2>Perguntas Frequentes (FAQ)</h2>
<p>Tire suas dúvidas rápidas sobre como funcionam nossas triagens e distribuições de alimentos.</p>
<div class="accordion">
<div class="accordion-item">
<input type="checkbox" id="faq1" class="accordion-toggle">
<label for="faq1" class="accordion-header">Como funcionam as doações de alimentos? <span class="accordion-icon">+</span></label>
<div class="accordion-content">Buscamos doações comerciais diretamente com produtores parceiros ou recebemos entregas físicas de alimentos não perecíveis diretamente em nosso ponto de triagem.</div>
</div>
<div class="accordion-item">
<input type="checkbox" id="faq2" class="accordion-toggle">
<label for="faq2" class="accordion-header">Quem pode receber os alimentos? <span class="accordion-icon">+</span></label>
<div class="accordion-content">Famílias cadastradas em programas de assistência social do município e que se encontram em situação comprovada de insegurança alimentar crônica.</div>
</div>
</div>
</section>`,
transparencia: `
<section class="grid-item full-span">
<h2>Relatório de Prestação de Contas</h2>
<p>Demonstração transparente dos recursos captados e refeições distribuídas à comunidade de Severínia e região.</p>
<div class="table-responsive">
<table>
<thead><tr><th>Mês Referência</th><th>Recursos Captados</th><th>Refeições Entregues</th><th>Famílias Atendidas</th></tr></thead>
<tbody>
<tr><td>Janeiro</td><td>R$ 12.450,00</td><td>1.850 marmitas</td><td>120 famílias</td></tr>
<tr><td>Fevereiro</td><td>R$ 14.800,00</td><td>2.100 marmitas</td><td>145 famílias</td></tr>
<tr><td>Março</td><td>R$ 16.200,00</td><td>2.450 marmitas</td><td>170 famílias</td></tr>
</tbody>
</table>
</div>
</section>`,
ajudar: `
<section class="grid-item full-span">
<h2>Faça Parte da Mudança (Seja Voluntário)</h2>
<p>Preencha os campos abaixo. O sistema validará seus dados automaticamente.</p>
<form class="form-voluntario" id="form-voluntario">
<div class="form-group-row">
<div class="form-control"><label for="nome">Nome Completo *</label><input type="text" id="nome" placeholder=" " required minlength="3"></div>
<div class="form-control"><label for="email">E-mail *</label><input type="email" id="email" placeholder=" " required></div>
</div>
<div class="form-group-row">
<div class="form-control"><label for="telefone">Telefone / WhatsApp *</label><input type="tel" id="telefone" placeholder=" " required pattern="\\(\\d{2}\\) \\d{4,5}-\\d{4}" maxlength="15"></div>
<div class="form-control"><label for="area">Área de Interesse *</label>
<select id="area" required>
<option value="">Selecione uma opção...</option>
<option value="logistica">Logística e Cozinha Comunitária</option>
<option value="triagem">Triagem de Alimentos</option>
<option value="admin">Administrativo / Comunicação</option>
</select></div>
</div>
<div class="cta-group"><button type="submit" class="btn btn-primario">Enviar Inscrição</button></div>
<p class="form-msg" id="form-msg" role="status"></p>
</form>
</section>`
};

// 2. ROTEADOR SPA (baseado em #/rota, funciona abrindo o arquivo direto)
function rotaAtual() {
  const r = location.hash.replace('#/', '');
  return rotas[r] ? r : 'home';
}
function navegarSPA(destino) {
  const view = document.getElementById('app-view');
  view.innerHTML = rotas[destino] || rotas.home;
  view.style.animation = 'none';
  view.offsetHeight;
  view.style.animation = null;
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.getAttribute('data-link') === destino);
  });
  if (destino === 'ajudar') ativarMascaraTelefone();
  window.scrollTo(0, 0);
}

// 3. CLIQUES DE NAVEGAÇÃO
document.body.addEventListener('click', e => {
  const alvo = e.target.closest('[data-link]');
  if (!alvo) return;
  e.preventDefault();
  const destino = alvo.getAttribute('data-link');
  if (location.hash === '#/' + destino) navegarSPA(destino);
  else location.hash = '#/' + destino;
});

// 4. BOTÕES AVANÇAR/VOLTAR
window.addEventListener('hashchange', () => navegarSPA(rotaAtual()));

// 5. MÁSCARA DE TELEFONE
function ativarMascaraTelefone() {
  const tel = document.getElementById('telefone');
  if (!tel) return;
  tel.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d)(\d{4})$/, '$1-$2');
    e.target.value = v;
  });
}

// 6. ENVIO DO FORMULÁRIO (demonstração, nenhum dado é enviado)
document.body.addEventListener('submit', e => {
  if (e.target.id !== 'form-voluntario') return;
  e.preventDefault();
  e.target.reset();
  document.getElementById('form-msg').textContent = 'Inscrição enviada! Entraremos em contato em breve.';
});

// CARREGAMENTO INICIAL
window.addEventListener('DOMContentLoaded', () => navegarSPA(rotaAtual()));
