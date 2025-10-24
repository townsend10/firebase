const { Form, Container, Row, Col } = ReactBootstrap;
const { useState } = React;

function App() {
  const [cep, setCep] = useState("");
  // Estado para armazenar os dados do endereço.
  const [addressData, setAddressData] = useState({
    logradouro: "",
    bairro: "",
    localidade: "", // Renomeado de cidade para corresponder à API ViaCEP
    uf: "",
    pais: "Brasil", // Valor padrão
  });
  // Estado para controlar a editabilidade de cada campo.
  const [isReadOnly, setIsReadOnly] = useState({
    logradouro: false,
    bairro: false,
    localidade: false,
    uf: false,
    pais: true, // País inicia como readOnly, pois tem um valor padrão
  });
  const [cepError, setCepError] = useState(""); // Estado para mensagens de erro do CEP

  // Função para validar o formato do CEP
  const validateCep = (cepValue) => {
    const cleanedCep = cepValue.replace(/\D/g, ''); // Remove caracteres não numéricos
    const cepRegex = /^[0-9]{8}$/;
    return cepRegex.test(cleanedCep);
  };

  // Handler para a mudança no input do CEP
  const handleCepChange = (event) => {
    const newCep = event.target.value;
    setCep(newCep);
    setCepError(""); // Limpa o erro ao digitar
    // Limpa os campos se o CEP for apagado
    if (newCep.length === 0) {
      resetAddressFields(false); // Torna todos editáveis
    }
  };

  // Função para resetar os campos de endereço e sua editabilidade
  const resetAddressFields = (readOnlyStatus) => {
    setAddressData({
      logradouro: "",
      bairro: "",
      localidade: "",
      uf: "",
      pais: "Brasil",
    });
    setIsReadOnly({
      logradouro: readOnlyStatus,
      bairro: readOnlyStatus,
      localidade: readOnlyStatus,
      uf: readOnlyStatus,
      pais: readOnlyStatus, // Define como readOnly com base no status geral
    });
  };

  // Função para buscar o endereço na API ViaCEP
  const fetchAddress = async () => {
    const cleanedCep = cep.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (!validateCep(cleanedCep)) {
      setCepError("CEP inválido. Digite 8 números.");
      resetAddressFields(false); // Deixa todos os campos editáveis
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setCepError("CEP não encontrado.");
        resetAddressFields(false); // Deixa todos os campos editáveis
      } else {
        setCepError(""); // Limpa qualquer erro anterior

        // Preenche os dados do endereço com os valores da API
        const newAddressData = {
          logradouro: data.logradouro || "",
          bairro: data.bairro || "",
          localidade: data.localidade || "",
          uf: data.uf || "",
          pais: "Brasil", // ViaCEP não retorna país, mantém padrão
        };
        setAddressData(newAddressData);

        // Define a editabilidade dos campos
        setIsReadOnly({
          logradouro: !!data.logradouro, // true se logradouro existe e não é vazio
          bairro: !!data.bairro,
          localidade: !!data.localidade,
          uf: !!data.uf,
          pais: true, // País sempre preenchido com "Brasil", então é readOnly
        });
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
      setCepError("Erro ao buscar CEP. Tente novamente.");
      resetAddressFields(false); // Deixa todos os campos editáveis em caso de erro na requisição
    }
  };

  // Handler para a mudança dos campos de endereço (para campos editáveis)
  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <Container className="p-4 bg-white rounded-lg shadow-md mt-5">
      <h2 className="mb-4 text-center text-primary">Consulta de Endereço</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>CEP:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite um CEP válido (ex: 29000000)"
            value={cep}
            onChange={handleCepChange}
            onBlur={fetchAddress} // Dispara a busca ao perder o foco
            maxLength={9} // CEP + hífen opcional
          />
          {cepError && <Form.Text className="text-danger">{cepError}</Form.Text>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Endereço:</Form.Label>
          <Form.Control
            type="text"
            name="logradouro"
            value={addressData.logradouro}
            readOnly={isReadOnly.logradouro}
            onChange={handleAddressInputChange}
            placeholder="Logradouro"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Bairro:</Form.Label>
          <Form.Control
            type="text"
            name="bairro"
            value={addressData.bairro}
            readOnly={isReadOnly.bairro}
            onChange={handleAddressInputChange}
            placeholder="Bairro"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Cidade:</Form.Label>
          <Form.Control
            type="text"
            name="localidade"
            value={addressData.localidade}
            readOnly={isReadOnly.localidade}
            onChange={handleAddressInputChange}
            placeholder="Cidade"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>UF:</Form.Label>
          <Form.Control
            type="text"
            name="uf"
            value={addressData.uf}
            readOnly={isReadOnly.uf}
            onChange={handleAddressInputChange}
            placeholder="UF"
            maxLength={2}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>País:</Form.Label>
          <Form.Control
            type="text"
            name="pais"
            value={addressData.pais}
            readOnly={isReadOnly.pais}
            onChange={handleAddressInputChange}
          placeholder="País" 
          />
        </Form.Group>
      </Form>
    </Container>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
