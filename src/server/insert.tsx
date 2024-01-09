import { Alert } from "react-native";

interface InsertResponse {
  success: boolean;
  message: string;
}

function form({ id, descriptions, category, coin, registrationDate, whichTable }) {
  async function insert() {
    try {
      const response = await fetch(`https://url_aqui/apps/dollarhub/insert/${whichTable}.php`, {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          id,
          descriptions,
          category,
          coin,
          registrationDate,
          whichTable,
          userId:id
        })
      });
  
      const responseJson: InsertResponse = await response.json();
  
      if (responseJson.success) {
        console.log("Sucessoo!", responseJson.message);
      } else {
        Alert.alert("Erro!", responseJson.message);
      }
  
      return responseJson;
    } catch (error) {
      console.error(error);
      Alert.alert("Erro!", "Ocorreu um erro ao processar a solicitação.");
      return { success: false, message: "Erro desconhecido" };
    }
  }

  return {
    insert
  };
}

export default form;