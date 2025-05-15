import React, { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as yup from 'yup'
import { createReview } from '../../api/RestaurantEndpoints'
import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { showMessage } from 'react-native-flash-message'
import { ErrorMessage, Formik } from 'formik'
import TextError from '../../components/TextError'

export default function CreateReviewScreen ({ navigation,route }) {
  const [backendErrors, setBackendErrors] = useState()
  const restaurantId = route.params.id

  const initialRestaurantValues = { stars: 0, body: null }
  const validationSchema = yup.object().shape({
    stars: yup
      .number()
      .positive()
      .integer()
      .min(0,'Stars must be an integer between 0 and 5')
      .max(5,'Stars must be an integer between 0 and 5')
      .required('Stars rating is required'),
    body: yup
      .string()
      .nullable()
  })

  const createNewReview = async (values) => {
    setBackendErrors([])
    console.log('Values: ', values)
    try {
      const createdReview = await createReview(restaurantId, values)
      console.log('Review: ', createdReview)
      showMessage({
        message: `Review succesfully created`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      navigation.navigate('ControlPanelScreen', {  id: route.params.id ,dirty: true })
    } catch (error) {
      console.log(error)
      setBackendErrors(error.errors)
    }
  }
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialRestaurantValues}
      onSubmit={createNewReview}>
      {({ handleSubmit, setFieldValue, values }) => (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '60%' }}>
              <InputItem
                name='stars'
                label='Stars:'
              />
              <InputItem
                name='body'
                label='Body:'
              />
              
              <ErrorMessage name={'restaurantCategoryId'} render={msg => <TextError>{msg}</TextError> }/>

              {backendErrors &&
                backendErrors.map((error, index) => <TextError key={index}>{error.param}-{error.msg}</TextError>)
              }

              <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandSuccessTap
                      : GlobalStyles.brandSuccess
                  },
                  styles.button
                ]}>
              <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                <MaterialCommunityIcons name='content-save' color={'white'} size={20}/>
                <TextRegular textStyle={styles.text}>
                  Save
                </TextRegular>
              </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginLeft: 5
  },
  imagePicker: {
    height: 40,
    paddingLeft: 10,
    marginTop: 20,
    marginBottom: 80
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 5
  }
})
