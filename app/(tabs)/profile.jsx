import { View, FlatList, Image, RefreshControl, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images, icons } from '@constants';
import EmptyState from '@components/EmptyState';
import { getUserPosts } from '@lib/appwrite';
import useAppWrite from '@lib/useAppWrite';
import VideoCard from '@components/VideoCard';
import InfoBox from '@components/InfoBox';
import { router } from 'expo-router';
import { useGlobalContext } from '@context/GlobalProvider';
import { TouchableOpacity } from 'react-native';
import { signOut } from '@lib/appwrite';



const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const { data: posts , refetch} = useAppWrite(() => getUserPosts(user.$id));
  const [refreshing, setRefreshing] = useState(false)
  const logout = async () => {
    await signOut();  

    router.replace("/sign-in");
  } 

  
  const onRefresh = async () => {
    setRefreshing(true)
    await refetch();
    setRefreshing(false)
  }
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={( item ) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title} // Title of the video post
            creator={item.creator?.username} // Creator's username
            avatar={item.creator?.avatar} // Avatar image URL
            thumbnail={item.thumbnail} // Thumbnail image URL
            video={item.video} // Video URL
          />
        )}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
          <TouchableOpacity
            onPress={logout}
            className="flex w-full items-end mb-10"
          >
            <Image
              source={icons.logout}
              resizeMode="contain"
              className="w-6 h-6"
            />
          </TouchableOpacity>

          <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
            <Image
              source={{ uri: user?.avatar }}
              className="w-[90%] h-[90%] rounded-lg"
              resizeMode="cover"
            />
          </View>

          <InfoBox
            title={user?.username}
            containerStyles="mt-5"
            titleStyles="text-lg"
          />

          <View className="mt-5 flex flex-row">
            <InfoBox
              title={posts.length || 0}
              subtitle="Posts"
              titleStyles="text-xl"
              containerStyles="mr-10"
            />
            <InfoBox
              title="1.2k"
              subtitle="Followers"
              titleStyles="text-xl"
            />
          </View>
        </View>
        )}
        ListEmptyComponent={() => (
         <EmptyState
          title="No Videos Found"
          subtitle="No Videos found for this search"
         />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      
    </SafeAreaView>
  )
}

export default Profile