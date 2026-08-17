import React from 'react'
import { PropsWithChildren } from 'react';

import { StyleProp, View, ViewStyle } from "react-native";


export const Container = ({children, style = {}}:PropsWithChildren & {style?:StyleProp<ViewStyle>})=>{
    return(
        <View style={[{
            backgroundColor: "#fff",
            padding: 5,
            margin: 5,
            borderRadius: 8,
            elevation: 5,
            shadowColor: "#000",
            shadowOpacity: 0.9,
            shadowRadius: 10,
        }, style]}>
            {children}
        </View>
    )
}