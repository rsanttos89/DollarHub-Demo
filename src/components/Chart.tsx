import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Text } from 'react-native-svg';

const DonutChart = ({ response }) => {
  try {
    const totalAmount =
      (response.total_coin_active || 0) -
      (response.total_coin_liabilities || 0) -
      (response.total_coin_fixed_expenses || 0);

    const formattedAmount = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(totalAmount);

    // Verifica se totalAmount é zero antes de calcular as porcentagens
    const ativosPercentage = totalAmount !== 0 ? Math.max(((response.total_coin_active || 0) / totalAmount) * 100, 0) : 0;
    const passivosPercentage = totalAmount !== 0 ? Math.max(((response.total_coin_liabilities || 0) / totalAmount) * 100, 0) : 0;
    const despesasFixasPercentage = totalAmount !== 0 ? Math.max(((response.total_coin_fixed_expenses || 0) / totalAmount) * 100, 0) : 0;

    // Cria um array com as porcentagens e cores
    const data = [
      { percentage: ativosPercentage, color: '#41C7E0' },
      { percentage: passivosPercentage, color: '#E06E41' },
      { percentage: despesasFixasPercentage, color: '#835BF2' },
    ].filter(item => item.percentage > 0); // Remove elementos com porcentagem zero

    // Se todos os valores forem zero, adiciona um elemento com 100%
    if (data.length === 0) {
      const color = totalAmount < 0 ? '#ff0000' : '#000';
      data.push({ percentage: 100, color: color });
    } else {
      // Se apenas um valor não for zero, define sua porcentagem como 100
      if (data.length === 1) {
        data[0].percentage = 100;
      } else {
        // Divide 100 pelas porcentagens não nulas
        const nonZeroPercentages = data.map(item => item.percentage);
        const totalNonZeroPercentage = nonZeroPercentages.reduce((acc, curr) => acc + curr, 0);
        data.forEach(item => {
          item.percentage = (item.percentage / totalNonZeroPercentage) * 100;
        });
      }
    }

    const radius = 110;
    const strokeWidth = 8;
    const centerX = 250;
    const centerY = 125;

    const calculateCoordinates = (angle) => {
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return { x, y };
    };

    const createPath = (startAngle, endAngle) => {
      const start = calculateCoordinates(startAngle);
      const end = calculateCoordinates(endAngle);

      const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';

      return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
    };

    let currentAngle = 0;

    const paths = data.map((segment) => {
      const startAngle = currentAngle;
      currentAngle += (segment.percentage / 100) * (2 * Math.PI);
      const endAngle = currentAngle;

      return createPath(startAngle + 0.00001, endAngle);
    });

    const totalText = 'SALDO';
    const totalTextDolar = 'BRL';
    let textColor = totalAmount < 0 ? '#ff0000' : '#fff';

    return (
      <View style={{ paddingVertical: 16 }}>
        <Svg height="250" width="500">
          {paths.map((path, index) => (
            <Path
              key={index}
              d={path}
              fill="transparent"
              stroke={data[index].color}
              strokeWidth={strokeWidth}
            />
          ))}

          <Circle
            cx={centerX}
            cy={centerY}
            r={radius - strokeWidth / 2}
            fill="#242425"
          />

          <Text
            fontWeight={"900"}
            x={centerX}
            y={centerY - 20}
            textAnchor="middle"
            fontSize="13"
            fill="#ccc"
          >
            {totalText}
          </Text>

          <Text
            fontWeight={"900"}
            x={centerX}
            y={centerY + 10}
            textAnchor="middle"
            fontSize="24"
            fill={textColor}
          >
            {formattedAmount}
          </Text>

          <Text
            fontWeight={"900"}
            x={centerX}
            y={centerY + 35}
            textAnchor="middle"
            fontSize="16"
            fill="#ccc"
          >
            {totalTextDolar}
          </Text>
        </Svg>
      </View>
    );
  } catch (error) {
    console.error("Erro no componente DonutChart:", error);
    // Adicione aqui qualquer tratamento de erro adicional, se necessário
    return null;
  }
};

export default DonutChart;
