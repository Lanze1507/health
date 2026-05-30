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

  const [mensajes, setMensajes] = useState<
    { tipo: 'user' | 'bot'; texto: string }[]
  >([
    {
      tipo: 'bot',
      texto:
        'Hola 👋 Soy HealthUp Coach. Puedo ayudarte con fitness, nutrición, tecnología, estudios y cualquier duda que tengas. 💪',
    },
  ]);

  const [loading, setLoading] =
    useState(false);

  const [escribiendo, setEscribiendo] =
    useState(false);

  async function enviar() {

    if (!pregunta.trim()) return;

    const preguntaActual = pregunta;

    setMensajes((prev) => [
      ...prev,
      {
        tipo: 'user',
        texto: preguntaActual,
      },
    ]);

    setPregunta('');
    setLoading(true);
    setEscribiendo(true);

    try {

      const texto =
        await preguntarIA(preguntaActual);

      setMensajes((prev) => [
        ...prev,
        {
          tipo: 'bot',
          texto,
        },
      ]);

    } catch (error) {

      console.log(error);

      setMensajes((prev) => [
        ...prev,
        {
          tipo: 'bot',
          texto:
            'Ocurrió un error al consultar la IA.',
        },
      ]);

    } finally {

      setEscribiendo(false);
      setLoading(false);

    }
  }

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >

      <Text style={styles.title}>
        🤖 HealthUp Coach
      </Text>

      <Text style={styles.subtitle}>
        Tu asistente inteligente personal
      </Text>

      <TextInput
        style={styles.input}
        value={pregunta}
        onChangeText={setPregunta}
        placeholder="Escribe tu pregunta..."
        placeholderTextColor="#777"
        multiline
      />

      <TouchableOpacity
        style={styles.button}
        onPress={enviar}
        disabled={loading}
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

      <View style={styles.chatContainer}>

        {mensajes.map((msg, index) => (

          <View
            key={index}
            style={[
              styles.message,
              msg.tipo === 'user'
                ? styles.userMessage
                : styles.botMessage,
            ]}
          >

            <Text style={styles.messageText}>
              {msg.tipo === 'user'
                ? '👤 '
                : '🤖 '}
              {msg.texto}
            </Text>

          </View>

        ))}

        {escribiendo && (

          <View
            style={[
              styles.message,
              styles.botMessage,
            ]}
          >

            <Text style={styles.messageText}>
              🤖 HealthUp Coach está escribiendo...
            </Text>

          </View>

        )}

      </View>

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
    paddingBottom: 120,
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

  chatContainer: {
    marginTop: 24,
    gap: 12,
  },

  message: {
    padding: 14,
    borderRadius: 16,
  },

  userMessage: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },

  botMessage: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },

  messageText: {
    color: Colors.text,
    lineHeight: 22,
  },

});