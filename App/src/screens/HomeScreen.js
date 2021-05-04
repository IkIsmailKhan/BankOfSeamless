import React, { useContext, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import TransferFund from '../components/TransferFund';
import { Context as TransferContext } from '../context/TransferContext';

const HomeScreen = () => {

    const { state, getBalance } = useContext(TransferContext);

    useEffect(() => {
        getBalance()
    }, [])

    return (
        <>
            <SafeAreaView style={styles.container}>
                <Text style={styles.headingText}>BANK OF SEAMLESS</Text>

                <View style={styles.balView}>
                    <Text style={styles.balText}>Balance</Text>
                    <Text style={styles.balValue}>{state.balance}</Text>
                </View>

                <TransferFund />
            </SafeAreaView>
        </>
    )
};

HomeScreen.navigationOptions = {
    headerShown: false
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headingText: {
        textAlign: 'center',
        fontSize: 30,
        padding: 30,
        marginTop: '10%',
    },
    balText: {
        textAlign: 'center',
        fontSize: 22,
        color: 'grey',
        fontWeight: 'bold'
    },
    balValue: {
        textAlign: 'center',
        fontSize: 17,
        color: 'grey',
    },
    balView: {
        marginVertical: 30,
    },
    error: {
        textAlign: 'center',
        fontSize: 15,
        color: 'red',
        marginTop: 30,
    }
});

export default HomeScreen;