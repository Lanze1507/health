import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { useState } from 'react';

import { Colors } from '../../constants';

import { preguntarIA } from '../../services/geminiService';

export default function IAScreen() {

  const [pregunta, setPregunta] =
    useState('');

  const [respuesta, setRespuesta] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  async function enviar() {

    if (!pregunta.trim()) return;

    setLoading(true);

    try {

      const texto =
        await preguntarIA(pregunta);

      setRespuesta(texto);

    } catch (error) {

  console.log(error);

  setRespuesta(
    String(error)
  );

}

    setLoading(false);
  }

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scroll}
    >

      <Text style={styles.title}>
        🤖 Coach IA
      </Text>

      <Text style={styles.subtitle}>
        Haz preguntas sobre ejercicio y fitness
      </Text>

      <TextInput
        style={styles.input}
        value={pregunta}
        onChangeText={setPregunta}
        placeholder="¿Cómo puedo ganar músculo?"
        placeholderTextColor="#777"
        multiline
      />

      <TouchableOpacity
        style={styles.button}
        onPress={enviar}
      >

        <Text style={styles.buttonText}>
          Preguntar
        </Text>

      </TouchableOpacity>

      {loading && (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{ marginTop: 20 }}
        />
      )}

      {!!respuesta && (

        <View style={styles.responseCard}>

          <Text style={styles.responseText}>
            {respuesta}
          </Text>

        </View>

      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  scroll: {
    padding: 24,
    paddingTop: 60,
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.text,
  },

  subtitle: {
    color: Colors.textSecondary,
    marginTop: 6,
    marginBottom: 20,
  },

  input: {
    minHeight: 120,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  button: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },

  responseCard: {
    marginTop: 24,
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  responseText: {
    color: Colors.text,
    lineHeight: 24,
  },

});