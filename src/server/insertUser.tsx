import { Alert } from "react-native";

function form({ id, email, name, given_name, family_name, picture }) {
  async function insertUser() {
    try {
      const response = await fetch(`https://url_aqui/apps/dollarhub/insert/users.php`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          id,
          email,
          name,
          given_name,
          family_name,
          picture
        })
      });

      const responseJson = await response.json();

      if (responseJson.success) {
        // Dados inseridos com sucesso
        return { success: true, message: "Dados inseridos com sucesso." };
      } else {
        // Erro ao inserir dados
        return { success: false, message: "Erro ao inserir dados: " + responseJson.message };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "Ocorreu um erro ao processar a solicitação." };
    }
  }

  return {
    insertUser
  };
}

export default form;