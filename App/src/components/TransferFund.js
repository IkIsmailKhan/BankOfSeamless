import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Button, Text, FlatList } from 'react-native';
import { Input } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { Context as TransferContext } from '../context/TransferContext';

const TransferFund = () => {

    const { state, ibanVerify, getBankDetails, getCurrencies } = useContext(TransferContext);

    const [currency, setCurrency] = useState('AED');
    const [iban, setIban] = useState();
    const [amount, setAmount] = useState();

    useEffect(() => {
        getCurrencies()
    }, [])

    console.log(state.bankLogo)

    return (
        <View style={styles.container}>
            <Input
                label='IBAN'
                value={iban}
                onChangeText={setIban}
                style={styles.ibanStyle}
                placeholder='Enter The Destination IBAN'
            />

            <View style={styles.bankDetails}>
                <Text>{state.bankName}</Text>
                <Text style={{ marginRight: 10 }}>{state.bankImage}Image</Text>

            </View>

            <Input
                label='Amount'
                value={amount}
                onChangeText={setAmount}
                style={styles.amountStyle}
                placeholder={currency}
                errorMessage={state.error}
            />

            <Picker
                selectedValue={currency}
                onValueChange={currentCurrency => setCurrency(currentCurrency)}>
                <Picker.Item label="EUR" value="EUR" />
                <Picker.Item label="AED" value="AED" />
                <Picker.Item label="PKR" value="PKR" />
            </Picker>

            <Button
                title='TRANSFER'
                onPress={() => ibanVerify({ iban, amount, currency }, getBankDetails({ iban }))}
            />

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        padding: 5
    },
    ibanStyle: {
        marginTop: 5,
    },
    amountStyle: {
        marginTop: 5,
    },
    bankDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 10,
        marginBottom: 40,
    },
    bankImage: {
        height: 20,
        width: 20,
    },
});

export default TransferFund;