import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';
import { images } from '../../constants';

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setSubmitting] = useState(false);

  const sumbit = () => {
    if (form.email === '' || form.password === '') {
      Alert.alert('Error', 'Please fill in all fields');
    }

    setSubmitting(true);

    try {
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image source={images.logo} className="w-[130px] h-[35px] mb-4" resizeMode="contain" />
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Log in to Aora</Text>

          <FormField title="Email" value={form.email} handleChangeText={e => setForm(f => ({ ...f, email: e }))} otherStyles="mt-7" keybordType="email-address" />
          <FormField title="Password" value={form.password} handleChangeText={e => setForm(f => ({ ...f, password: e }))} otherStyles="mt-7" />

          <CustomButton title="Sign In" handlePress={sumbit} containerStyles="mt-7" isLoading={isSubmitting} />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">Don't have an account?</Text>
            <Link href="/sign-up" className="text-lg font-psemibold text-secondary">
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;