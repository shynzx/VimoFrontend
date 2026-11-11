import { useLocalSearchParams } from 'expo-router';
import { PantallaDetalleManual } from '../../../../views/PantallaDetalleManual';
export default function DetalleVista() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PantallaDetalleManual id={id} vista />;
}
