let { Form, Table, Button } = ReactBootstrap;
// Documentação do Bootstrap utilizado: https://react-bootstrap.github.io/

const { useState } = React;

function App() {
  let itensTabela = [
    {
      id: 1,
      dataCadastro: "2020-12-01",
      valor: 34.5,
      telefone: "27998874625",
      permiteEdicao: false
    },
    {
      id: 2,
      dataCadastro: "2020-12-04",
      valor: 31.56,
      telefone: "27998534625",
      permiteEdicao: true
    },
    {
      id: 3,
      dataCadastro: "2021-01-23",
      valor: 124.1,
      telefone: "32998544641",
      permiteEdicao: true
    },
    {
      id: 4,
      dataCadastro: "2021-04-18",
      valor: 242.99,
      telefone: "2733199546",
      permiteEdicao: true
    }
  ];

  const [showForm, setShowForm] = useState(false);
  const [valueID, setValueID] = useState(0);
  const [valueDataCadastro, setValueDataCadastro] = useState("00/00/0000");
  const [valueTelefone, setValueTelefone] = useState("");
  const [valueValor, setValueValor] = useState("");

  return (
    <>
      <Form className={!showForm && "hidden"} style={{ marginBottom: "25px" }}>
        <h4>Editando Registro</h4>
        <div className="row mb-2">
          <div className="col-sm-2">
            <Form.Group>
              <Form.Label>ID</Form.Label>
              <Form.Control type="text" value={valueID} readOnly />
            </Form.Group>
          </div>
          <div className="col-sm-3">
            <Form.Group>
              <Form.Label>Data de Cadastro</Form.Label>
              <Form.Control type="text" value={valueDataCadastro} readOnly />
            </Form.Group>
          </div>
          <div className="col-sm-2">
            <Form.Group>
              <Form.Label>Valor (R$)</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => {
                  e.preventDefault();
                  setValueValor(e.target.value);
                }}
                value={valueValor}
              />
            </Form.Group>
          </div>
          <div className="col-sm-3">
            <Form.Group>
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => {
                  e.preventDefault();
                  setValueTelefone(e.target.value);
                }}
                value={valueTelefone}
              />
            </Form.Group>
          </div>
          <div className="col-sm-2">
            <Button variant="success">Alterar</Button>
          </div>
        </div>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Data de Cadastro</th>
            <th>Valor (R$)</th>
            <th>Telefone</th>
          </tr>
        </thead>
        <tbody>
          {itensTabela.map((item, index) => {
            return (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.dataCadastro}</td>
                <td>{item.valor}</td>
                <td>{item.telefone}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
