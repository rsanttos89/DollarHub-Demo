import { Alert } from "react-native";
import { useState, useEffect } from "react";

interface SelectResponse {
  total_coin: string;
  results: any[];
  success: boolean;
  message: string;
  data?: any;
}

interface DetailsFunctions {
  select: () => Promise<SelectResponse>;
}

function details({ user_id, monthYear, whichTable, page }: { user_id: string, monthYear: string, whichTable: string, page: number }): DetailsFunctions {
  async function select(): Promise<SelectResponse> {
    try {
      const response = await fetch(`https://url_aqui/apps/dollarhub/select/details/${monthYear}.php?user_id=${user_id}&which_table=${whichTable}&page=${page}`, {
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
    }
  }

  return {
    select,
  };
}

export default details;