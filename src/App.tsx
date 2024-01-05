import React, { useState, useEffect } from "react";

interface Tarefa {
 texto: string;
 concluida: boolean;
}

interface ListaTarefasProps {}

interface Filtro {
 todas: boolean;
 completas: boolean;
 incompletas: boolean;
 nome: string;
}

function ListaTarefas({}: ListaTarefasProps) {
 const [tarefas, setTarefas] = useState<Tarefa[]>([]);

 useEffect(() => {
  const tarefasSalvas = JSON.parse(localStorage.getItem("tarefa") || "[]");
  if (tarefasSalvas) {
   setTarefas(tarefasSalvas);
  }
 }, []);

 useEffect(() => {
  localStorage.setItem("tarefa", JSON.stringify(tarefas));
 }, [tarefas]);

 const adicionarTarefa = (textoTarefa: string) => {
  const tarefaExiste = tarefas.some(
   (i) => i.texto.toUpperCase() === textoTarefa.toUpperCase()
  );
  if (textoTarefa !== "" && !tarefaExiste) {
   setTarefas([...tarefas, { texto: textoTarefa, concluida: false }]);
  }
 };

 const removerTarefa = (index: number) => {
  const resposta = window.confirm("Você realmente quer excluir a tarefa?");
  if (resposta) {
   const novasTarefas = [...tarefas];
   novasTarefas.splice(index, 1);
   setTarefas(novasTarefas);
  }
 };

 const atualizaTarefa = (index: number, texto: string) => {
  const novasTarefas = [...tarefas];
  novasTarefas[index].texto = texto;
  setTarefas(novasTarefas);
 };

 const mudarCompleto = (index: number) => {
  const novasTarefas = [...tarefas];
  novasTarefas[index].concluida = !novasTarefas[index].concluida;
  setTarefas(novasTarefas);
 };

 const [filtro, setFiltro] = useState<Filtro>({
  todas: true,
  completas: false,
  incompletas: false,
  nome: "",
  filtro :  ""
 });


 const mudarFiltro = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = event.target;
  if (name === "filtro") {
   setFiltro({
    ...filtro,
    todas: false,
    completas: false,
    incompletas: false,
    [value]: true,
   });
  } else {
   setFiltro({ ...filtro, [name]: value });
  }
 };

 let tarefasFiltradas = tarefas.filter((tarefa) => {
  if (filtro.completas) return tarefa.concluida;
  else if (filtro.incompletas) return !tarefa.concluida;
  else return true;
 });
 tarefasFiltradas = tarefasFiltradas.filter((tarefa) =>
  tarefa.texto.includes(filtro.nome)
 );

 return (
  <div
   className="flex flex-col justify-center items-center gap-x-8 font-mono bg-slate-900
  w-screen accent-emerald-600"
  >
   <fieldset
    className="flex flex-col justify-center ml-10 items-start
   bg-[#121c32] border-none rounded-md w-max px-20 py-10"
   >
    <h1
     className="my-4 mx-auto text-4xl text-sky-500 font-bold flex items-center gap-x-2 text-center
    mb-8"
    >
     <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-9 h-9"
     >
      <path
       strokeLinecap="round"
       strokeLinejoin="round"
       d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
      />
     </svg>
     Lista de Tarefas
    </h1>
    <FiltroTarefas filtro={filtro} mudarFiltro={mudarFiltro} />
    <FormularioTarefas adicionarTarefa={adicionarTarefa} />
    <ul className="flex flex-col justify-center items-start ps-4 gap-y-8 h-auto">
     {tarefasFiltradas.map((tarefa, index) => (
      <Tarefa
       key={index}
       index={index}
       tarefa={tarefa}
       removerTarefa={removerTarefa}
       atualizaTarefa={atualizaTarefa}
       mudarCompleto={mudarCompleto}
      />
     ))}
    </ul>
   </fieldset>
  </div>
 );
}

interface FormularioTarefasProps {
 adicionarTarefa: (textoTarefa: string) => void;
}

function FormularioTarefas({ adicionarTarefa }: FormularioTarefasProps) {
 const [valor, setValor] = useState<string>("");

 const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  adicionarTarefa(valor);
  setValor("");
 };

 return (
  <form
   onSubmit={handleSubmit}
   className="flex items-center gap-x-2 mx-auto mt-12"
  >
   <input
    type="text"
    value={valor}
    placeholder="Adicionar tarefa"
    onChange={(event) => setValor(event.target.value)}
    className="border-b border-b-slate-700 px-4 py-2 bg-[#121c32] outline-none text-zinc-50"
   />
   <button
    type="submit"
    id="btn"
    className="bg-emerald-600 rounded-full p-2 focus:bg-inherit
    text-slate-50 flex items-center justify-center border-2 border-emerald-600 
    focus:text-emerald-600 transition-normal
    hover:bg-emerald-700 hover:border-emerald-700 focus:border-emerald-600"
   >
    <svg
     xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 20 20"
     fill="currentColor"
     className="w-5 h-5"
    >
     <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
    </svg>
   </button>
  </form>
 );
}

