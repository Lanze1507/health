import { supabase } from '../lib/supabase';

export async function getDashboardStats(usuarioId: string) {

  // Rutinas
  const { count: rutinasCount } = await supabase
    .from('rutina')
    .select('*', { count: 'exact', head: true })
    .eq('usuario_id', usuarioId);

  // Sesiones
  const { data: sesiones } = await supabase
    .from('sesion')
    .select('inicio')
    .eq('usuario_id', usuarioId)
    .not('fin', 'is', null);

  // Días activos únicos
  const diasUnicos = new Set(
    sesiones?.map((s) =>
      new Date(s.inicio).toDateString()
    ) ?? []
  );

  // Ejercicios totales
  const { data: rutinaEj } = await supabase
    .from('rutina_ejercicio')
    .select('id, rutina!inner(usuario_id)')
    .eq('rutina.usuario_id', usuarioId);

  const monedas =
  diasUnicos.size * 100;

let nivel = 1;

if (monedas >= 3500)
  nivel = 5;
else if (monedas >= 2000)
  nivel = 4;
else if (monedas >= 1000)
  nivel = 3;
else if (monedas >= 500)
  nivel = 2;

return {
  rutinas: rutinasCount ?? 0,
  ejercicios: rutinaEj?.length ?? 0,
  diasActivos: diasUnicos.size,

  monedas,
  xp: monedas,
  nivel,
};
}