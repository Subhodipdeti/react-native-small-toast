import { Platform } from 'react-native';
const bottom = Platform.select({ ios: 30, android: 10 });

export default styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        margin: 10,
        marginBottom: bottom
    },
    messageText: {
        fontSize: 15,
        color: "#007AFF"
    },
    subView: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        backgroundColor: "#000"
    }
}