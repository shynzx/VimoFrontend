import { useLocalSearchParams } from 'expo-router';
import { PantallaDetalleLore } from '../../../../views/PantallaDetalleLore';

export default function RutaDetalleLore() {
  const { tipo, id } = useLocalSearchParams<{ tipo: string; id: string }>();
  return <PantallaDetalleLore key={tipo + '/' + id} tipo={tipo} id={id} />;
}
