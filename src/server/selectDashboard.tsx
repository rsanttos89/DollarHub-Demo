import { Alert } from "react-native";
import { useState, useEffect } from "react";

interface SelectResponse {
  success: boolean;
  message: string;
  data?: any; // Pode ser ajustado conforme a estrutura real dos dados
}

interface DashboardFunctions {
  select: () => Promise<SelectResponse>;
}

function dashboard({ user_id, monthYear }: { user_id: string, monthYear: string }): DashboardFunctions {
  async function select(): Promise<SelectResponse> {
    try {
      const response = await fetch(`https://url_aqui/apps/dollarhub/select/dashboard/${monthYear}.php?user_id=${user_id}`, {
        method: 'get',
      });

      const responseJson: SelectResponse = await response.json();

      if (responseJson.success) {
        console.log("Sucesso!", responseJson.message);
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
    select,
  };
}

export default dashboard;