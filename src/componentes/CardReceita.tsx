import React from "react";  
import { View, Text, Image, StyleSheet } from "react-native";


function CardReceita(props: { imagem: any; titulo: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; tempo: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; porcoes: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; dificuldade: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }){
    return(
        <View style={styles.card}>
        <Image source={{ uri: props.imagem }} style={styles.imagem} />
        <View style={styles.infoContainer}>
            <Text style={styles.titulo}>{props.titulo}</Text>
            <View style={styles.detailsContainer}>
                <Text style={styles.detail}>{props.tempo}</Text>
                <Text style={styles.detail}>{props.porcoes} porções</Text>
                <Text style={styles.detail}>{props.dificuldade}</Text>
            </View>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 16,
    },
    imagem: {
        width: 100,
        height: 100,
    },
    infoContainer: {
        flex: 1,
        padding: 8,
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    detailsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detail: {
        marginRight: 8,
        color: '#555',
    },
});

export default CardReceita;