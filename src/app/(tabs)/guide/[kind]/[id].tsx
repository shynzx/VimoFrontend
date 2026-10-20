import { useLocalSearchParams } from 'expo-router';
import { LoreDetailScreen } from '../../../../views/LoreDetailScreen';

export default function LoreDetailRoute() {
  const { kind, id } = useLocalSearchParams<{ kind: string; id: string }>();
  return <LoreDetailScreen key={kind + '/' + id} kind={kind} id={id} />;
}
