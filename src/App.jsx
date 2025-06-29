import { Routes, Route, NavLink, BrowserRouter, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="navbar">
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/receitas" className="nav-link">Receitas</NavLink>
          <NavLink to="/nova" className="nav-link">Nova Receita</NavLink>
          <NavLink to="/editar" className="nav-link">Editar</NavLink>
          <NavLink to="/perfil" className="nav-link">Perfil</NavLink>
          <NavLink to="/login" className="nav-link">Login</NavLink>
        </nav>

        <div className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/receitas" element={<ListaReceitas />} />
            <Route path="/nova" element={<NovaReceita />} />
            <Route path="/editar" element={<EditarReceitas />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

function Home() {
  return (
    <div className="page">
      <h1 className="title">🍲 Receitas da Vovó</h1>
      <p className="subtitle">Descubra e compartilhe receitas deliciosas.</p>
    </div>
  );
}

function ListaReceitas() {
  const [receitas, setReceitas] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const receitasSalvas = JSON.parse(localStorage.getItem('receitas')) || [];
    setReceitas(receitasSalvas);
  }, []);

  const receitasFiltradas = receitas.filter(r =>
    r.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="page">
      <h1 className="title">📋 Lista de Receitas</h1>
      <input
        type="text"
        placeholder="Buscar receita..."
        className="input"
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
      />
      <ul className="recipe-list">
        {receitasFiltradas.map(r => (
          <li key={r.id} className="recipe-item">{r.nome}</li>
        ))}
      </ul>
    </div>
  );
}

function NovaReceita() {
  const [nome, setNome] = useState('');
  const [modo, setModo] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const nova = { id: Date.now(), nome, modo };
    const receitasAntigas = JSON.parse(localStorage.getItem('receitas')) || [];
    const receitasAtualizadas = [...receitasAntigas, nova];
    localStorage.setItem('receitas', JSON.stringify(receitasAtualizadas));
    navigate('/receitas');
  };

  return (
    <div className="page">
      <h1 className="title">➕ Nova Receita</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome da receita"
          className="input"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />
        <textarea
          placeholder="Modo de preparo"
          className="textarea"
          value={modo}
          onChange={e => setModo(e.target.value)}
        ></textarea>
        <button type="submit" className="button">Salvar</button>
      </form>
    </div>
  );
}

function EditarReceitas() {
  const [receitas, setReceitas] = useState([]);
  const [editando, setEditando] = useState(null);
  const [novoNome, setNovoNome] = useState('');

  useEffect(() => {
    const receitasSalvas = JSON.parse(localStorage.getItem('receitas')) || [];
    setReceitas(receitasSalvas);
  }, []);

  const iniciarEdicao = (receita) => {
    setEditando(receita.id);
    setNovoNome(receita.nome);
  };

  const salvarEdicao = () => {
    const atualizadas = receitas.map(r =>
      r.id === editando ? { ...r, nome: novoNome} : r
    );
    localStorage.setItem('receitas', JSON.stringify(atualizadas));
    setReceitas(atualizadas);
    setEditando(null);
  };

  return (
    <div className="page">
      <h1 className="title">✏️ Editar Receitas</h1>
      <ul className="recipe-list">
        {receitas.map(r => (
          <li key={r.id} className="recipe-item">
            {editando === r.id ? (
              <>
                <input
                  className="input"
                  value={novoNome}
                  onChange={e => setNovoNome(e.target.value)}
                />
                <button className="button" onClick={salvarEdicao}>Salvar</button>
              </>
            ) : (
              <>
                <strong>{r.nome}</strong>
                <button className="edit-button" onClick={() => iniciarEdicao(r)}>Editar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


function Perfil() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const nome = localStorage.getItem('usuario');
    if (nome) {
      setUsuario({ nome, email: `${nome.toLowerCase()}@email.com` });
    }
  }, []);

  return (
    <div className="page">
      <h1 className="title">👤 Perfil do Usuário</h1>
      {usuario ? (
        <>
          <p><strong>Nome:</strong> {usuario.nome}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
        </>
      ) : <p>Nenhum usuário logado.</p>}
    </div>
  );
}

function Login() {
  const [nome, setNome] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem('usuario', nome);
    navigate('/perfil');
  };

  return (
    <div className="page">
      <h1 className="title">🔐 Login</h1>
      <form className="form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Nome de usuário"
          className="input"
          value={nome}
          onChange={e => setNome(e.target.value)}
        />
        <button type="submit" className="button">Entrar</button>
      </form>
    </div>
  );
}