import {Alert, PermissionsAndroid, Platform, ScrollView, StatusBar} from 'react-native';
import {FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, Dimensions, Route} from 'react-native';
import {useEffect, useState} from "react";
import {Wallpaper} from "./models/Wallpaper";
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {FAB} from "react-native-paper";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import {createNativeStackNavigator} from "@react-navigation/native-stack";


export default function App() {
    const [data, setData] = useState<Wallpaper[]>([]);
    const url = 'http://10.0.2.2:3000/api'

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(url).then((result) => result.json()).then((result) => {
                setData(result)
            })
        }
        fetchData()
    }, []);


    // @ts-ignore
    const HomeScreen = ({navigation}) => {
        return (
            <SafeAreaView>
                <StatusBar barStyle={"light-content"}/>
                <FlatList data={data} renderItem={({item}) => (

                    <View>
                        <TouchableOpacity style={{flexDirection: 'column', alignItems: 'flex-start'}}
                                          activeOpacity={0.9}
                                          onPress={() => navigation.navigate('DetailScreen', {
                                              url: item.wallpaperLink
                                          })}>
                            <Image source={{uri: item.wallpaperLink}} style={styles.images}/>
                        </TouchableOpacity>
                    </View>

                )}/>
            </SafeAreaView>
        )
    }
    // ts-ignore
    const DetailScreen = ({route}: { route: Route }) => {
        let imageUrl = route.params.url
        console.log(imageUrl)
        return (
            <SafeAreaView>
                <StatusBar barStyle={"light-content"}/>
                <ScrollView>
                    <Image source={{uri: imageUrl}}
                           style={{
                               width: Dimensions.get("window").width,
                               height: Dimensions.get("window").height,
                               resizeMode: 'contain'
                           }}/>

                    <FAB
                        icon='download'
                        small
                        style={styles.fab}
                        onPress={async () => {
                            let isGranted = false;
                            const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
                            const hasPermission = await PermissionsAndroid.check(permission)
                            if (!hasPermission) {
                                isGranted = await PermissionsAndroid.check(permission);
                            } else {
                                isGranted = true
                            }
                            if (Platform.OS === "android" && !isGranted) {
                                return;
                            }
                            const uri = imageUrl
                            let fileUri = FileSystem.documentDirectory + "image.jpg";
                            FileSystem.downloadAsync(uri, fileUri)
                                .then(({uri}) => {
                                    saveFile(uri);
                                }).then(() => Alert.alert("Download successfully!", " Btw, expo-permission has been deprecated!"))
                                .catch(error => {
                                    console.error(error);
                                    Alert.alert("Error", "You already have this image!")
                                })

                            const saveFile = async (fileUri: string) => {
                                const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
                                if (status === "granted") {
                                    const asset = await MediaLibrary.createAssetAsync(fileUri)
                                    await MediaLibrary.createAlbumAsync("Download", asset, false)
                                }
                            }
                        }}
                    />
                </ScrollView>
            </SafeAreaView>
        )
    }


    // @ts-ignore
    const AnimeScreen = ({navigation}) => {
        return (
            <SafeAreaView>
                <StatusBar barStyle={"light-content"}/>
                <FlatList data={data.filter(value => value.wallpaperKind === 'Anime')} renderItem={({item}) => (

                    <View>
                        <TouchableOpacity style={{flexDirection: 'column', alignItems: 'flex-start'}}
                                          activeOpacity={0.9}
                                          onPress={() => navigation.navigate('DetailScreen', {
                                              url: item.wallpaperLink
                                          })}>
                            <Image source={{uri: item.wallpaperLink}} style={styles.images}/>
                        </TouchableOpacity>
                    </View>

                )}/>
            </SafeAreaView>
        )
    }
    //
    // @ts-ignore
    const NatureScreen = ({navigation}) => (
        <SafeAreaView>
            <StatusBar barStyle={"light-content"}/>
            <FlatList data={data.filter(value => value.wallpaperKind === 'Nature')} renderItem={({item}) => (

                <View>
                    <TouchableOpacity style={{flexDirection: 'column', alignItems: 'flex-start'}}
                                      activeOpacity={0.9}
                                      onPress={() => navigation.navigate('DetailScreen', {
                                          url: item.wallpaperLink
                                      })}>
                        <Image source={{uri: item.wallpaperLink}} style={styles.images}/>
                    </TouchableOpacity>
                </View>

            )}/>
        </SafeAreaView>
    )
    //
    // @ts-ignore
    const Dota2Screen = ({navigation}) => (
        <SafeAreaView>
            <StatusBar barStyle={"light-content"}/>
            <FlatList data={data.filter(value => value.wallpaperKind === 'Dota2')} renderItem={({item}) => (

                <View>
                    <TouchableOpacity style={{flexDirection: 'column', alignItems: 'flex-start'}}
                                      activeOpacity={0.9}
                                      onPress={() => navigation.navigate('DetailScreen', {
                                          url: item.wallpaperLink
                                      })}>
                        <Image source={{uri: item.wallpaperLink}} style={styles.images}/>
                    </TouchableOpacity>
                </View>

            )}/>
        </SafeAreaView>
    )


    // @ts-ignore

    const Drawer = createDrawerNavigator()
    const Stack = createNativeStackNavigator()
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={HomeScreen} options={{title: 'Trang chủ'}}/>
                <Drawer.Screen name="DetailScreen" component={DetailScreen}
                               options={{title: 'Chi tiết', drawerItemStyle: {height: 0}}}/>
                <Drawer.Screen name="Anime" component={AnimeScreen} options={{title: 'Anime'}}/>
                <Drawer.Screen name="Nature" component={NatureScreen}/>
                <Drawer.Screen name="Dota2" component={Dota2Screen}/>
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingStart: 8,
        paddingEnd: 8,
        paddingTop: 8
    },
    images: {
        width: '100%',
        height: 300,
        marginRight: 8,
        marginBottom: 16
    },
    item: {
        backgroundColor: 'green',
        width: 100,
        height: 100
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
    detailScreen: {
        padding: 16
    }
})









