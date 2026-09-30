# Relatório Técnico de Arquitetura Front-End
## Projeto: Instituto Prato Cheio | Juntos Contra a Fome

Este documento discrimina e justifica as escolhas arquiteturais, maquetes responsivas e engenharia de eventos aplicadas no desenvolvimento do portal institucional do **Instituto Prato Cheio**. O projeto foi concebido sob as diretrizes de acessibilidade (WCAG AAA), semântica estrita, performance nativa (*Vanilla JS*) e transição para o modelo de *Single Page Application* (SPA).

---

## 1. Arquitetura Macroscópica: CSS Grid de 12 Colunas

A estrutura macroscópica foi orquestrada utilizando o modelo bidimensional **CSS Grid**, adotando a abordagem *Mobile-First*. A malha guia foi fixada em um sistema flexível de **12 colunas de larguras rigorosamente iguais**, garantindo simetria indestrutível e adaptabilidade em qualquer ecrã.

### Configuração do Container Pai (`.grid-container`)
```css
.grid-container {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 16px;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
    padding: 16px;
}
```

### Os 5 Cenários Adaptativos (Breakpoints Responsivos)
A distribuição das áreas macrossociais evolui de forma fluida através de cinco pontos de quebra estipulados via declaração `@media`:

1. **Cenário 1: Dispositivos Móveis Verticais (Base / Padrão - até 575px)**
   * *Comportamento:* A grade colapsa para o fluxo vertical. Todos os itens assumem `grid-column: span 12;` para leitura linear confortável.
2. **Cenário 2: Dispositivos Móveis Horizontais / Phablets (Mínimo de 576px)**
   * *Comportamento:* O espaçamento aumenta para `20px`. As seções inferiores começam a se dividir lateralmente (`grid-column: span 6;`).
3. **Cenário 3: Tablets (Mínimo de 768px)**
   * *Comportamento:* A seção principal de conteúdo se expande para `span 8` e a barra lateral de metas assume `span 4`. O rodapé passa a alinhar os dados e o mapa lado a lado.
4. **Cenário 4: Laptops / Desktops Padrão (Mínimo de 992px)**
   * *Comportamento:* O espaçamento é recalculado para `24px`. Os cartões institucionais estabilizam em formato de grade ternária clássica (`grid-column: span 4;`).
5. **Cenário 5: Desktops Panorâmicos / Ultra-wides (Mínimo de 1200px)**
   * *Comportamento:* Estabilização visual máxima. Espaçamento fixado em `32px` com preenchimento interno de `40px` no container, estendendo a seção principal de informações para `span 9` e reduzindo a lateral para `span 3`.

---

## 2. Alinhamento Microscópico: Disposição Unidimensional com Flexbox

Enquanto o CSS Grid governa o esqueleto externo, o **Flexbox** rege de forma exímia a distribuição microscópica e o posicionamento exato dos elementos dentro dos componentes.

* **Cabeçalho (`.nav-container`):** Configurado com `display: flex; justify-content: space-between; align-items: center;`. Esta combinação empurra o logotipo e os links para as extremidades opostas do ecrã e assegura que fiquem perfeitamente alinhados pelo seu eixo central vertical.
* **Cartões Informativos (`.grid-item`):** Convertidos internamente em fluxos flexíveis verticais por meio de `flex-direction: column;`. A inclusão estratégica de `flex-grow: 1;` nos parágrafos força o empurrão natural dos botões de ação (`.cta-group`) para a base inferior, mantendo uma linha visual horizontal idêntica entre blocos vizinhos.
* **Grupo de Botões (`.cta-group`):** Utiliza `display: flex; flex-wrap: wrap; gap: 12px;`. A propriedade `flex-wrap: wrap;` é o mecanismo crítico de resiliência que força botões longos a quebrarem de linha de forma elegante em telas estreitas, impedindo que o conteúdo estoure para fora do cartão.
* **Rodapé (`.footer-container`):** Alinha dados de contato e o mapa de forma vertical em dispositivos móveis, e transmuta de forma reativa para `flex-direction: row; align-items: stretch;` a partir de `768px`.

---

## 3. Diálogo Visual e Mutações de Estado (Acessibilidade WCAG AAA)

Para prover uma comunicação clara e intuitiva sempre que ocorre uma interatividade, a folha de estilo gerencia as mutações visuais dos elementos com base nos eventos provocados pelos utilizadores.

### Mutações nos Botões (`.btn`)
* **`:hover`:** Altera o fundo para uma tonalidade mais escura controlada (`--cor-primaria-hover`), notificando o utilizador que o elemento é clicável.
* **`:active`:** Dispara uma cor de profundidade mais intensa acompanhada por `transform: scale(0.97);`. Esta redução micro-proporcional mimetiza a compressão mecânica de um botão real, fornecendo feedback físico imediato.
* **`:focus-visible`:** Substitui o contorno padrão por um anel azul nítido de alta visibilidade (`outline: 3px solid var(--cor-foco); outline-offset: 3px;`), assegurando excelente navegabilidade por teclado (tecla `TAB`).

### Validação Semântica de Formulários (`.form-control`)
Os campos de entrada de dados utilizam a pseudo-classe `:not(:placeholder-shown)` combinada a `:invalid` e `:valid` para aplicar validação visual em tempo real:
* **Entrada Inválida (`.is-invalid`):** Transmuta as bordas para vermelho (`--cor-erro`) e renderiza mensagens textuais de suporte explicativo, impedindo erros de preenchimento.
* **Entrada Válida (`.is-valid`):** Modifica instantaneamente a delimitação do campo para verde (`--cor-sucesso`), sinalizando sucesso de consistência ao utilizador antes da submissão.

---

## 4. Engenharia SPA, Roteamento e Manipulação de DOM

A transição para o modelo de **Single Page Application (SPA)** eliminou a necessidade de recarregar o documento inteiro a cada interação, promovendo uma navegação instantânea.

### Mecanismo de Roteamento e Interceptação
O script realiza a **Delegação de Eventos** escutando de forma centralizada qualquer gatilho de clique em `document.body`. Ao interceptar um clique em uma tag com a propriedade `data-link`, o script executa o método **`e.preventDefault()`** para anular o comportamento natural do navegador.

A função principal limpa o escopo interno do elemento alvo principal (`<main id="app-view">`) e injeta os novos nós de forma programática alterando a propriedade **`view.innerHTML`** com base em um dicionário de rotas local, preservando o histórico físico de navegação por meio da API **`history.pushState()`**.

---

## 5. Sistema de Templates Declarativos Reativos

O gerenciamento de elementos repetitivos da interface (como registros da tabela de prestação de contas e tópicos do FAQ) foi automatizado através de **Template Literals** (Interpolação de Strings por Crases) associados a iteradores de vetores.

### Fluxo de Processamento de Dados
1. As informações brutas são abstraídas e isoladas em coleções matriciais de objetos JavaScript puros (`const dadosTransparencia`).
2. Funções geradoras isoladas recebem os arrays e aplicam o método **`.map()`** para varrer e traduzir cada objeto em uma string HTML estruturada, interpolando as variáveis dinamicamente (`${item.mes}`).
3. O método **`.join('')`** é encadeado ao final para unificar a coleção de dados em uma única cadeia de texto contínua.
4. O resultado é injetado no DOM via `innerHTML`, eliminando a necessidade de reescrever marcação rígida repetitiva no arquivo físico e assegurando escalabilidade total para o portal da ONG.