interface FiltroTarefasProps {
 filtro: Filtro;
 mudarFiltro: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface Filtro {
 todas: boolean;
 completas: boolean;
 incompletas: boolean;
 nome: string;
 filtro: string;
}

function FiltroTarefas({ filtro, mudarFiltro }: FiltroTarefasProps) {
 console.log(
  `Todas: ${filtro.todas} |`,
  `Completas: ${filtro.completas} |`,
  `Incompletas: ${filtro.incompletas}`
 );
 return (
  <div className="flex justify-between items-center gap-x-20 w-available">
   <input
    type="text"
    name="nome"
    value={filtro.nome}
    placeholder="Pesquisar"
    onChange={mudarFiltro}
    id="filtrar-nome"
    className="rounded-full py-1.5 pr-10 pl-10 border outline-none border-slate-700 hover:bg-slate-700
    bg-[#121c32] text-zinc-50"
   />

   <div
    id="filtros-conclusao"
    className="flex items-center gap-x-4 text-zinc-50"
    role="none"
   >
    <div
     className="flex capitalize font-semibold leading-5 ps-4 rounded-md
     items-center justify-center hover:bg-slate-600 border border-slate-600
     hover:border-none gap-x-2 w-max cursor-pointer"
    >
     <input
      type="radio"
      id="todas"
      value="todas"
      name="filtro"
      onChange={mudarFiltro}
      className="bg-current"
      checked={filtro.todas}
     />
     <label className="flex-row w-full p-3 cursor-pointer" htmlFor="todas">
      Todas
     </label>
    </div>

    <div
     className="flex capitalize font-semibold leading-5 ps-4 rounded-md
     items-center justify-center hover:bg-slate-600 border border-slate-600
     hover:border-none gap-x-2 w-max cursor-pointer"
    >
     <input
      type="radio"
      id="completas"
      value="completas"
      name="filtro"
      onChange={mudarFiltro}
      className="bg-current"
      checked={filtro.completas}
     />
     <label className="flex-row w-full p-3 cursor-pointer" htmlFor="completas">
      Completas
     </label>
    </div>

    <div
     className="flex capitalize font-semibold leading-5 ps-4 rounded-md
     items-center justify-center hover:bg-slate-600 border border-slate-600
     hover:border-none gap-x-2 w-max cursor-pointer"
    >
     <input
      type="radio"
      id="incompletas"
      value="incompletas"
      name="filtro"
      onChange={mudarFiltro}
      className="bg-current"
      checked={filtro.incompletas}
     />
     <label
      className="flex-row w-full p-3 cursor-pointer"
      htmlFor="incompletas"
     >
      Incompletas
     </label>
    </div>
   </div>
  </div>
 );
}

interface TarefaProps {
 index: number;
 tarefa: Tarefa;
 removerTarefa: (index: number) => void;
 atualizaTarefa: (index: number, texto: string) => void;
 mudarCompleto: (index: number) => void;
}

function Tarefa({
 index,
 tarefa,
 removerTarefa,
 atualizaTarefa,
 mudarCompleto,
}: TarefaProps) {
 const [editando, setEditando] = useState<boolean>(false);

 const [valor, setValor] = useState<string>(tarefa.texto);

 const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValor(event.target.value);
 };

 const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  atualizaTarefa(index, valor);
  setEditando(false);
 };

 return editando ? (
  <li className="tarefa">
   <form onSubmit={handleSubmit}>
    <input
     type="text"
     value={valor}
     onChange={handleChange}
     className="border-b border-b-slate-700 px-4 py-2 bg-[#121c32] outline-none text-zinc-50 mr-8"
    />
    <button
     type="submit"
     className="bg-emerald-600 rounded-full py-1 px-4 focus:bg-inherit
    text-zinc-50 inline-flex items-center mt-4 gap-x-2 justify-center border-2 border-emerald-600 focus:text-emerald-600
     focus:border-emerald-600 transition-normal hover:bg-emerald-800 hover:border-emerald-800"
    >
     <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-5 h-5"
     >
      <path
       fillRule="evenodd"
       d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
       clipRule="evenodd"
      />
     </svg>
     Salvar
    </button>
   </form>
  </li>
 ) : (
  <li className="inline-flex items-center gap-x-4 leading-4 text-zinc-50">
   <input
    type="checkbox"
    checked={tarefa.concluida}
    onChange={() => mudarCompleto(index)}
   />
   <span>{tarefa.texto}</span>
   <button
    onClick={() => setEditando(true)}
    className="bg-emerald-600 rounded-full py-1 px-4 focus:bg-inherit
    text-zinc-50 inline-flex items-center mt-4 gap-x-2 justify-center border-2 border-emerald-600 focus:text-emerald-600
     focus:border-emerald-600 transition-normal hover:bg-emerald-800 hover:border-emerald-800"
   >
    <svg
     xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 16 16"
     fill="currentColor"
     className="w-5 h-5"
    >
     <path
      fillRule="evenodd"
      d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z"
      clipRule="evenodd"
     />
    </svg>
   </button>
   <button
    onClick={() => removerTarefa(index)}
    className="bg-red-500 rounded-full py-1 px-4 focus:bg-inherit
    text-zinc-50 inline-flex items-center mt-4 gap-x-2 justify-center border-2 border-red-500 focus:text-red-500
     focus:border-red-500 transition-normal hover:bg-red-700 hover:border-red-700"
   >
    <svg
     xmlns="http://www.w3.org/2000/svg"
     viewBox="0 0 20 20"
     fill="currentColor"
     className="w-5 h-5"
    >
     <path
      fillRule="evenodd"
      d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
      clipRule="evenodd"
     />
    </svg>
   </button>
  </li>
 );
}

export default ListaTarefas;
