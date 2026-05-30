import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_MONEDAS = 'healthup_monedas';
const KEY_XP = 'healthup_xp';

export async function obtenerMonedas() {
  const valor =
    await AsyncStorage.getItem(KEY_MONEDAS);

  return Number(valor ?? 0);
}

export async function guardarMonedas(
  monedas: number
) {
  await AsyncStorage.setItem(
    KEY_MONEDAS,
    monedas.toString()
  );
}

export async function obtenerXP() {
  const valor =
    await AsyncStorage.getItem(KEY_XP);

  return Number(valor ?? 0);
}

export async function guardarXP(
  xp: number
) {
  await AsyncStorage.setItem(
    KEY_XP,
    xp.toString()
  );
}