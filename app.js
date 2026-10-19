
import { createApp } from 'https://unpkg.com/vue@3.5.44/dist/vue.esm-browser.js';

// Componentes separados para melhor organização
const HomePage = {
    template: `
    <div class='profile-section'>
      <div class='avatar'></div>
      <h1>It's a me, Nery!&lt;/&gt;</h1>
      <p>technology enthusiast with background in mathematics and computer science.</p>
      <div class='profile-icons'>
        <i class='fa-solid fa-calculator'></i>
        <i class='fa-solid fa-laptop'></i>
      </div>
      <div class='music-desc'>My own musical compositions serve as a source of inspiration in tackling technical challenges.<br> This fusion of my passion for music and expertise in technology drives me to develop solutions that blend creativity and precision.</div>
      <div class='music-note'><i class='fa-solid fa-music'></i></div>
    </div>
  `
};

const AboutPage = {
    template: `
    <div class='cards-section'>
      <div class='card'><h2>Quem sou</h2><p>Sou um desenvolvedor apaixonado por tecnologia, matemática e música. Gosto de criar soluções elegantes e funcionais, sempre buscando aprender algo novo.</p></div>
      <div class='card'><h2>Formação</h2><ul><li>Bacharelado em Ciência da Computação</li><li>Licenciatura em Matemática</li></ul></div>
      <div class='card'><h2>Interesses</h2><p>Programação, música, fotografia, viagens e compartilhar conhecimento.</p></div>
    </div>
  `
};


const ProjectsPage = {
    template: `
    <div class='cards-section'>
      <div class='card'><h2>Portfólio</h2><p>Veja meus projetos no <a href='https://github.com/lu4nn3ry' target='_blank'>GitHub</a>.</p></div>
      <div class='card'><h2>Exemplo de Projeto</h2><p>Projeto X: Aplicação web para análise de dados em tempo real usando Python e JavaScript.</p></div>
      <div class='card code-block'><pre><code>// Exemplo de código destacado\nfunction helloWorld() {\n  console.log('Hello, world!');\n}</code></pre></div>
    </div>
  `
};

const TodoPage = {
    data() {
        return {
            newTask: '',
            todos: JSON.parse(localStorage.getItem('todos') || '[]')
        };
    },
    methods: {
        addTodo() {
            const text = this.newTask.trim();
            if (text) {
                this.todos.push({ text, done: false });
                this.newTask = '';
                this.saveTodos();
            }
        },
        removeTodo(idx) {
            this.todos.splice(idx, 1);
            this.saveTodos();
        },
        toggleTodo(idx) {
            this.todos[idx].done = !this.todos[idx].done;
            this.saveTodos();
        },
        saveTodos() {
            localStorage.setItem('todos', JSON.stringify(this.todos));
        }
    },
    template: `
    <div class='cards-section'>
      <div class='card'>
        <h2>Lista de Tarefas</h2>
        <form @submit.prevent="addTodo" style="display:flex;gap:8px;align-items:center;">
          <input v-model="newTask" placeholder="Nova tarefa..." style="flex:1;padding:8px;border-radius:6px;border:1px solid #ccc;">
          <button type="submit" style="padding:8px 16px;border-radius:6px;background:#007bff;color:#fff;border:none;">Adicionar</button>
        </form>
        <ul style="list-style:none;padding:0;margin:16px 0 0 0;">
          <li v-for="(todo,idx) in todos" :key="idx" style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
            <input type="checkbox" v-model="todo.done" @change="toggleTodo(idx)">
            <span :style="{textDecoration: todo.done ? 'line-through' : 'none', color: todo.done ? '#888' : '#fff'}">{{ todo.text }}</span>
            <button @click="removeTodo(idx)" style="margin-left:auto;background:none;border:none;color:#e74c3c;font-size:1.2em;cursor:pointer;">&times;</button>
          </li>
        </ul>
      </div>
    </div>
  `
};

const ContactPage = {
    template: `
    <div class='cards-section'>
      <div class='card'><h2>Fale comigo</h2><p>Entre em contato pelo e-mail <a href='mailto:lu4nn3ry@gmail.com'>lu4nn3ry@gmail.com</a> ou pelas redes sociais.</p></div>
      <div class='card'><h2>Redes Sociais</h2><ul><li><a href='https://github.com/lu4nn3ry' target='_blank'>GitHub</a></li><li><a href='https://www.linkedin.com/in/lu4nn3ry/' target='_blank'>LinkedIn</a></li><li><a href='https://instagram.com/lu4nn3ry' target='_blank'>Instagram</a></li></ul></div>
    </div>
  `
};


// Registro dos componentes para navegação dinâmica

const components = {
    'home-page': HomePage,
    'about-page': AboutPage,
    'projects-page': ProjectsPage,
    'contact-page': ContactPage,
    'todo-page': TodoPage
};


createApp({
    data() {
        return {
            page: 'home',
            menuOpen: false,
            links: [
                { icon: 'fa-star', page: 'home', label: 'Início' },
                { icon: 'fa-user', page: 'about', label: 'Sobre' },
                { icon: 'fa-code', page: 'projects', label: 'Projetos' },
                { icon: 'fa-list-check', page: 'todo', label: 'Tarefas' },
                { icon: 'fa-envelope', page: 'contact', label: 'Contato' },
                { icon: 'fa-github', url: 'https://github.com/lu4nn3ry', label: 'GitHub', external: true },
            ],
        };
    },
    methods: {
        goTo(page) {
            if (page && this.page !== page) {
                this.page = page;
            }
            this.menuOpen = false;
        },
        openMenu() {
            this.menuOpen = !this.menuOpen;
        },
        isActive(page) {
            return this.page === page;
        }
    },
    computed: {
        currentComponent() {
            // Garante fallback para home caso componente não exista
            return components[this.page + '-page'] ? this.page + '-page' : 'home-page';
        }
    },
    components
}).mount('#app');
