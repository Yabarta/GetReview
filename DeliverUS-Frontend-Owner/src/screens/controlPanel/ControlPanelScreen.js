import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Pressable, FlatList } from 'react-native'
import TextRegular from '../../components/TextRegular'
import ImageCard from '../../components/ImageCard'
import { showMessage } from 'react-native-flash-message'
import { API_BASE_URL } from '@env'
import { getReviews } from '../../api/RestaurantEndpoints'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as GlobalStyles from '../../styles/GlobalStyles'
import restaurantLogo from '../../../assets/restaurantLogo.jpeg'

export default function ControlPanelScreen ({navigation,route}) {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
  if (route.params?.id) {
    fetchReviews()
  } else {
    showMessage({
      message: 'Restaurant ID is missing.',
      type: 'error',
      style: GlobalStyles.flashStyle,
      titleStyle: GlobalStyles.flashTextStyle
    })
  }
}, [route])

  const fetchReviews = async () => {
    try {
      const fetchedReviews = await getReviews(route.params.id)
      console.log('Reviews: ',fetchedReviews)
      setReviews(fetchedReviews)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving the reviews (Restaurant Id ${route.params.id}). ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const renderHeader = () => {
    <View>
      <TextRegular style={styles.title}>
        Reviews
      </TextRegular>
    </View>
  }

  const renderEmptyReviewList = () => {
      return (
        <TextRegular textStyle={styles.emptyList}>
          This restaurant has no reviews yet.
        </TextRegular>
      )
    }
  
    const renderReviews = ({ item }) => {
      console.log('Review: ', item)
    return (
      <View>
        <TextRegular style = {styles.stars}>Stars: {item.stars}</TextRegular>
        <TextRegular style = {styles.text}>{item.body}</TextRegular>
      </View>
    )
  }

  return (
    <View style = {styles.container}>
        <FlatList
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyReviewList}
          data={reviews}
          renderItem={renderReviews}
          keyExtractor={item => item.id.toString()}
        />
    </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  containerReview: {
    flex: 1,
    backgroundColor: 'grey',
    borderRadius: 15,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 48,
    color: 'black',
    fontWeight:'bold',
    alignSelf: 'center',
    marginLeft: 5
  },
  text: {
    fontSize: 16,
    color: 'black',
    alignSelf: 'center',
    marginLeft: 5
  },
  stars: {
    fontSize: 18,
    color: 'gold',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginLeft: 5
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  },
})
