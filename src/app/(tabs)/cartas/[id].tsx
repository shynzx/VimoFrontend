import { useLocalSearchParams } from 'expo-router';
import { PantallaDetalleCarta } from '../../../views/PantallaDetalleCarta';

export default function RutaDetalleCarta() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PantallaDetalleCarta key={id} id={id} />;
}
