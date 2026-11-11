import { useLocalSearchParams } from 'expo-router';
import { PantallaDetalleRegistro } from '../../../views/PantallaArchivo';
export default function DetalleRegistro() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <PantallaDetalleRegistro id={id} />;
}
