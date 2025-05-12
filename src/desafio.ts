// app.js
type User = {
  nome: string;
  idade: number;
  email: string;
};
function criarUsuario2({ nome, idade, email }: User) {
  return {
    nome,
    idade,
    email: email,
  };
}

function exibirUsuario2(usuario: User) {
  console.log(
    `Usuário: ${usuario.nome} (${usuario.idade} anos) - ${usuario.email}`
  );
}

const usuarios2 = [
  criarUsuario2({nome:"Alice", idade:25, email:"alice@example.com"}),
  criarUsuario2({nome:"Bob", idade:30, email:"bob@example.com"}),
];

usuarios2.forEach(exibirUsuario2);
