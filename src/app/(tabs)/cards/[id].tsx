import { useLocalSearchParams } from 'expo-router';
import { CardDetailScreen } from '../../../views/CardDetailScreen';

export default function CardDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <CardDetailScreen key={id} id={id} />;
}
