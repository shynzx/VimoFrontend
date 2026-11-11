import { Fragment } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ui } from '../theme/styles';
import { colors, fonts, spacing, typography } from '../theme/tokens';

const plain = (s: string) => s.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, title, label) => label || title)
  .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/`([^`]+)`/g, '$1');
function Inline({ text }: { text: string }) {
  return <>{plain(text).split(/(\*\*[^*]+\*\*)/g).map((part, i) => part.startsWith('**')
    ? <Text key={i} style={styles.bold}>{part.slice(2, -2)}</Text> : <Fragment key={i}>{part.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1')}</Fragment>)}</>;
}

/** Presentación nativa de los capítulos: encabezados, párrafos, listas, citas y tablas desplazables. */
export function TextoManual({ contenido }: { contenido: string }) {
  const lines = contenido.replace(/\r/g, '').split('\n');
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || /^---+$/.test(line)) continue;
    if (line.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        const cells = lines[i].trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
        if (!cells.every((c) => /^:?-+:?$/.test(c))) rows.push(cells);
        i++;
      }
      i--;
      blocks.push(<ScrollView key={i} horizontal style={styles.table} accessibilityLabel="Tabla; desplaza horizontalmente para leer todas las columnas">
        <View>{rows.map((row, r) => <View key={r} style={[styles.row, r === 0 && styles.tableHeader]}>
          {row.map((cell, c) => <Text key={c} style={[styles.cell, r === 0 && styles.bold]}><Inline text={cell} /></Text>)}
        </View>)}</View>
      </ScrollView>);
    } else if (/^#{1,6} /.test(line)) {
      const heading = line.replace(/^#+ /, '');
      blocks.push(<Text key={i} style={styles.heading} accessibilityRole="header"><Inline text={heading} /></Text>);
    } else if (/^[-*] |^\d+\. /.test(line)) {
      blocks.push(<View key={i} style={styles.bullet}><Text style={styles.dot}>·</Text><Text style={[ui.copy, ui.flex]} selectable><Inline text={line.replace(/^[-*] |^\d+\. /, '')} /></Text></View>);
    } else if (line.startsWith('>')) {
      blocks.push(<Text key={i} style={styles.quote} selectable><Inline text={line.replace(/^> ?/, '')} /></Text>);
    } else {
      let paragraph = line;
      while (i + 1 < lines.length && lines[i + 1].trim() && !/^(?:#|\||>|[-*] |\d+\. )/.test(lines[i + 1].trim())) paragraph += '\n' + lines[++i].trim();
      blocks.push(<Text key={i} style={ui.copy} selectable><Inline text={paragraph} /></Text>);
    }
  }
  return <View style={styles.content}>{blocks}</View>;
}

const styles = StyleSheet.create({
  content: { gap: spacing.md },
  bold: { fontFamily: fonts.bodySemiBold, color: colors.text },
  heading: { ...typography.heading, color: colors.text, marginTop: spacing.lg },
  bullet: { flexDirection: 'row', gap: spacing.sm },
  dot: { ...typography.body, color: colors.primary },
  quote: { ...typography.bodySmall, color: colors.text, paddingLeft: spacing.md, borderLeftWidth: 2, borderLeftColor: colors.primary },
  table: { borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tableHeader: { backgroundColor: colors.surfaceRaised },
  cell: { ...typography.bodySmall, color: colors.textSecondary, width: 210, padding: spacing.md },
});
