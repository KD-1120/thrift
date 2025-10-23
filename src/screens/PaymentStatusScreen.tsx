import React from 'react';
import { View, Text } from 'react-native';

const PaymentStatusScreen = ({ route }) => {
  const { status } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>
        {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
      </Text>
    </View>
  );
};

export default PaymentStatusScreen;
