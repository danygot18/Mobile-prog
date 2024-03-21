import React from 'react'
import Container from '../../Shared/Container'
import { StyleSheet } from 'react-native'

const Profile = () => {
    return (
        <Container style={styles.container}>
            <Text>Profile</Text>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30
    }
})

export default Profile