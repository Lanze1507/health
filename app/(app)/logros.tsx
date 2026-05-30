import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';

import { useEffect, useState } from 'react';

import { Colors } from '../../constants';

import { useAuth } from '../../hooks/useAuth';

import { getDashboardStats } from '../../services/dashboardService';
import {
  obtenerMonedas,
  guardarMonedas,
  obtenerXP,
  guardarXP,
} from '../../services/recompensasService';

import {
  obtenerLogros,
  Logro,
} from '../../services/logrosService';

export default function LogrosScreen() {

  const TITULOS_NIVEL = {
  1: 'Principiante',
  2: 'Constante',
  3: 'Atleta',
  4: 'Experto',
  5: 'Leyenda',
};

  const { session } = useAuth();

  const [logros, setLogros] =
    useState<Logro[]>([]);

  const [monedas, setMonedas] =
    useState(0);
    const [nivel, setNivel] =
  useState(1);

const [xpActual, setXpActual] =
  useState(0);

const [xpSiguiente, setXpSiguiente] =
  useState(500);

  const [reclamados, setReclamados] =
    useState<string[]>([]);

  const [animando, setAnimando] =
    useState(false);

  // Reclamar recompensa
  function reclamarLogro(logroId: string) {

  if (reclamados.includes(logroId)) {
    return;
  }

  setAnimando(true);

  setTimeout(() => {

    setAnimando(false);

    const nuevasMonedas =
  monedas + 500;





    setMonedas(nuevasMonedas);
    guardarMonedas(nuevasMonedas);

const nuevoXP =
  xpActual + 500;

setXpActual(nuevoXP);

guardarXP(nuevoXP);

    setXpActual(nuevasMonedas);

    if (nuevasMonedas >= 3500) {
      setNivel(5);
      setXpSiguiente(5000);
    }
    else if (nuevasMonedas >= 2000) {
      setNivel(4);
      setXpSiguiente(3500);
    }
    else if (nuevasMonedas >= 1000) {
      setNivel(3);
      setXpSiguiente(2000);
    }
    else if (nuevasMonedas >= 500) {
      setNivel(2);
      setXpSiguiente(1000);
    }
    else {
      setNivel(1);
      setXpSiguiente(500);
    }

    setReclamados((prev) => [
      ...prev,
      logroId,
    ]);

  }, 1500);

}

  // Cargar logros
  useEffect(() => {

    async function cargar() {

      if (!session?.user?.id) return;

      const stats = await getDashboardStats(
        session.user.id
      );

      const logrosData = obtenerLogros({
        ...stats,
        sesiones: stats.diasActivos,
      });

      const monedasGuardadas =
  await obtenerMonedas();

const xpGuardado =
  await obtenerXP();

setMonedas(monedasGuardadas);
setXpActual(xpGuardado);

      setLogros(logrosData);
    }

    cargar();

  }, [session]);

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >

      {/* Animación monedas */}
      <Modal
        visible={animando}
        transparent
        animationType="fade"
      >

        <View style={styles.animOverlay}>

          <Text style={styles.coinAnim}>
            🪙
          </Text>

          <Text style={styles.animText}>
            +500 monedas
          </Text>

        </View>

      </Modal>

      {/* Header */}
      <View style={styles.header}>

        <Text style={styles.title}>
          🏆 Mis Logros
        </Text>

        <View style={styles.coinCard}>
          <Text style={styles.coinText}>
            🪙 {monedas}
          </Text>
        </View>

      </View>

      <View style={styles.levelCard}>

        <Text style={styles.levelTitle}>
          ⭐ Nivel {nivel} - {TITULOS_NIVEL[nivel as keyof typeof TITULOS_NIVEL]}
        </Text>

        <Text style={styles.levelXp}>
          XP: {xpActual} / {xpSiguiente}
        </Text>

        <View style={styles.progressBar}>

          <View
            style={[
              styles.progressFill,
              {
                width: `${
                  Math.min(
                    (xpActual / xpSiguiente) * 100,
                    100
                  )
                }%`,
              },
            ]}
          />

        </View>

      </View>

      {/* Lista */}
      <View style={styles.grid}>

        {logros.map((logro) => (

          <View
            key={logro.id}
            style={[
              styles.card,
              logro.desbloqueado
                ? styles.cardUnlocked
                : styles.cardLocked,
            ]}
          >

            <Text style={styles.emoji}>
              {logro.desbloqueado
                ? logro.emoji
                : '🔒'}
            </Text>

            <Text style={styles.cardTitle}>
              {logro.titulo}
            </Text>

            {logro.desbloqueado ? (

              reclamados.includes(logro.id) ? (

                <Text style={styles.claimed}>
                  Reclamado ✅
                </Text>

              ) : (

                <TouchableOpacity
                  style={styles.claimBtn}
                  onPress={() =>
                    reclamarLogro(logro.id)
                  }
                >

                  <Text style={styles.claimText}>
                    Reclamar 🪙
                  </Text>

                </TouchableOpacity>

              )

            ) : (

              <Text style={styles.cardStatus}>
                Bloqueado
              </Text>

            )}

          </View>

        ))}

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

  header: {
    marginBottom: 30,
  },

  title: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 18,
  },

  coinCard: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },

  coinText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  levelCard: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },

  levelTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },

  levelXp: {
    color: Colors.textSecondary,
    marginBottom: 14,
  },

  progressBar: {
    backgroundColor: Colors.border,
    borderRadius: 999,
    overflow: 'hidden',
    height: 12,
  },

  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },

  grid: {
    gap: 16,
  },

  card: {
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
  },

  cardUnlocked: {
    backgroundColor: Colors.surface,
    borderColor: Colors.primary,
  },

  cardLocked: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    opacity: 0.5,
  },

  emoji: {
    fontSize: 42,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },

  cardStatus: {
    marginTop: 10,
    fontSize: 13,
    color: Colors.textSecondary,
  },

  claimBtn: {
    marginTop: 14,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },

  claimText: {
    color: '#fff',
    fontWeight: '700',
  },

  claimed: {
    marginTop: 14,
    color: '#4ade80',
    fontWeight: '700',
  },

  animOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  coinAnim: {
    fontSize: 120,
  },

  animText: {
    marginTop: 20,
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
  },

});