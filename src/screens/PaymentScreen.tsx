import React, { useState } from 'react';
import { View, Text, Button, Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import { initializePayment } from '../api/payments.api';

const PaymentScreen = ({ navigation, route }) => {
  const { orderId } = route.params;
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [showWebView, setShowWebView] = useState<boolean>(false);

  const handlePayment = async () => {
    try {
      const data = await initializePayment(orderId);
      setPaymentUrl(data.authorization_url);
      setShowWebView(true);
    } catch (error) {
      console.error('Payment initialization failed:', error);
    }
  };

  const handleNavigationStateChange = (navState) => {
    if (navState.url.includes('payment/success')) {
      setShowWebView(false);
      navigation.navigate('PaymentStatus', { status: 'success' });
    } else if (navState.url.includes('payment/failure')) {
      setShowWebView(false);
      navigation.navigate('PaymentStatus', { status: 'failure' });
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Order Summary</Text>
      <Button title="Pay Now" onPress={handlePayment} />

      <Modal visible={showWebView} onRequestClose={() => setShowWebView(false)}>
        {paymentUrl && (
          <WebView
            source={{ uri: paymentUrl }}
            onNavigationStateChange={handleNavigationStateChange}
          />
        )}
      </Modal>
    </View>
  );
};

export default PaymentScreen;
